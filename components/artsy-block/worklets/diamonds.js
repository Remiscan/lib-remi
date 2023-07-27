import { Point2D } from '/_common/js/geometry/mod.js';
import { mulberry32, xmur3a } from '/_common/js/prng/mod.js';



registerPaint('diamond-cells', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--base-saturation', '--base-lightness', '--max-hue-spread', '--max-offset', '--min-scale', '--max-scale']; }

  paint(ctx, size, props) {
    const baseSeed = props.get('--base-seed');

    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 40;
    const frequency = Number(props.get('--frequency')) ?? 100;
    const baseHue = Number(props.get('--base-hue'));
    const baseSaturation = Number(props.get('--base-saturation'));
    const baseLightness = Number(props.get('--base-lightness'));
    const maxHueSpread = Number(props.get('--max-hue-spread'));
    const maxOffsetCoeff = Number(props.get('--max-offset')) / 100;
    const minScaleCoeff = Number(props.get('--min-scale')) / 100;
    const maxScaleCoeff = Math.max(minScaleCoeff, Number(props.get('--max-scale')) / 100);

    const columns = Math.ceil(size.width / cellSize);
    const rows = Math.ceil(size.height / cellSize);

    // Base shape
    const origin = new Point2D(0, 0);
    const corners = [
      origin.translate(0, 0),
      origin.translate(cellSize, 0),
      origin.translate(cellSize, cellSize),
      origin.translate(0, cellSize)
    ];

    for (let row = -1; row < rows + 1; row++) {
      for (let col = -1; col < columns + 1; col++) {
        const seed = xmur3a(`${baseSeed} row ${row} col ${col}`);
        const random = mulberry32(seed());

        // Only display frequency% of cells
        const rand = Math.ceil(random() * 100);
        if (rand > frequency) continue;

        const offset = {
          x: maxOffsetCoeff * (-1 + random() * 2) * cellSize,
          y: maxOffsetCoeff * (-1 + random() * 2) * cellSize,
        }

        const scale = Math.round(100 * (maxScaleCoeff - (maxScaleCoeff - minScaleCoeff) * random())) / 100;
        const angle = (random() > .5 ? 1 : -1) * 45;

        const placedCorners = corners.map(point => point
          .translate(-.5 * cellSize, -.5 * cellSize)  // move origin to center of shape
          .scale(scale)                               // scale shape
          .rotate(angle)                              // rotate shape
          .translate(.5 * cellSize, .5 * cellSize)    // move origin back to top left of shape
          .translate(offset.x, offset.y)              // move shape by random offset
          .translate(col * cellSize, row * cellSize)  // move shape to correct row and column
        );

        // Randomize cell color
        const hue = baseHue + (-1 + 2 * random()) * maxHueSpread;
        const opacity = Math.round(100 * (1 - .9 * random())) / 100;
        ctx.fillStyle = `hsl(${hue}, ${baseSaturation}%, ${baseLightness}%, ${opacity})`;

        // Draw the cell
        const shape = new Path2D();
        shape.moveTo(placedCorners[0].x, placedCorners[0].y);
        for (const corner of placedCorners) {
          shape.lineTo(corner.x, corner.y);
        }
        shape.closePath();
        ctx.fill(shape);
      }
    }
  }
});