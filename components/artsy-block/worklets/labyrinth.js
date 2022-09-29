import { Point2D } from '/_common/js/geometry.js';
import { mulberry32, xmur3a } from '/_common/js/prng.js';



registerPaint('labyrinth', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--base-saturation', '--base-lightness', '--max-hue-spread']; }

  paint(ctx, size, props) {
    const baseSeed = props.get('--base-seed');

    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 40;
    const frequency = Number(props.get('--frequency')) ?? 100;
    const baseHue = Number(props.get('--base-hue'));
    const baseSaturation = Number(props.get('--base-saturation'));
    const baseLightness = Number(props.get('--base-lightness'));
    const maxHueSpread = Number(props.get('--max-hue-spread'));

    const columns = Math.ceil(size.width / cellSize);
    const rows = Math.ceil(size.height / cellSize);

    const borderWidth = 2;

    // Base shape
    const origin = new Point2D(0, 0);
    const corners = [
      origin.translate(0, 0),
      origin.translate(cellSize, 0),
      origin.translate(cellSize, borderWidth),
      origin.translate(0, borderWidth)
    ];

    for (let row = -1; row < rows + 1; row++) {
      for (let col = -1; col < columns + 1; col++) {
        const seed = xmur3a(`${baseSeed} row ${row} col ${col}`);
        const random = mulberry32(seed());

        // Only display frequency% of cells
        const rand = Math.ceil(random() * 100);
        if (rand > frequency) continue;

        const angle = -45 + (Math.round(3 * random()) % 4) * 90;
        const scale = (Math.sqrt(2) * cellSize + 2 * 1) / cellSize;

        const placedCorners = corners.map(point => point
          .translate(-.5 * cellSize, -.5 * borderWidth) // move origin to center of shape
          .scale(scale)                                 // scale the shape
          .rotate(angle)                                // rotate shape
          .translate(col * cellSize, row * cellSize)    // move shape to correct row and column
        );

        // Randomize cell color
        const hue = baseHue + (-1 + 2 * random()) * maxHueSpread;
        const opacity = 1;
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