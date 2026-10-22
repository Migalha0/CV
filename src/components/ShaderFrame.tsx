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

export default function ShaderFrame({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl");

    // No WebGL: the canvas' bg-border class acts as a plain frame
    if (!canvas || !gl) return;

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

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(iTime, (performance.now() - start) / 1000);
      gl.uniform2f(iResolution, canvas.width, canvas.height);
      gl.uniform1f(iRotation, rotation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(() => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);

      // Resizing clears the canvas, so redraw when the loop isn't running
      if (reducedMotion || !visible) draw();
    });
    resizeObserver.observe(canvas);

    // Only animate while the card is on screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);

      if (visible && !reducedMotion) {
        loop();
      }
    });
    intersectionObserver.observe(canvas);

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

  return (
    <div className="relative w-full h-fit">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-[calc(100%+12px)] h-[calc(100%+12px)] bg-border"
        style={{ clipPath: CLIP_PATH }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
