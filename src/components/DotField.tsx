import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// In CSS px: grid spacing, resting and fully hovered dot radius, cursor reach
const SPACING = 7;
const BASE_RADIUS = 1;
const MAX_RADIUS = 3;
const REACH = 90;

// Dotted background whose dots swell around the mouse cursor.
// The resting dots are a CSS background built from the same bitmap the canvas
// draws, so they scroll natively without any JavaScript. Only a small canvas
// under the cursor is ever redrawn: it paints over the background with
// enlarged dots and moves with the cursor, snapped to the dot grid.
export default function DotField({ children }: Props) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!field || !canvas || !ctx) return;

    // Everything below is in device px. The spacing is rounded to whole device
    // px so the background tiles and the canvas share one pixel grid
    let ratio = 0;
    let tile = SPACING;
    let cells = 0;
    let dotColor = "";
    let surfaceColor = "";
    let themeChanged = true;

    // Cursor in viewport px; null while it's off the page or on a touch screen
    let cursor: { x: number; y: number } | null = null;
    let frame = 0;

    const dot = (target: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
      target.moveTo(x + radius, y);
      target.arc(x, y, radius, 0, Math.PI * 2);
    };

    // Rebuild the background tile and resize the canvas for a new pixel ratio
    // or theme; both are rare, so the style reads here cost nothing per frame
    const rebuild = (nextRatio: number) => {
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

      // Enough whole cells to cover the reach on every side of the cursor's cell
      cells = 2 * Math.ceil((REACH * ratio) / tile) + 1;
      canvas.width = canvas.height = cells * tile;
      canvas.style.width = canvas.style.height = `${(cells * tile) / ratio}px`;
    };

    const draw = () => {
      frame = 0;

      const nextRatio = window.devicePixelRatio || 1;
      if (nextRatio !== ratio || themeChanged) rebuild(nextRatio);

      if (!cursor) {
        canvas.style.visibility = "hidden";
        return;
      }

      // Cursor in field space, where dot (col, row) sits at ((col + .5) * tile, ...)
      const fieldRect = field.getBoundingClientRect();
      const cursorX = (cursor.x - fieldRect.left) * ratio;
      const cursorY = (cursor.y - fieldRect.top) * ratio;
      const reach = REACH * ratio;

      const half = (cells - 1) / 2;
      const firstCol = Math.floor(cursorX / tile) - half;
      const firstRow = Math.floor(cursorY / tile) - half;

      // Snapped to the dot grid, so its dots land exactly on the background's
      canvas.style.transform = `translate(${(firstCol * tile) / ratio}px, ${(firstRow * tile) / ratio}px)`;
      canvas.style.visibility = "visible";

      // Opaque surface hides the background dots underneath
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      for (let col = 0; col < cells; col++) {
        for (let row = 0; row < cells; row++) {
          const x = (col + 0.5) * tile;
          const y = (row + 0.5) * tile;
          const closeness = Math.max(
            0,
            1 -
              Math.hypot(
                x + firstCol * tile - cursorX,
                y + firstRow * tile - cursorY,
              ) /
                reach,
          );
          dot(
            ctx,
            x,
            y,
            (BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * closeness * closeness) *
              ratio,
          );
        }
      }
      ctx.fill();
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

    // The page moves under a still cursor, so the bloom has to follow
    const onScroll = () => {
      if (cursor) schedule();
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
    draw();

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
      {/* Clips the canvas to the field when the cursor is near its edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-clip pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 invisible [image-rendering:auto]"
        />
      </div>
      <div className="relative flex flex-col gap-4 [image-rendering:auto]">
        {children}
      </div>
    </div>
  );
}
