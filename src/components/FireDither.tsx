import { useEffect, useRef } from "react";

interface Props {
  // Edge the flames rise from: "down" burns from the top, "right" from the left
  direction: "down" | "right";
  // Average flame length, as a fraction of the element along the direction
  reach?: number;
  // Peak heat at the source edge. Below 1 the source itself stays dithered,
  // above 1 the flames stay solid for a stretch before they start to break up
  heat?: number;
  // 0..1: how far the source heat swells and shrinks over time; 0 burns steady
  pulse?: number;
  // 0..1: how much fixed random noise roughens the neat ordered-dither grid
  jitter?: number;
  // Size of one fire pixel, in CSS px
  cell?: number;
  // Tailwind classes for the layer; the flames are drawn in its text color
  className?: string;
}

const FPS = 30;
// Buffers and canvas grow in steps of this many fire pixels, so a resize
// usually fits in what's already allocated
const CHUNK = 128;
// Side of the square dither threshold tile, a power of two
const TILE = 64;

// 4x4 ordered-dither thresholds, so heat turns into on/off pixels
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (n) => (n + 0.5) / 16,
);

// Pixel fire, dithered to a single color. Heat is fed in along one edge and
// each tick every pixel pulls the heat of its neighbor one step closer to the
// source, drifting sideways at random and cooling a little, the same spread
// as the classic Doom fire. The source heat can pulse so the flames swell and
// shrink, each instance on its own rhythm. It fills its positioned parent and
// pauses while off screen.
//
// Resizing has to keep up with a window drag, so it never reruns the
// simulation: the running fire is stretched onto the new size in one pass,
// and the buffers and canvas only reallocate when they outgrow their chunk.
// The canvas can be larger than the layer, which clips it.
export default function FireDither({
  direction,
  reach = 0.5,
  heat = 1,
  pulse = 0.15,
  jitter = 0,
  cell = 2,
  className = "",
}: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!layer || !canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const down = direction === "down";

    // Visible grid in fire pixels; "along" runs away from the source edge
    let width = 0;
    let height = 0;
    let along = 0;
    let across = 0;
    let cooling = 0;
    // Furthest row from the source that held any heat after the last tick
    let reached = 0;

    // Allocated grid. Rows are always stride pixels apart, whatever the
    // visible width, so the buffers survive any resize that fits
    let stride = 0;
    let rows = 0;
    let fire = new Float32Array(0);
    let spare = new Float32Array(0);
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);
    let color = 0;

    // Index steps for one pixel further from the source and one pixel across
    let alongStep = 0;
    let acrossStep = 0;

    // xorshift32: far cheaper than Math.random for a few million calls a second
    let seed = (Math.random() * 0xffffffff) >>> 0 || 1;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 0x100000000;
    };

    // Dither thresholds: the ordered grid stays put, while the noise mixed in
    // drifts with the flames, so it breaks up the grid without leaving stray
    // pixels frozen in place or crawling like static
    const ordered = new Float32Array(TILE * TILE);
    const noise = new Float32Array(TILE * TILE);
    for (let y = 0; y < TILE; y++) {
      for (let x = 0; x < TILE; x++) {
        ordered[y * TILE + x] = BAYER[(y & 3) * 4 + (x & 3)] * (1 - jitter);
        noise[y * TILE + x] = random() * jitter;
      }
    }
    // How far the noise has drifted from the source, one pixel per tick
    let drift = 0;

    // Own phase and period, so no two fires swell in step
    const phase = Math.random() * Math.PI * 2;
    const period = 500 + Math.random() * 300;

    let frame = 0;
    let last = 0;
    let visible = false;

    // Any CSS color as a pixel word, by painting it onto a 1x1 canvas
    const swatch = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    })!;
    swatch.canvas.width = swatch.canvas.height = 1;
    const toPixel = (css: string) => {
      swatch.clearRect(0, 0, 1, 1);
      if (!css) return 0;
      swatch.fillStyle = css;
      swatch.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data;
      // ImageData is RGBA in memory, so little-endian words are ABGR
      return a ? ((a << 24) | (b << 16) | (g << 8) | r) >>> 0 : 0;
    };

    const readColor = () => {
      color = toPixel(getComputedStyle(layer).color);
    };

    // Mean heat a pixel settles at, a distance from the source
    const settled = (a: number) =>
      heat * (1 - pulse / 2) * 0.95 - (a * cooling) / 2;

    const layout = (cssWidth: number, cssHeight: number) => {
      const nextWidth = Math.max(1, Math.ceil(cssWidth / cell));
      const nextHeight = Math.max(1, Math.ceil(cssHeight / cell));
      if (nextWidth === width && nextHeight === height) return;

      const oldFire = fire;
      const oldAlongStep = alongStep;
      const oldAcrossStep = acrossStep;
      const oldAlong = along;
      const oldAcross = across;

      // Outgrown: allocate the next chunk up and resize the canvas, which is
      // the only time its pixels are reallocated
      if (nextWidth > stride || nextHeight > rows) {
        stride = Math.max(stride, Math.ceil(nextWidth / CHUNK) * CHUNK);
        rows = Math.max(rows, Math.ceil(nextHeight / CHUNK) * CHUNK);
        fire = new Float32Array(stride * rows);
        spare = new Float32Array(stride * rows);
        image = ctx.createImageData(stride, rows);
        pixels = new Uint32Array(image.data.buffer);
        canvas.width = stride;
        canvas.height = rows;
        canvas.style.width = `${stride * cell}px`;
        canvas.style.height = `${rows * cell}px`;
      }

      width = nextWidth;
      height = nextHeight;
      [along, across] = down ? [height, width] : [width, height];
      [alongStep, acrossStep] = down ? [stride, 1] : [1, stride];
      // Mean loss of 1 / (reach * along) per step burns out at about the reach
      cooling = 2 / Math.max(1, reach * along);

      const target = oldFire === fire ? spare : fire;

      if (oldAlong === 0) {
        // First layout: start from the fire's settled shape plus the spread
        // its random cooling builds up, instead of burning it in step by step
        for (let a = 0; a < along; a++) {
          const mean = settled(a);
          const spread = cooling * Math.sqrt(a / 3);
          for (let c = 0; c < across; c++) {
            const value = mean + (random() + random() - 1) * spread;
            target[a * alongStep + c * acrossStep] = value > 0 ? value : 0;
          }
        }
      } else {
        // Stretch the running fire along its length, since the reach scales
        // with it, and tile it across, where new pixels soon go their own way
        const scale = oldAlong / along;
        for (let a = 0; a < along; a++) {
          const from = Math.min(oldAlong - 1, (a * scale) | 0) * oldAlongStep;
          const to = a * alongStep;
          for (let c = 0; c < across; c++) {
            target[to + c * acrossStep] =
              oldFire[from + (c % oldAcross) * oldAcrossStep];
          }
        }
      }

      if (target === spare) {
        spare = fire;
        fire = target;
      }
      // Stretched or seeded heat can sit anywhere, so the next tick scans it all
      reached = along;
    };

    const step = (time: number) => {
      // Heat only moves one row per tick, so rows past one beyond the last
      // burning row are still cold and can be skipped
      const first = Math.min(along - 1, reached + 1);
      reached = 0;

      // Far end first, so each pixel reads its neighbor's heat from the last
      // tick. One xorshift draw per pixel: the low two bits pick the sideways
      // drift (-1, 0, 0 or +1) and the high bits the cooling
      const edge = across - 1;
      const scale = cooling / 0x1000000;
      let s = seed;
      for (let a = first; a > 0; a--) {
        const row = a * alongStep;
        const previous = row - alongStep;
        let burning = false;
        for (let c = 0; c < across; c++) {
          s ^= s << 13;
          s ^= s >>> 17;
          s ^= s << 5;
          let from = c + (s & 1) - ((s >>> 1) & 1);
          if (from < 0) from = 0;
          else if (from > edge) from = edge;
          const value =
            fire[previous + from * acrossStep] - (s >>> 8) * scale;
          if (value > 0) {
            fire[row + c * acrossStep] = value;
            burning = true;
          } else {
            fire[row + c * acrossStep] = 0;
          }
        }
        if (burning && a > reached) reached = a;
      }
      seed = s;
      drift++;

      // Slow swell plus per-pixel flicker at the source
      const swell = 1 - pulse + pulse * Math.sin(time / period + phase);
      for (let c = 0; c < across; c++) {
        fire[c * acrossStep] = heat * swell * (0.9 + 0.1 * random());
      }
    };

    const paint = () => {
      const mask = TILE - 1;
      const driftX = down ? 0 : drift;
      const driftY = down ? drift : 0;
      for (let y = 0; y < height; y++) {
        const row = y * stride;
        const orderedRow = (y & mask) * TILE;
        const noiseRow = ((y - driftY) & mask) * TILE;
        for (let x = 0; x < width; x++) {
          const threshold =
            ordered[orderedRow + (x & mask)] +
            noise[noiseRow + ((x - driftX) & mask)];
          pixels[row + x] = fire[row + x] > threshold ? color : 0;
        }
      }
      // Only the visible corner; the rest of the canvas is clipped away
      ctx.putImageData(image!, 0, 0, 0, 0, width, height);
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 1000 / FPS) return;
      last = time;
      step(time);
      paint();
    };

    const start = () => {
      if (!frame && visible && !still) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Runs before paint on every layout change, so the fire never lags the
    // box. The entry already holds the size, so nothing forces a layout
    const resizeObserver = new ResizeObserver(([entry]) => {
      layout(entry.contentRect.width, entry.contentRect.height);
      paint();
    });

    readColor();
    resizeObserver.observe(layer);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersectionObserver.observe(layer);

    // The flame color may come from the theme, which toggles "dark" on <html>
    const themeObserver = new MutationObserver(() => {
      readColor();
      paint();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [direction, reach, heat, pulse, jitter, cell]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-clip pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 [image-rendering:pixelated]"
      />
    </div>
  );
}
