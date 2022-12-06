/* <?php versionizeStart(); ?> */

import Couleur from '/colori/lib/dist/colori.min.js';

/* <?php versionizeEnd(__DIR__); ?> */



registerPaint('range-gradient', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--gradient-steps', '--format-is-supported', '--cursor-width', '--property', '--as-format', '--min', '--max', ...Couleur.properties.map(p => `--${p}`)]; }

  paint(ctx, size, props) {
    const property = String(props.get('--property'));
    const steps = Number(props.get('--gradient-steps'));
    const cursorWidth = Number(props.get('--cursor-width'));

    const gradient = [];
    
    const min = Number(props.get('--min')), max = Number(props.get('--max'));

    const format = String(props.get('--as-format'));
    const formatIsSupported = false; //String(props.get('--format-is-supported')) === 'true'; // There is currently a bug with CSS.supports and colors in Chrome
    const propertiesOfFormat = [...Couleur.propertiesOf(format), 'a'];
    const propertyIndex = propertiesOfFormat.indexOf(property);

    if (propertyIndex === -1) return;//console.error(`Property ${property} not found in format ${format}`);

    // Create gradient steps
    for (let i = 0; i <= steps; i++) {
      // Create the expression of the color of that step
      const values = propertiesOfFormat.map((prop, k) => {
        const inputValue = props.get(`--${prop}`);
        const value = k === propertyIndex ? min + i * (max - min) / steps : inputValue;
        switch (prop) {
          case 'r': case 'g': case 'b':
            return `${Math.round(10**3 * Number(value) / 255) / 10**3}`;
          case 'a': case 's': case 'l': case 'w': case 'bk': case 'ciel': case 'okl': case 'oksl': case 'oklr': case 'oksv': case 'okv':
            return `${Number(value) / 100}`;
          default:
            return `${value}`;
        }
      });

      const cssFormats = ['rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch'];
      const appliedFormat = cssFormats.includes(format) ? format : `color-${format}`;
      const expr = Couleur.makeString(appliedFormat, values, { precision: 2 });
      gradient.push(formatIsSupported ? expr : new Couleur(expr).rgb);
    }

    const canvasGradient = ctx.createLinearGradient(0, 0, 0, size.height);
    for (const [k, color] of Object.entries(gradient)) {
      if (k == 0) {
        canvasGradient.addColorStop(1, color);
      }
      const offset = (cursorWidth / 2 + (k / (gradient.length - 1)) * (size.height - cursorWidth)) / size.height;
      canvasGradient.addColorStop(1 - offset, color);
      if (k == gradient.length - 1) {
        canvasGradient.addColorStop(0, color);
      }
    }

    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, size.width, size.height);
  }
});

registerPaint('checkered', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--checkered-cell-size', '--checkered-background-color', '--checkered-cell-color']; }

  paint(ctx, size, props) {
    const cellSize = Number(props.get('--checkered-cell-size')) || 8;
    const bgColor = String(props.get('--checkered-background-color')) || 'transparent';
    const cellColor = String(props.get('--checkered-cell-color')) || 'rgba(0, 0, 0, .1)';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size.width, size.height);

    for (let x = 0; x < size.width; x += cellSize) {
      for (let y = 0; y < size.height; y += cellSize) {
        if (((x + y) / cellSize) % 2 !== 0) continue;
        ctx.fillStyle = cellColor;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
});