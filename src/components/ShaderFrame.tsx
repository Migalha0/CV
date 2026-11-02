import { useEffect, useRef, type ReactNode } from "react";
import { balatroFragment } from "../shaders/balatro";

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

// COLOUR_1..3 from the balatro shader
const FALLBACK = "conic-gradient(from 45deg, #ffff00, #006bb4, #162325, #006bb4, #ffff00)";

const VERTEX = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

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

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, balatroFragment);

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    // One triangle covering the whole viewport
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const iTime = gl.getUniformLocation(program, "iTime");
    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iRotation = gl.getUniformLocation(program, "iRotation");

    const rotation = Math.random() * Math.PI;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const start = performance.now();
    let frame = 0;
    let visible = false;

    // The canvas is taller than the card, so the animated loop only shades
    // the strip the card currently shows. GL's origin is the bottom left and
    // the canvas is pinned to the top, so that strip is the top of the canvas
    const draw = (full: boolean) => {
      if (full) {
        gl.disable(gl.SCISSOR_TEST);
      } else {
        const ratio = window.devicePixelRatio || 1;
        const shown = Math.min(
          canvas.height,
          Math.ceil(frameBox.clientHeight * ratio) + SCISSOR_MARGIN,
        );
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, canvas.height - shown, canvas.width, shown);
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(iTime, (performance.now() - start) / 1000);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iRotation, rotation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      draw(false);
      frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(() => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);

      // Resizing clears the canvas, so redraw straight away. Only the width
      // follows the card, so this runs on layout changes, not on the card
      // opening. Drawn in full, since with reduced motion it's the only draw
      draw(true);
    });
    resizeObserver.observe(canvas);

    // Only animate while the card is on screen. The canvas runs past the
    // card, so watch the frame, which is the card's size
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);

      if (visible && !reducedMotion) {
        loop();
      }
    });
    intersectionObserver.observe(frameBox);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
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
          className="absolute top-0 left-0 w-full h-[max(100lvh,100%)]"
          style={{ background: FALLBACK }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
