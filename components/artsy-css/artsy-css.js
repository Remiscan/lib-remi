/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "artsy-css": "/_common/components/artsy-css/artsy-css.js",
    "artsy-css-styles": "/_common/components/artsy-css/styles.css",
    "artsy-css-template": "/_common/components/artsy-css/template.js"
  }
}
</script>
*/

import sheet from 'artsy-css-styles' assert { type: 'css' };



const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      const element = entry.target;
      if (element.observedOnce) {
        element.init();
        element.make();
      }
      element.observedOnce = true;
    }
  }
});



class ArtsyCss extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];

    this.observedOnce = false;
    this.initialized = false;
    this.columns = 0;
    this.rows = 0;
    this.cellSize = 40;
    this.lastMade = 0;
    this.clickHandler = () => {};
  }

  init() {
    this.shadow.innerHTML = '';

    const size = { width: this.scrollWidth, height: this.scrollHeight };
    this.columns = Math.ceil(size.width / this.cellSize);
    this.rows = Math.ceil(size.height / this.cellSize);

    this.style.setProperty('--cell-size', `${this.cellSize}px`);
    this.style.setProperty('--columns', this.columns);
    this.style.setProperty('--rows', this.rows);
  }

  make() {
    //if (this.lastMade > Date.now() - (this.columns + this.rows + 80) * 10) return;
    this.lastMade = Date.now();

    let cells = [...this.shadow.querySelectorAll('.cell')];
    const edit = cells.length > 0;

    if (this.type === 'labyrinth') {
      const scale = (Math.sqrt(2) * this.cellSize + 2 * 1) / this.cellSize;
      this.style.setProperty('--labyrinth-scale', scale);
    }

    if (edit) {
      for (const cell of cells) {
        this.editCell(cell, edit);
      }
    } else {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.columns; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');

          const currentRow = row % (this.rows + 1) + 1;
          cell.style.setProperty('--row', currentRow);
          cell.dataset.row = currentRow;

          const currentCol = col % (this.columns + 1) + 1;
          cell.style.setProperty('--col', currentCol);
          cell.dataset.column = currentCol;

          this.editCell(cell, edit);
          this.shadow.appendChild(cell);
        }
      }
    }

    this.removeAttribute('previous-type');
  }

  editCell(cell, edit = false) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.column);

    const hueDiff = 20;
    const minHue = 0;
    const maxHue = 360;
    const borderStyles = ['dotted', 'dashed', 'solid', 'double'];

    const x = Math.round(Math.random() * (this.scarcity - 1));
    if (this.scarcity > 1 && x > 0) {
      return cell.classList.add('hidden');
    } else {
      cell.classList.remove('hidden');
    }

    //cell.style.setProperty('--random-order', Math.round((this.rows + this.columns) * Math.random()));

    switch (this.type) {
      case 'border':
      case 'labyrinth': {
        //const coeff = hueDiff * Math.round(-1 + 2 * Math.random());

        const hue = Math.round(
          minHue + ((row + col) / (this.rows + this.columns)) * maxHue
          + hueDiff
        );
        cell.style.setProperty('--hue', 250 + hue % 30);
        cell.style.setProperty('--scale', Math.round(100 * (.6 + 2 * .4 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - 1 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(4 * Math.random()));

        if (!edit || (this.getAttribute('previous-type') && this.type !== this.getAttribute('previous-type'))) {
          cell.style.setProperty('--border-style', borderStyles[Math.round((borderStyles.length - 1) * Math.random())]);
        }

        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
      } break;

      case 'diamond': {
        //const coeff = hueDiff * Math.round(-1 + 2 * Math.random());
        //const r = Number(Math.round(1.2 * Math.random()) != 0);

        const hue = Math.round(
          minHue + ((row + col) / (this.rows + this.columns)) * maxHue
          + hueDiff
        );
        
        cell.style.setProperty('--hue', 250 + hue % 30);
        cell.style.setProperty('--scale', Math.round(100 * (.6 - .5 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - 1 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(4 * Math.random()));
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
      } break;

      case 'square': {
        //const coeff = hueDiff * Math.round(-1 + 2 * Math.random());
        //const r = Number(Math.round(1.2 * Math.random()) != 0);
        
        const hue = Math.round(
          minHue + ((row + col) / (this.rows + this.columns)) * maxHue
          + hueDiff
        );
        
        cell.style.setProperty('--hue', 250 + hue % 30);
        cell.style.setProperty('--scale', Math.round(100 * (2 - 1.5 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - .5 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(360 * Math.random()));
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--height', Math.round(100 * (0.5 + 0.5 * Math.random())) / 100);
        cell.style.setProperty('--epaisseur', Math.round(2 + 1 * Math.random()));
      } break;
    }

  }


  connectedCallback() {
    this.init();
    this.make();

    this.shadowRoot.addEventListener('click', this.clickHandler = event => {
      const startRow = Number(event.target.dataset.row);
      const startCol = Number(event.target.dataset.column);
      this.style.setProperty('--start-row', startRow);
      this.style.setProperty('--start-col', startCol);
      this.make();
    });

    // Re-calculate size when border-width changes
    observer.observe(this);

    this.initialized = true;
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.clickHandler);
    observer.unobserve(this);
  }

  static get observedAttributes() {
    return ['type', 'scarcity'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (attr) {
      case 'type':
        this.type = newValue;
        break;
      
      case 'scarcity':
        this.scarcity = isNaN(Number(newValue)) ? 1 : Number(newValue);
        break;
    }

    if (this.initialized) this.make();
  }
}

if (!customElements.get('artsy-css')) customElements.define('artsy-css', ArtsyCss);