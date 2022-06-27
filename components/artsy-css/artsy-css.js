/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "artsy-css": "/_common/components/artsy-css/artsy-css.js",
    "artsy-css-styles": "/_common/components/artsy-css/styles.css"
  }
}
</script>
*/

import sheet from 'artsy-css-styles' assert { type: 'css' };



const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      const element = entry.target;
      const time = Date.now();
      if (element.lastObserved) {
        setTimeout(() => {
          if (element.lastObserved > time) return;
          element.init();
          element.make();
        }, 100);
      }
      element.lastObserved = time;
    }
  }
});



class ArtsyCss extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];

    this.lastObserved = 0;
    this.initialized = false;
    this.lastMade = 0;
    this.clickHandler = () => {};

    this.cellSize = ArtsyCss.defaultValue('cell-size');
    this.frequency = ArtsyCss.defaultValue('frequency');
  }

  static defaultValue(prop) {
    switch (prop) {
      case 'cell-size': return 40;
      case 'frequency': return 100;
    }
  }

  init() {
    this.shadow.innerHTML = '';
    this.cells = [];

    const size = { width: this.scrollWidth, height: this.scrollHeight };
    this.columns = Math.ceil(size.width / this.cellSize);
    this.rows = Math.ceil(size.height / this.cellSize);

    this.style.setProperty('--cell-size', `${this.cellSize}px`);
    this.style.setProperty('--columns', this.columns);
    this.style.setProperty('--rows', this.rows);

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

        this.cells.push(cell);
        this.shadow.appendChild(cell);
      }
    }

    this.initialized = true;
  }

  make() {
    if (!this.initialized) return;
    this.lastMade = Date.now();

    if (this.type === 'labyrinth') {
      const scale = (Math.sqrt(2) * this.cellSize + 2 * 1) / this.cellSize;
      this.style.setProperty('--labyrinth-scale', scale);
    }

    for (const cell of this.cells) {
      this.editCell(cell);
    }

    this.removeAttribute('previous-type');
  }

  editCell(cell) {
    const borderStyles = ['dotted', 'dashed', 'solid', 'double'];

    const x = 100 * Math.random();
    if (x > this.frequency) {
      cell.classList.add('hidden');
      return;
    } else {
      cell.classList.remove('hidden');
    }

    const hueSpreadCoeff = Math.round(100 * (-1 + 2 * Math.random())) / 100;
    cell.style.setProperty('--hue-spread-coeff', hueSpreadCoeff);

    switch (this.type) {

      case 'diamond': {
        cell.style.setProperty('--scale', Math.round(100 * (.6 - .5 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - 1 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(4 * Math.random()));
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
      } break;

      case 'square': {
        cell.style.setProperty('--scale', Math.round(100 * (2 - 1.5 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - .5 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(360 * Math.random()));
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--height', Math.round(100 * (0.5 + 0.5 * Math.random())) / 100);
        cell.style.setProperty('--epaisseur', Math.round(2 + 1 * Math.random()));
      } break;

      case 'labyrinth':
      case 'border': {
        cell.style.setProperty('--scale', Math.round(100 * (.6 + 2 * .4 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - 1 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(4 * Math.random()));

        if (this.getAttribute('previous-type') && this.type !== this.getAttribute('previous-type')) {
          cell.style.setProperty('--border-style', borderStyles[Math.round((borderStyles.length - 1) * Math.random())]);
        }

        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
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

    // Re-draw when size changes
    observer.observe(this);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.clickHandler);
    observer.unobserve(this);
  }

  static get observedAttributes() {
    return ['type', 'cell-size', 'frequency'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (attr) {
      case 'type':
        this.type = newValue;
        break;

      case 'cell-size':
        this.cellSize = isNaN(Number(newValue)) ? ArtsyCss.defaultValue('cell-size')
                                                : (Math.max(0, Number(newValue)) || ArtsyCss.defaultValue('cell-size'));
        break;

      case 'frequency':
        this.frequency = isNaN(Number(newValue)) ? ArtsyCss.defaultValue('frequency')
                                                 : Math.max(0, Math.min(Number(newValue), 100));
        break;
    }

    this.make();
  }
}

if (!customElements.get('artsy-css')) customElements.define('artsy-css', ArtsyCss);