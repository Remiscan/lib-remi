import { mulberry32 } from '/_common/js/prng.js';



registerPaint('diamond-cells', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--base-seed', '--cell-size', '--frequency', '--base-hue', '--max-hue-spread']; }

  paint(ctx, size, props) {
    const cellSize = Math.max(3, Number(props.get('--cell-size'))) || 25;
    const frequency = Number(props.get('--frequency')) ?? 100;

    const columns = Math.ceil(size.width / cellSize);
    const rows = Math.ceil(size.height / cellSize);

    for (let row = -1; row < rows + 1; row++) {
      for (let col = -1; col < columns + 1; col++) {
        const random = mulberry32(Number(props.get('--base-seed')) * (row + 2) * (col + 2));

        const rand = Math.round(random() * 100);
        if (rand > frequency) continue;

        // Generate and paint individual cells here
        const offset = {
          x: 0.5 * (-1 + random() * 2) * cellSize,
          y: 0.5 * (-1 + random() * 2) * cellSize,
        }

        const scale = Math.round(100 * (1 - .9 * random())) / 100;
        const angle = 45 * Math.PI / 180;

        const position = {
          x: col * cellSize + offset.x,
          y: row * cellSize + offset.y
        };

        const scaledPosition = {
          x: position.x + 0.5 * (1 - scale) * cellSize,
          y: position.y + 0.5 * (1 - scale) * cellSize
        };

        const rotatedPosition = {
          x: Math.cos(-angle) * scaledPosition.x + -Math.sin(-angle) * scaledPosition.y,
          y: Math.sin(-angle) * scaledPosition.x + Math.cos(-angle) * scaledPosition.y
        };

        const hue = Number(props.get('--base-hue')) + (-1 + 2 * random()) * Number(props.get('--max-hue-spread'));
        const opacity = Math.round(100 * random()) / 100;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%, ${opacity})`;

        ctx.save();
        
        ctx.translate((position.x + cellSize) / 2, (position.y + cellSize) / 2);
        ctx.rotate(angle);
        ctx.fillRect(rotatedPosition.x, rotatedPosition.y, cellSize * scale, cellSize * scale);

        ctx.restore();
      }
    }
  }
});