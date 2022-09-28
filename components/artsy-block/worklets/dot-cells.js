import { Point2D } from '/_common/js/geometry.js';
import { mulberry32, xmur3a } from '/_common/js/prng.js';



registerPaint('dot-cells', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--base-saturation', '--base-lightness', '--max-hue-spread', '--angle-coeff']; }

  paint(ctx, size, props) {
    const baseSeed = props.get('--base-seed');

    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 40;
    const frequency = Number(props.get('--frequency')) ?? 100;
    const baseHue = Number(props.get('--base-hue'));
    const baseSaturation = Number(props.get('--base-saturation'));
    const baseLightness = Number(props.get('--base-lightness'));
    const maxHueSpread = Number(props.get('--max-hue-spread'));
    const animCoeff = Number(props.get('--angle-coeff'));

    const columns = Math.ceil(size.width / cellSize);
    const rows = Math.ceil(size.height / cellSize);

    // Base shape
    const origin = new Point2D(0, 0);

    for (let row = -1; row < rows + 1; row++) {
      for (let col = -1; col < columns + 1; col++) {
        const seed = xmur3a(`${baseSeed} row ${row} col ${col}`);
        const random = mulberry32(seed());

        // Only display frequency% of cells
        const rand = Math.ceil(random() * 100);
        if (rand > frequency) continue;

        const scale = .25 * (.2 + .8 * random());

        const centre = origin
          .translate(col * cellSize, row * cellSize)  // move shape to correct row and column
          ;

        // Randomize cell color
        const hue = baseHue + (-1 + 2 * random()) * maxHueSpread;
        const opacity = 1;
        ctx.fillStyle = `hsl(${hue}, ${baseSaturation}%, ${baseLightness}%, ${opacity})`;

        // Draw the cell
        ctx.beginPath();
        ctx.arc(centre.x, centre.y, scale * cellSize / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
});