function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  translate(dx = 0, dy = 0) {
    return new Point2D(
      this.x + dx,
      this.y + dy
    );
  }

  rotate(angle = 0) {
    const rad = angle * Math.PI / 180;
    return new Point2D(
      Math.cos(rad) * this.x - Math.sin(rad) * this.y,
      Math.sin(rad) * this.x + Math.cos(rad) * this.y
    );
  }

  scale(sx = 1, sy = sx) {
    return new Point2D(
      sx * this.x,
      sy * this.y
    );
  }
}



registerPaint('diamond-cells', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--max-hue-spread']; }

  paint(ctx, size, props) {
    const baseSeed = Number(`${props.get('--base-seed')}`.replace(/[\'\"]/g, ''));

    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 40;
    const frequency = Number(props.get('--frequency')) ?? 100;

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

    for (let row = -1; row <= rows + 1; row++) {
      for (let col = -1; col <= columns + 1; col++) {
        const random = mulberry32(baseSeed * (row + 2) * (col + 2));

        // Only display frequency% of cells
        const rand = Math.ceil(random() * 100);
        if (rand > frequency) continue;

        const offset = {
          x: 0.5 * (-1 + random() * 2) * cellSize,
          y: 0.5 * (-1 + random() * 2) * cellSize,
        }

        const scale = Math.round(100 * (.6 - .5 * random())) / 100;
        const angle = 45;

        const placedCorners = corners.map(point => point
          .translate(-5 * cellSize, -5 * cellSize)    // move origin to center of shape
          .scale(scale)                               // scale shape
          .rotate(angle)                              // rotate shape
          .translate(.5 * cellSize, .5 * cellSize)    // move origin back to top left of shape
          .translate(offset.x, offset.y)              // move shape by random offset
          .translate(col * cellSize, row * cellSize)  // move shape to correct row and column
        );

        // Randomize cell color
        const hue = Number(props.get('--base-hue')) + (-1 + 2 * random()) * Number(props.get('--max-hue-spread'));
        const opacity = Math.round(100 * (1 - 1 * random())) / 100;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%, ${opacity})`;

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