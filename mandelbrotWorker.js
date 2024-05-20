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

function getColor(
  n,
  maxIterations,
  zoomLevel,
  baseColor,
  blendColors,
  randomColors
) {
  const t = n / maxIterations;
  const numColors = randomColors.length;

  let color;
  if (blendColors) {
    const zoomFactor = Math.log(zoomLevel) / Math.log(2);
    randomColors[0] = interpolateColor(
      randomColors[0],
      [255, 255, 255],
      zoomFactor % 1
    );
  }

  const colorIndex = Math.floor(t * (numColors - 1));
  const nextColorIndex = (colorIndex + 1) % numColors;
  const localT = t * (numColors - 1) - colorIndex;

  color = interpolateColor(
    randomColors[colorIndex],
    randomColors[nextColorIndex],
    localT
  );

  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

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

self.onmessage = function (e) {
  const {
    width,
    height,
    zoom,
    offsetX,
    offsetY,
    maxIterations,
    baseColor,
    blendColors,
    randomColors,
  } = e.data;
  const imageData = new Uint8ClampedArray(width * height * 4);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const c = {
        x: (x / width - 0.5) * (3.5 / zoom) + offsetX,
        y: (y / height - 0.5) * (2 / zoom) + offsetY,
      };

      const m = mandelbrot(c, maxIterations);
      const color = getColor(
        m,
        maxIterations,
        zoom,
        baseColor,
        blendColors,
        randomColors
      );

      const index = (x + y * width) * 4;
      const [r, g, b] = color.match(/\d+/g).map(Number);

      imageData[index] = r;
      imageData[index + 1] = g;
      imageData[index + 2] = b;
      imageData[index + 3] = 255;
    }
  }

  self.postMessage({ imageData, width, height });
};
