const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const maxIterationsInput = document.getElementById("maxIterations");
const resolutionInput = document.getElementById("resolution");
const initialZoomInput = document.getElementById("initialZoom");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");
const randomizeColorsButton = document.getElementById("randomizeColorsButton");
const baseColorInput = document.getElementById("baseColor");
const loading = document.getElementById("loading");

let zoom = parseFloat(initialZoomInput.value);
let offsetX = -0.5;
let offsetY = 0;
let maxIterations = parseInt(maxIterationsInput.value);
let resolution = parseInt(resolutionInput.value);

canvas.width = resolution;
canvas.height = resolution * 0.5625; // 16:9 aspect ratio

const worker = new Worker("mandelbrotWorker.js");

worker.onmessage = function (e) {
  const { imageData, width, height } = e.data;
  const imgData = new ImageData(imageData, width, height);
  ctx.putImageData(imgData, 0, 0);
  loading.style.display = "none";
};

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = (x / canvas.width - 0.5) * (3.5 / zoom) + offsetX;
  const cy = (y / canvas.height - 0.5) * (2 / zoom) + offsetY;

  zoom *= 2;
  offsetX = cx;
  offsetY = cy;
  initialZoomInput.value = zoom.toFixed(2);
  drawMandelbrot();
});

resetButton.addEventListener("click", () => {
  zoom = parseFloat(initialZoomInput.value);
  offsetX = -0.5;
  offsetY = 0;
  initialZoomInput.value = 1;
  zoom = 1;

  maxIterations = parseInt(maxIterationsInput.value);
  resolution = parseInt(resolutionInput.value);
  canvas.width = resolution;
  canvas.height = resolution * 0.5625; // 16:9 aspect ratio
  drawMandelbrot();
});

randomizeColorsButton.addEventListener("click", () => {
  generateRandomColors();
  drawMandelbrot();
});

baseColorInput.addEventListener("input", () => {
  generateRandomColors(true);
  drawMandelbrot();
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let randomColors = [];

function generateRandomColors(useBase = false) {
  randomColors = [];
  for (let i = 0; i < 5; i++) {
    if (useBase && i === 0) {
      randomColors.push(hexToRgb(baseColorInput.value));
    } else {
      randomColors.push(hexToRgb(getRandomColor()));
    }
  }
  console.log("Random Colors: ", randomColors);
}

function mandelbrot(c) {
  let z = { x: 0, y: 0 };
  let n = 0;

  while (n < maxIterations && z.x * z.x + z.y * z.y <= 4) {
    const xTemp = z.x * z.x - z.y * z.y + c.x;
    z.y = 2 * z.x * z.y + c.y;
    z.x = xTemp;
    n++;
  }

  return n;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function interpolateColor(color1, color2, factor) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
  }
  return result;
}

function getColor(n, maxIterations) {
  const t = n / maxIterations;
  const numColors = randomColors.length;

  const colorIndex = Math.floor(t * (numColors - 1));
  const nextColorIndex = (colorIndex + 1) % numColors;
  const localT = t * (numColors - 1) - colorIndex;

  const color = interpolateColor(
    randomColors[colorIndex],
    randomColors[nextColorIndex],
    localT
  );

  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function drawMandelbrot() {
  const width = canvas.width;
  const height = canvas.height;

  loading.style.display = "block";

  worker.postMessage({
    width,
    height,
    zoom,
    offsetX,
    offsetY,
    maxIterations,
    baseColor: baseColorInput.value,
    randomColors,
  });
}

drawButton.addEventListener("click", () => {
  maxIterations = parseInt(maxIterationsInput.value);
  resolution = parseInt(resolutionInput.value);
  zoom = parseFloat(initialZoomInput.value);
  canvas.width = resolution;
  canvas.height = resolution * 0.5625; // 16:9 aspect ratio
  drawMandelbrot();
});

generateRandomColors();
drawMandelbrot();
