self.onmessage = function (e) {
  const {
    width,
    height,
    startRow,
    endRow,
    zoom,
    offsetX,
    offsetY,
    maxIterations,
    randomColors,
  } = e.data;
  const imageData = new Uint8ClampedArray(width * (endRow - startRow) * 4);

  for (let x = 0; x < width; x++) {
    for (let y = startRow; y < endRow; y++) {
      const c = {
        x: (x / width - 0.5) * (3.5 / zoom) + offsetX,
        y: (y / height - 0.5) * (2 / zoom) + offsetY,
      };

      const m = mandelbrot(c, maxIterations);
      const color = getColor(m, maxIterations, randomColors);

      const index = (x + (y - startRow) * width) * 4;
      const [r, g, b] = color;

      imageData[index] = r;
      imageData[index + 1] = g;
      imageData[index + 2] = b;
      imageData[index + 3] = 255;
    }
  }

  self.postMessage({ imageData, width, height, startRow, endRow });
};

function mandelbrot(c, maxIterations) {
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
