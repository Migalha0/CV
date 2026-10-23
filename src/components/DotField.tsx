import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// In CSS px: grid spacing, resting and fully hovered dot radius, cursor reach
const SPACING = 15;
const BASE_RADIUS = 1;
const MAX_RADIUS = 4;
const REACH = 45;

// Each dot's radius is a damped spring chasing its target, so dots pop up
// past their size and settle, and keep wobbling back down after the cursor
// has moved on. Stiffness in 1/s², damping ratio below 1 for the bounce
const STIFFNESS = 1000;
const DAMPING_RATIO = 0.21;
// Close enough to the target, in CSS px and CSS px/s, to stop animating
const SETTLE = 0.01;

// Dotted background whose dots swell around the mouse cursor.
// The resting dots are a CSS background built from the same bitmap the canvas
// draws, so they scroll natively without any JavaScript. Dots that are swollen
// or still springing back are drawn on a viewport-sized canvas that sticks to
// the screen inside the field: each one paints its cell with the surface color
// to hide the background dot, then draws itself at its current size.
export default function DotField({ children }: Props) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!field || !canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Everything below is in device px. The spacing is rounded to whole device
    // px so the background tiles and the canvas share one pixel grid
    let ratio = 0;
    let tile = SPACING;
    let dotColor = "";
    let surfaceColor = "";
    let themeChanged = true;

    // Cursor in viewport px; null while it's off the page or on a touch screen
    let cursor: { x: number; y: number } | null = null;
    let frame = 0;
    let last = 0;

    // Dots off their resting size, by grid cell. Radius and velocity are in
    // CSS px; each dot gets a slightly different stiffness, so neighbors fall
    // out of step and the bloom reads as separate circles, not one shadow
    interface Dot {
      col: number;
      row: number;
      radius: number;
      velocity: number;
      stiffness: number;
    }
    const dots = new Map<number, Dot>();
    const key = (col: number, row: number) => row * 0x10000 + col;

    // Canvas area painted last frame, cleared before the next one
    let dirty: [number, number, number, number] | null = null;

    const dot = (
      target: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
    ) => {
      target.moveTo(x + radius, y);
      target.arc(x, y, radius, 0, Math.PI * 2);
    };

    // Rebuild the background tile for a new pixel ratio or theme; both are
    // rare, so the style reads here cost nothing per frame
    const rebuild = (nextRatio: number) => {
      if (nextRatio !== ratio) dots.clear();
      ratio = nextRatio;
      tile = Math.max(1, Math.round(SPACING * ratio));

      const style = getComputedStyle(field);
      dotColor = style.getPropertyValue("--theme-grid-pattern").trim();
      surfaceColor = style.getPropertyValue("--theme-surface").trim();
      themeChanged = false;

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = tileCanvas.height = tile;
      const tileCtx = tileCanvas.getContext("2d")!;
      tileCtx.fillStyle = dotColor;
      tileCtx.beginPath();
      dot(tileCtx, tile / 2, tile / 2, BASE_RADIUS * ratio);
      tileCtx.fill();

      field.style.backgroundImage = `url(${tileCanvas.toDataURL()})`;
      field.style.backgroundSize = `${tile / ratio}px ${tile / ratio}px`;
    };

    // Smoothstep falloff: a full-size core that rolls off near the edge,
    // instead of a soft cone that reads as a shadow
    const targetRadius = (distance: number) => {
      const t = Math.max(0, 1 - distance / REACH);
      return BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * t * t * (3 - 2 * t);
    };

    const draw = (time: number) => {
      frame = 0;
      // Clamped, so a frame after a stall doesn't fling the springs
      const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;

      const nextRatio = window.devicePixelRatio || 1;
      if (nextRatio !== ratio || themeChanged) rebuild(nextRatio);

      // The canvas backing store only exists once a mouse shows up, so touch
      // screens never allocate a screen-sized bitmap
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        dirty = null;
      }

      const fieldRect = field.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      // CSS px per tile, and the canvas' offset into the field in device px
      const cell = tile / ratio;
      const offsetX = (canvasRect.left - fieldRect.left) * ratio;
      const offsetY = (canvasRect.top - fieldRect.top) * ratio;

      // Wake up every dot the cursor reaches, in field CSS px
      let cursorX = 0;
      let cursorY = 0;
      if (cursor) {
        cursorX = cursor.x - fieldRect.left;
        cursorY = cursor.y - fieldRect.top;
        const span = Math.ceil(REACH / cell);
        const centerCol = Math.floor(cursorX / cell);
        const centerRow = Math.floor(cursorY / cell);
        for (let col = centerCol - span; col <= centerCol + span; col++) {
          for (let row = centerRow - span; row <= centerRow + span; row++) {
            if (col < 0 || row < 0) continue;
            const id = key(col, row);
            if (dots.has(id)) continue;
            const x = (col + 0.5) * cell - cursorX;
            const y = (row + 0.5) * cell - cursorY;
            if (Math.hypot(x, y) >= REACH) continue;
            // Cheap per-cell hash for a stable ±20% stiffness spread
            const hash = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
            dots.set(id, {
              col,
              row,
              radius: BASE_RADIUS,
              velocity: 0,
              stiffness: STIFFNESS * (0.8 + 0.4 * (hash - Math.floor(hash))),
            });
          }
        }
      }

      // Step every spring toward its target; resting dots leave the map
      let moving = false;
      for (const [id, d] of dots) {
        const target = cursor
          ? targetRadius(
              Math.hypot(
                (d.col + 0.5) * cell - cursorX,
                (d.row + 0.5) * cell - cursorY,
              ),
            )
          : BASE_RADIUS;

        if (still) {
          d.radius = target;
          d.velocity = 0;
        } else {
          const damping = 2 * DAMPING_RATIO * Math.sqrt(d.stiffness);
          d.velocity +=
            (d.stiffness * (target - d.radius) - damping * d.velocity) * dt;
          d.radius = Math.max(0, d.radius + d.velocity * dt);
        }

        if (
          Math.abs(target - d.radius) < SETTLE &&
          Math.abs(d.velocity) < SETTLE
        ) {
          d.radius = target;
          d.velocity = 0;
          if (target === BASE_RADIUS) dots.delete(id);
        } else {
          moving = true;
        }
      }

      if (dirty) ctx.clearRect(...dirty);
      dirty = null;

      if (dots.size) {
        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;

        // Cells first, rounded to whole device px so neighbors meet without
        // seams, then all the dots, so an overshooting dot isn't cut off by
        // the next cell's square
        ctx.fillStyle = surfaceColor;
        for (const d of dots.values()) {
          const x0 = Math.round(d.col * tile - offsetX);
          const y0 = Math.round(d.row * tile - offsetY);
          const x1 = Math.round((d.col + 1) * tile - offsetX);
          const y1 = Math.round((d.row + 1) * tile - offsetY);
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
          left = Math.min(left, x0);
          top = Math.min(top, y0);
          right = Math.max(right, x1);
          bottom = Math.max(bottom, y1);
        }

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        for (const d of dots.values()) {
          dot(
            ctx,
            (d.col + 0.5) * tile - offsetX,
            (d.row + 0.5) * tile - offsetY,
            d.radius * ratio,
          );
        }
        ctx.fill();

        // Overshooting dots can spill a tile past their cells
        dirty = [
          left - tile,
          top - tile,
          right - left + 2 * tile,
          bottom - top + 2 * tile,
        ];
      }

      if (moving) {
        last = time;
        frame = requestAnimationFrame(draw);
      } else {
        last = 0;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    // Mouse and pen only: on touch screens a finger is scrolling, not hovering
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cursor = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onPointerLeave = () => {
      cursor = null;
      schedule();
    };

    // The page moves under a still cursor and the canvas, so redraw
    const onScroll = () => {
      if (dots.size || cursor) schedule();
    };

    // The theme toggles the "dark" class on <html>
    const themeObserver = new MutationObserver(() => {
      themeChanged = true;
      schedule();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Zooming changes devicePixelRatio and fires resize
    window.addEventListener("resize", schedule);

    // Paint the background right away instead of a frame later
    rebuild(window.devicePixelRatio || 1);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      field.style.removeProperty("background-image");
      field.style.removeProperty("background-size");
    };
  }, []);

  return (
    <div ref={fieldRef} className="relative [image-rendering:pixelated]">
      {/* Clips the canvas to the field; the canvas sticks to the viewport
          while the field scrolls past */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-clip pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="sticky top-0 block w-full h-screen [image-rendering:auto]"
        />
      </div>
      <div className="relative flex flex-col gap-4 [image-rendering:auto]">
        {children}
      </div>
    </div>
  );
}
