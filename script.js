const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const maxIterationsInput = document.getElementById("maxIterations");
const maxIterationsValue = document.getElementById("maxIterationsValue");
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
  const { imageData, width, height, startRow, endRow } = e.data;
  const imgData = new ImageData(imageData, width, endRow - startRow);
  ctx.putImageData(imgData, 0, startRow);
  if (endRow >= height) {
    loading.style.display = "none";
  }
};

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (e.button === 2) {
    // Right click
    const cx = (x / canvas.width - 0.5) * (3.5 / zoom) + offsetX;
    const cy = (y / canvas.height - 0.5) * (2 / zoom) + offsetY;

    zoom /= 2;
    offsetX = cx - (cx - offsetX) / 2;
    offsetY = cy - (cy - offsetY) / 2;
  } else {
    // Left click
    const cx = (x / canvas.width - 0.5) * (3.5 / zoom) + offsetX;
    const cy = (y / canvas.height - 0.5) * (2 / zoom) + offsetY;

    zoom *= 2;
    offsetX = cx;
    offsetY = cy;
  }

  initialZoomInput.value = zoom.toFixed(2);
  drawMandelbrot();
});

// Disable context menu on right-click
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

resetButton.addEventListener("click", () => {
  zoom = 1;
  offsetX = -0.5;
  offsetY = 0;
  initialZoomInput.value = zoom;
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

maxIterationsInput.addEventListener("input", () => {
  maxIterations = parseInt(maxIterationsInput.value);
  maxIterationsValue.textContent = maxIterations;
  drawMandelbrot();
});

drawButton.addEventListener("click", () => {
  maxIterations = parseInt(maxIterationsInput.value);
  resolution = parseInt(resolutionInput.value);
  zoom = parseFloat(initialZoomInput.value);
  canvas.width = resolution;
  canvas.height = resolution * 0.5625; // 16:9 aspect ratio
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
  for (let i = 0; i < 10; i++) {
    if (useBase && i === 0) {
      randomColors.push(hexToRgb(baseColorInput.value));
    } else {
      randomColors.push(hexToRgb(getRandomColor()));
    }
  }
  console.log("Random Colors: ", randomColors);
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

function getColor(n, maxIterations, randomColors) {
  if (n === maxIterations) {
    return [0, 0, 0]; // Black for points within the Mandelbrot set
  }

  const t = n / maxIterations;
  const numColors = randomColors.length;

  const colorIndex = Math.floor(t * (numColors - 1));
  const nextColorIndex = (colorIndex + 1) % numColors;
  const localT = t * (numColors - 1) - colorIndex;

  return interpolateColor(
    randomColors[colorIndex],
    randomColors[nextColorIndex],
    localT
  );
}

function drawMandelbrot() {
  const width = canvas.width;
  const height = canvas.height;

  loading.style.display = "block";

  const chunkSize = 50; // Number of rows per chunk
  let currentChunk = 0;

  function renderChunk() {
    const startRow = currentChunk * chunkSize;
    const endRow = Math.min((currentChunk + 1) * chunkSize, height);

    worker.postMessage({
      width,
      height,
      startRow,
      endRow,
      zoom,
      offsetX,
      offsetY,
      maxIterations,
      randomColors,
    });

    currentChunk++;
    if (startRow < height) {
      requestAnimationFrame(renderChunk);
    }
  }

  renderChunk();
}

generateRandomColors();
drawMandelbrot();
