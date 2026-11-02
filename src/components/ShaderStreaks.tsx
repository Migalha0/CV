import { useEffect, useRef, type RefObject } from "react";
import { streaksFragment } from "../shaders/streaks";
import { animateCanvas, createFullscreenProgram } from "../scripts/webgl";

interface Props {
  // Element at the left edge (a title) to keep solid yellow behind, so dark
  // text on it stays readable
  solidRef?: RefObject<HTMLElement | null>;
  // Tailwind classes for the layer
  className?: string;
}

// CSS px per paint unit, about what the cards' paint works out to
const UNIT = 32;
// Softens the paint like the cards' frame does, scaled down to a short strip
const BLUR = 3;
// A blur spreads each pixel about three times its radius, so the canvas runs
// that far past the layer, or the strip's edges would come out pale
const BLEED = 3 * BLUR;

// The cards' paint in yellow, streaming out to the right across its
// positioned parent, which it fills. Pauses while off screen. Without WebGL
// it falls back to a plain yellow block behind the solid element
export default function ShaderStreaks({ solidRef, className = "" }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;

    // Width of the solid element, in CSS px from the layer's left edge
    let solid = 0;
    const solidObserver = new ResizeObserver(() => {
      solid = solidRef?.current?.offsetWidth ?? 0;
      layer.style.setProperty("--solid", `${solid}px`);
    });
    if (solidRef?.current) solidObserver.observe(solidRef.current);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      layer.style.background =
        "linear-gradient(90deg, var(--color-brand-yellow) var(--solid), transparent calc(var(--solid) + 48px))";
      return () => solidObserver.disconnect();
    }

    const { program, dispose } = createFullscreenProgram(gl, streaksFragment);

    const iTime = gl.getUniformLocation(program, "iTime");
    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iUnit = gl.getUniformLocation(program, "iUnit");
    const iSolid = gl.getUniformLocation(program, "iSolid");
    const iSeed = gl.getUniformLocation(program, "iSeed");

    const seed = Math.random() * 100;

    const stop = animateCanvas(canvas, layer, (seconds) => {
      const ratio = window.devicePixelRatio || 1;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(iTime, seconds);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iUnit, UNIT * ratio);
      // The canvas starts BLEED px left of the layer
      gl.uniform1f(iSolid, (solid + BLEED) * ratio);
      gl.uniform1f(iSeed, seed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    });

    return () => {
      stop();
      solidObserver.disconnect();
      dispose();
    };
  }, [solidRef]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{
          top: -BLEED,
          left: -BLEED,
          width: `calc(100% + ${2 * BLEED}px)`,
          height: `calc(100% + ${2 * BLEED}px)`,
          filter: `blur(${BLUR}px)`,
        }}
      />
    </div>
  );
}
