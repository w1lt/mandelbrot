# Mandelbrot Set Visualizer

Welcome to the Mandelbrot Set Visualizer! This project is an interactive tool that allows you to explore the fascinating world of the Mandelbrot set, a famous fractal in complex mathematics.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [About the Mandelbrot Set](#about-the-mandelbrot-set)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Features

- **Interactive Zooming**: Click to zoom in, right-click to zoom out.
- **Color Customization**: Choose a base color and generate random color schemes for the fractal.
- **Adjustable Parameters**: Modify the maximum number of iterations and resolution for rendering the set.
- **Axis Display**: Toggle the display of axes and their values.
- **Responsive Design**: Maintains a 16:9 aspect ratio and adapts to various resolutions.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/w1lt/mandelbrot.git
   cd mandelbrot
   ```

2. **Open the `index.html` file** in your favorite web browser to start the visualizer.

## Usage

### Controls

- **Base Color**: Select a base color to influence the color scheme of the fractal.
- **Max Iterations**: Use the slider to set the maximum number of iterations for determining point divergence.
- **Resolution**: Enter a value to set the resolution of the canvas.
- **Zoom**: Adjust the initial zoom level.
- **Show Axes**: Toggle the display of axes and their values.
- **Re-Draw**: Redraw the fractal with the current settings.
- **Reset**: Reset the zoom and offsets to the default values.
- **Randomize Colors**: Generate a new random color scheme based on the selected base color.

### Interactions

- **Zoom In**: Click on the canvas to zoom in on a point.
- **Zoom Out**: Right-click on the canvas to zoom out from a point.
- **Pan**: Click and drag to pan around the fractal (if implemented).

## About the Mandelbrot Set

The Mandelbrot set is a set of complex numbers defined by the recursive formula:

\[ f(z) = z^2 + c \]

A complex number \( c \) is in the Mandelbrot set if, when iterated from \( z = 0 \), the sequence does not diverge. This means the absolute value of \( z \) remains bounded.

### Visualizing the Mandelbrot Set

Each point on the canvas corresponds to a complex number. The color of each point is determined by how quickly the sequence diverges, with points that remain within the set colored black.

## Acknowledgements

- **[Numberphile](https://www.youtube.com/watch?v=FFftmWSzgmk)**: For the inspirational video explaining the Mandelbrot set.
- **[OpenAI's ChatGPT](https://www.openai.com/)**: For assistance in creating this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
