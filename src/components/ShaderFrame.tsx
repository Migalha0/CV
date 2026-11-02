import { useEffect, useRef, type ReactNode } from "react";
import { balatroFragment } from "../shaders/balatro";
import { PAINT_FALLBACK } from "../shaders/paint";
import { animateCanvas, createFullscreenProgram } from "../scripts/webgl";

interface Props {
  children: ReactNode;
}

// Must match the offset of --shadow-hard in index.css
const SHADOW = 12;

// Union of the card box and its offset shadow box, so the shader only shows
// through the (transparent) card border and the hard-shadow L-shape
const CLIP_PATH = `polygon(
    0 0,
    calc(100% - ${SHADOW}px) 0,
    calc(100% - ${SHADOW}px) ${SHADOW}px,
    100% ${SHADOW}px,
    100% 100%,
    ${SHADOW}px 100%,
    ${SHADOW}px calc(100% - ${SHADOW}px),
    0 calc(100% - ${SHADOW}px)
)`;

// Softens the shader's pixel blocks
const BLUR = 8;
// A blur spreads each pixel about three times its radius, so it fades a canvas
// out that far in from its own edges. The canvas runs this far past the frame
// on every side, or the frame's outer edges come out pale and look thin
const BLEED = 3 * BLUR;

// Extra device pixels drawn below the visible frame, in case the card grows
// a little between reading its height and the frame being shown
const SCISSOR_MARGIN = 64;

export default function ShaderFrame({ children }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frameBox = frameRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl");

    // No WebGL: the canvas' CSS gradient (shader palette) stays as a static frame
    if (!frameBox || !canvas || !gl) {
      console.warn("ShaderFrame: WebGL unavailable, using plain frame");
      return;
    }

    const { program, dispose } = createFullscreenProgram(gl, balatroFragment);

    const iTime = gl.getUniformLocation(program, "iTime");
    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iRotation = gl.getUniformLocation(program, "iRotation");

    const rotation = Math.random() * Math.PI;

    // The canvas is taller than the card, so the animated loop only shades
    // the strip the card currently shows, plus the bleed above and below it
    // that the blur reads from. GL's origin is the bottom left and the canvas
    // is pinned to the top, so that strip is the top of the canvas. After a
    // resize it's drawn in full, since with reduced motion it's the only draw
    const draw = (seconds: number, full: boolean) => {
      if (full) {
        gl.disable(gl.SCISSOR_TEST);
      } else {
        const ratio = window.devicePixelRatio || 1;
        const shown = Math.min(
          canvas.height,
          Math.ceil((frameBox.clientHeight + 2 * BLEED) * ratio) +
            SCISSOR_MARGIN,
        );
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, canvas.height - shown, canvas.width, shown);
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(iTime, seconds);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iRotation, rotation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // The canvas runs past the card, so watch the frame, which is the
    // card's size. Only the canvas' width follows the card, so resizes come
    // from layout changes, not from the card opening
    const stop = animateCanvas(canvas, frameBox, draw);

    return () => {
      stop();
      dispose();
    };
  }, []);

  // The canvas keeps a fixed size, at least as tall as the screen, and the
  // frame around it follows the card and crops it. Sized to the card instead,
  // the canvas would be cleared and the pattern (scaled to the canvas size)
  // stretched on every frame of the preview opening
  return (
    <div className="relative w-full h-fit">
      <div
        ref={frameRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-[calc(100%+12px)] h-[calc(100%+12px)] overflow-hidden"
        style={{ clipPath: CLIP_PATH }}
      >
        <canvas
          ref={canvasRef}
          className="absolute"
          style={{
            top: -BLEED,
            left: -BLEED,
            width: `calc(100% + ${2 * BLEED}px)`,
            height: `max(100lvh, calc(100% + ${2 * BLEED}px))`,
            background: PAINT_FALLBACK,
            filter: `blur(${BLUR}px)`,
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
