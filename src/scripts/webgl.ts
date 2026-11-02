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

// Links a program that runs `fragment` over the whole canvas and leaves it in
// use, ready to draw. Returns it with a function that frees what it created
export function createFullscreenProgram(
  gl: WebGLRenderingContext,
  fragment: string,
) {
  const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
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

  const dispose = () => {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  };

  return { program, dispose };
}

// Keeps the canvas' pixel size matched to its CSS size and redraws it: every
// frame while `target` is on screen, or only after resizes with reduced
// motion. `draw` gets the seconds since the start and whether it follows a
// resize. Returns a function that stops everything
export function animateCanvas(
  canvas: HTMLCanvasElement,
  target: Element,
  draw: (seconds: number, resized: boolean) => void,
) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const start = performance.now();
  const seconds = () => (performance.now() - start) / 1000;
  let frame = 0;

  const loop = () => {
    draw(seconds(), false);
    frame = requestAnimationFrame(loop);
  };

  const resizeObserver = new ResizeObserver(() => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);

    // Resizing clears the canvas, so redraw straight away, even with the
    // loop running: resize callbacks come after this frame's rAF draw
    draw(seconds(), true);
  });
  resizeObserver.observe(canvas);

  // Only animate while the target is on screen
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);

    if (entry.isIntersecting && !reducedMotion) {
      loop();
    }
  });
  intersectionObserver.observe(target);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
  };
}
