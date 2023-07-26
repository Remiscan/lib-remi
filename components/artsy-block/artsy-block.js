/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "artsy-block": "/_common/components/artsy-block/artsy-block.js",
    "${type}-worklet": "/_common/components/artsy-block/worklets/${type}.js"
  }
}
</script>
*/



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer artsy-block {

    /* Progress of the animation (from 0 to 1) */
    @property --anim-progress {
      syntax: "<number>";
      inherits: false;
      initial-value: 0; /* unitless */
    }

    @keyframes progress {
      0% { --anim-progress: 0; }
      100% { --anim-progress: 1; }
    }

    artsy-block {
      display: block;
      width: 100%;
      height: 100%;
      --cell-size: 40;
      --frequency: 100;
      --base-hue: 260;
      --base-saturation: 100;
      --base-lightness: 50;
      --max-hue-spread: 30;
    }

    @media (prefers-color-scheme: dark) {
      artsy-block {
        --base-lightness: 70;
      }
    }

    artsy-block[type="diamonds"] {
      background: paint(diamond-cells);
      --max-offset: 50; /* % of cell size */
      --min-scale: 10; /* % of cell size */
      --max-scale: 60; /* % of cell size */
    }

    artsy-block[type="starfield"] {
      background: paint(starfield);
      --max-offset: 50; /* % of cell size */
      --min-scale: 2; /* % of cell size */
      --max-scale: 8; /* % of cell size */
    }

    artsy-block[type="bigdots"] {
      background: paint(big-dot-cells);
      --base-lightness: 60;
      --max-saturation-spread: 40;
      --max-lightness-spread: 15;
    }

    @media (prefers-color-scheme: dark) {
      artsy-block[type="bigdots"] {
        --base-lightness: 30;
      }
    }

    artsy-block[type="labyrinth"] {
      background: paint(labyrinth);
    }

    artsy-block[type="rainfall"] {
      --base-lightness: 20;
      --fall-speed: 800; /* px per second */
      --wave-duration: 500; /* ms */
      --drop-width-ratio: 40; /* fraction of cell size */
      --drop-height-ratio: 2; /* fraction of cell size */
      --min-depth-scale: 50; /* % */
      --min-depth-opacity: 50; /* % */
      --fall-duration: calc(var(--self-height) / var(--fall-speed));
      --anim-duration: calc(var(--fall-duration) * 1000ms + var(--wave-duration) * 1ms);
      background: paint(rainfall);
      animation: progress var(--anim-duration) linear infinite;
    }

    @media (prefers-color-scheme: dark) {
      artsy-block[type="rainfall"] {
        --base-lightness: 80;
      }
    }

  }
`);



const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    const height = entry.contentRect?.height ?? 0;
    entry.target.style.setProperty('--self-height', height);
    console.log(entry, height);
  }
});



class ArtsyBlock extends HTMLElement {
  constructor() {
    super();
    this.updateBaseSeed();
  }

  updateBaseSeed() {
    this.baseSeed = Date.now();
    this.style.setProperty('--base-seed', `'${this.baseSeed}'`);
  }

  registerWorklet(type) {
    try {
      CSS.paintWorklet.addModule(import.meta.resolve(`${type}-worklet`));
    } catch (e) {
      console.error(e);
    }
  }

  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.addEventListener('updaterequest', this.updateBaseSeed);
    resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.removeEventListener('updaterequest', this.updateBaseSeed);
    resizeObserver.unobserve(this);
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'type': {
        this.registerWorklet(newValue);
      } break;
    }
  }
}

if (!customElements.get('artsy-block')) customElements.define('artsy-block', ArtsyBlock);