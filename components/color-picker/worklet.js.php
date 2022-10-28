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
    const formatIsSupported = false; //String(props.get('--format-is-supported')); // There is currently a bug with CSS.supports and colors in Chrome
    console.log(formatIsSupported);
    const propertiesOfFormat = [...Couleur.propertiesOf(format), 'a'];
    const propertyIndex = propertiesOfFormat.indexOf(property);

    //if (propertyIndex === -1) console.error(`Property ${property} not found in format ${format}`);

    // Create gradient steps
    const values = propertiesOfFormat.map(p => props.get(`--${p}`));
    for (let i = 0; i < steps; i++) {
      // Create the expression of the color of that step
      const stepValues = values.map((v, k) => k === propertyIndex ? min + i * (max - min) / steps : v);
      const stepExpr = stepValues.reduce((expr, v, k) => {
        let valueExpr;
        switch (propertiesOfFormat[k]) {
          case 'a':
          case 's':
          case 'l':
          case 'w':
          case 'bk':
          case 'ciel':
          case 'okl':
            valueExpr = `${v}%`;
            break;
          default:
            valueExpr = `${v}`;
        }
        return `${expr}${k === 3 ? '/ ' : ''}${valueExpr}${k < 3 ? ' ' : ')'}`
      }, `${format}(`);


      gradient.push(formatIsSupported ? stepExpr : new Couleur(stepExpr).rgb);
    }

    const canvasGradient = ctx.createLinearGradient(0, 0, size.width, 0);
    for (const [k, color] of Object.entries(gradient)) {
      if (k == 0) {
        canvasGradient.addColorStop(0, color);
        canvasGradient.addColorStop((cursorWidth / 2) / size.width, color);
      } else if (k == gradient.length - 1) {
        canvasGradient.addColorStop((size.width - cursorWidth / 2) / size.width, color);
        canvasGradient.addColorStop(1, color);
      } else {
        canvasGradient.addColorStop((cursorWidth / 2 + (k / gradient.length) * (size.width - cursorWidth)) / size.width, color);
      }
    }

    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, size.width, size.height);
  }
});