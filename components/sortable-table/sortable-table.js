import 'custom-elements-polyfill';
import translationObserver from 'translation-observer';



const arrowTemplate = document.createElement('template');
arrowTemplate.innerHTML = /*html*/`
  <button type="button" class="sorting-arrow-button" data-label="sort">
    <svg viewBox="0 0 14 28">
      <path class="arrow ascending-arrow" d="M 0 12 L 7 0 L 14 12"/>
      <path class="arrow descending-arrow" d="M 0 16 L 7 28 L 14 16"/>
    </svg>
  </button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer sortable-table {
    table[is="sortable-table"] thead td {
      position: relative;
    }

    table[is="sortable-table"] .sorting-arrow-button {
      font-size: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0px;
      margin: 0px;
      text-align: initial;
      margin: 0 .5ch;
      outline-offset: 5px;
    }

    table[is="sortable-table"] .sorting-arrow-button::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    table[is="sortable-table"] thead td svg {
      fill: currentColor;
      --width: .6em;
      width: var(--width);
      height: calc(2 * var(--width));
      vertical-align: text-bottom;
      overflow: visible;
    }

    .ascending-arrow {
      transform-origin: calc(100% * 12/28) center;
    }

    .descending-arrow {
      transform-origin: calc(100% * (28 - 12)/28) center;
    }

    table[is="sortable-table"] thead td .arrow {
      opacity: .5;
    }

    table[is="sortable-table"] thead td.sorted.ascending .ascending-arrow,
    table[is="sortable-table"] thead td.sorted.descending .descending-arrow {
      opacity: 1;
      scale: 1.4;
    }
  }
`);



const strings = {
  "fr": {
    "sort": "Trier cette colonne",
    "ascending": "croissant",
    "descending": "décroissant"
  },
  
  "en": {
    "sort": "Sort this column",
    "ascending": "ascending",
    "descending": "descending"
  }
};



export class SortableTable extends HTMLTableElement {
  constructor() {
    super();
    this.dataRows = 0;
    this.headers = new Map(); // Map<id, { order, title, type, format, clickHandler(), filter() }>
    this.data = new Map(); // Map<key, { [title]: [value] }>
    this.filter = data => true;
  }


  sortTable(
    id = this.getAttribute('sort-by') ?? this.getAttribute('default-sort-by') ?? this.headers.keys().next().value,
    direction = this.getAttribute('sort-direction') ?? this.getAttribute('default-sort-direction') ?? 'ascending'
  ) {
    const tbody = this.querySelector('tbody');
    tbody.innerHTML = '';

    const sortedKeys = this.#sortData(id, direction);
    const filteredKeys = this.#filterData(sortedKeys);
    for (const key of filteredKeys) {
      const tr = this.#dataToRow(this.data.get(key));
      tr.dataset.key = key;
      tbody.appendChild(tr);
    }

    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      header.classList.remove('ascending', 'descending');
      if (header.dataset.id === id) {
        header.classList.add('sorted', direction);
      } else {
        header.classList.remove('sorted');
      }
    }
  }


  #sortData(id, direction) {
    const header = this.headers.get(id);
    const type = header.type;
    
    const keys = [...this.data.keys()];
    return keys.sort((a, b) => {
      const [valueA, valueB] = [a, b].map(v => this.data.get(v)[id]);

      let comparison;
      switch (type) {
        case 'date':
        case 'number': {
          const [A, B] = [valueA, valueB].map(v => Number(v));
          comparison = A - B;
        } break;
        case 'string':
        default: {
          const [A, B] = [valueA, valueB].map(v => String(v).toLowerCase());
          comparison = A.localeCompare(B);
        } break;
      }

      return (direction === 'ascending' ? 1 : direction === 'descending' ? -1 : 0) * comparison;
    });
  }


  #filterData(keys = [...this.data.keys()]) {
    const filteredKeys = [];
    for (const key of keys) {
      const data = this.data.get(key);
      const fitsFilter = this.filter(data);
      if (fitsFilter) filteredKeys.push(key);
    }

    return filteredKeys;
  }


  #rowToData(tr) {
    const cells = tr.querySelectorAll('td');
    const data = {};
    const headerIds = this.headers.keys();

    for (const cell of cells) {
      let value = cell.innerHTML;
      const id = headerIds.next().value;
      const { type } = this.headers.get(id);
      switch (type) {
        case 'date':
        case 'number':
          value = Number(value);
          break;
        case 'string':
          value = String(value);
          break;
      }
      data[id] = value;
    }

    return data;
  }


  #dataToRow(data) {
    const tr = document.createElement('tr');

    for (const [id, { type, format }] of this.headers) {
      let value = data[id];
      if (typeof format === 'function') {
        value = format(value);
      } else {
        try {
          switch (type) {
            case 'date': {
              const dateTimeFormat = new Intl.DateTimeFormat(undefined, format);
              const date = dateTimeFormat.format(new Date(value));
              value = `${date}`;
              break;
            }
          }
        } catch (e) {
          console.error(e);
          value = data[id];
        }
      }

      const td = document.createElement('td');
      td.innerHTML = value;
      tr.appendChild(td);
    }

    return tr;
  }


  addRow(tr) {
    if (tr.dataset.id) return;

    const id = this.dataRows;
    const data = this.#rowToData(tr);

    this.data.set(id, data);
    tr.dataset.id = id;
    this.dataRows++;
  }


  deleteRow(id) {
    this.data.delete(id);
  }


  #initHeaders() {
    if (this.headers.size > 0) return;

    const headers = this.querySelectorAll(`thead td`);
    for (const [order, header] of [...headers].map((v, k) => [k, v])) {
      const title = header.innerText;
      const type = header.dataset.type;
      const format = JSON.parse(header.dataset.format ?? "{}");

      const id = header.dataset.id ?? String(order);
      header.dataset.id = id;

      const clickHandler = () => {
        this.sortTable(id,
          header.classList.contains('ascending') ? 'descending' :
          header.classList.contains('descending') ? 'ascending' :
          this.getAttribute('default-sort-direction') ?? 'ascending'
        );
      };

      const filter = value => true;

      this.headers.set(id, { order, title, type, format, clickHandler, filter });

      // Add arrows
      header.appendChild(arrowTemplate.content.cloneNode(true));
    }
  }


  setFilter(filterFunction = data => true) {
    this.filter = filterFunction;
  }


  resetFilter() {
    return this.setFilter();
  }


  setFormat(id, formatFunction) {
    const header = this.headers.get(id);
    header.format = formatFunction;
  }


  #startHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      const button = header.querySelector('.sorting-arrow-button');
      button.addEventListener('click', this.headers.get(header.dataset.id).clickHandler);
    }
  }


  #stopHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      const button = header.querySelector('.sorting-arrow-button');
      button.removeEventListener('click', this.headers.get(header.dataset.id).clickHandler);
    }
  }


  connectedCallback() {
    // Add CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.#initHeaders();

    translationObserver.serve(this, { method: 'attribute' });

    if (this.data.size === 0) {
      const rows = this.querySelectorAll('tbody > tr');
      for (const row of rows) {
        this.addRow(row);
      }
    }

    this.sortTable();
    this.#startHandlingClicks();
  }


  disconnectedCallback() {
    translationObserver.unserve(this);
    this.#stopHandlingClicks();
  }


  static get observedAttributes() { return ['sort-by', 'sort-direction', 'lang']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    this.#initHeaders();

    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;
      case 'sort-by': {
        this.sortTable(newValue, undefined);
      } break;
      case 'sort-direction': {
        this.sortTable(undefined, newValue);
      } break;
    }
  }
}

if (!customElements.get('sortable-table')) customElements.define('sortable-table', SortableTable, { extends: 'table' });