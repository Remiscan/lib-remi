/* <?php versionizeStart(); ?> */

import Couleur from '/colori/lib/dist/colori.min.js';

/* <?php versionizeEnd(__DIR__); ?> */



registerPaint('range-gradient', class {
  static get contextOptions() { return {alpha: true}; }
  static get inputProperties() { return ['--gradient-steps', '--cursor-width', '--property', '--min', '--max', ...Couleur.properties.map(p => `--${p}`)]; }

  paint(ctx, size, props) {
    const property = String(props.get('--property'));
    const steps = Number(props.get('--gradient-steps'));
    const cursorWidth = Number(props.get('--cursor-width'));

    const gradient = [];
    
    const min = Number(props.get('--min')), max = Number(props.get('--max'));
    switch (property) {
      case 'r': {
        const g = props.get('--g'), b = props.get('--b'), a = props.get('--a');
        gradient.push(`rgb(0 ${g} ${b} / ${a}%)`);
        gradient.push(`rgb(255 ${g} ${b} / ${a}%)`);
      } break;
      case 'g': {
        const r = props.get('--r'), b = props.get('--b'), a = props.get('--a');
        gradient.push(`rgb(${r} 0 ${b} / ${a}%)`);
        gradient.push(`rgb(${r} 255 ${b} / ${a}%)`);
      } break;
      case 'b': {
        const r = props.get('--r'), g = props.get('--g'), a = props.get('--a');
        gradient.push(`rgb(${r} ${g} 0 / ${a}%)`);
        gradient.push(`rgb(${r} ${g} 255 / ${a}%)`);
      } break;
      case 'a': {
        const r = props.get('--r'), g = props.get('--g'), b = props.get('--b');
        gradient.push(`rgb(${r} ${g} ${b} / 0)`);
        gradient.push(`rgb(${r} ${g} ${b} / 1)`);
      } break;
      case 'h': {
        const s = props.get('--s'), l = props.get('--l'), a = props.get('--a');
        for (let i = 0; i < steps; i ++) {
          gradient.push(`hsl(${i * 360 / steps} ${s}% ${l}% / ${a}%)`);
        }
      } break;
      case 's': {
        const h = props.get('--h'), l = props.get('--l'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push(`hsl(${h} ${i * 100 / steps}% ${l}% / ${a}%)`)
        }
      } break;
      case 'l': {
        const h = props.get('--h'), s = props.get('--s'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push(`hsl(${h} ${s}% ${i * 100 / steps}% / ${a}%)`)
        }
      } break;
      case 'w': {
        const h = props.get('--h'), bk = props.get('--bk'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`hwb(${h} ${i * 100 / steps}% ${bk}% / ${a}%)`)).rgb)
        }
      } break;
      case 'bk': {
        const h = props.get('--h'), w = props.get('--w'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`hwb(${h} ${w}% ${i * 100 / steps}% / ${a}%)`)).rgb)
        }
      } break;
      case 'ciel': {
        const ciec = props.get('--ciec'), cieh = props.get('--cieh'), a = props.get('--a');
        for (let i = 0; i < steps; i ++) {
          gradient.push((new Couleur(`lch(${i * 100 / steps}% ${ciec} ${cieh} / ${a}%)`)).rgb)
        }
      } break;
      case 'ciec': {
        const ciel = props.get('--ciel'), cieh = props.get('--cieh'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`lch(${ciel}% ${i * max / steps} ${cieh} / ${a}%)`)).rgb);
        }
      } break;
      case 'cieh': {
        const ciel = props.get('--ciel'), ciec = props.get('--ciec'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`lch(${ciel}% ${ciec} ${i * 360 / steps} / ${a}%)`)).rgb);
        }
      } break;
      case 'ciea': {
        const ciel = props.get('--ciel'), cieb = props.get('--cieb'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`lab(${ciel}% ${min + i * (max - min) / steps} ${cieb} / ${a}%)`)).rgb);
        }
      } break;
      case 'cieb': {
        const ciel = props.get('--ciel'), ciea = props.get('--ciea'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`lab(${ciel}% ${ciea} ${min + i * (max - min) / steps} / ${a}%)`)).rgb);
        }
      } break;
      case 'okl': {
        const okc = props.get('--okc'), okh = props.get('--okh'), a = props.get('--a');
        for (let i = 0; i < steps; i ++) {
          gradient.push((new Couleur(`oklch(${i * 100 / steps}% ${okc} ${okh} / ${a}%)`)).rgb)
        }
      } break;
      case 'okc': {
        const okl = props.get('--okl'), okh = props.get('--okh'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`oklch(${okl}% ${i * max / steps} ${okh} / ${a}%)`)).rgb);
        }
      } break;
      case 'okh': {
        const okl = props.get('--okl'), okc = props.get('--okc'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`oklch(${okl}% ${okc} ${i * 360 / steps} / ${a}%)`)).rgb);
        }
      } break;
      case 'oka': {
        const okl = props.get('--okl'), okb = props.get('--okb'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`oklab(${okl}% ${min + i * (max - min) / steps} ${okb} / ${a}%)`)).rgb);
        }
      } break;
      case 'okb': {
        const okl = props.get('--okl'), oka = props.get('--oka'), a = props.get('--a');
        for (let i = 0; i < steps; i++) {
          gradient.push((new Couleur(`oklab(${okl}% ${oka} ${min + i * (max - min) / steps} / ${a}%)`)).rgb);
        }
      } break;
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