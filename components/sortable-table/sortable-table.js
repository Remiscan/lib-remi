const upArrow = /*html*/`
  <svg></svg>
`;

const downArrow = /*html*/`
  <svg></svg>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer sortable-table {
    table[is="sortable-table"] thead td {
      cursor: pointer;
    }

    table[is="sortable-table"] thead td::after {
      content: '▼';
      opacity: 0;
      margin-left: 1ch;
    }

    table[is="sortable-table"] thead td.sorted.descending::after {
      content: '▼';
      opacity: 1;
    }

    table[is="sortable-table"] thead td.sorted.ascending::after {
      content: '▲';
      opacity: 1;
    }
  }
`);



const strings = {
  "fr": {
    "sort": "Trier par ${type} (${direction})"
  },
  
  "en": {
    "sort": "Sort by ${type} (${direction$})"
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
      if (format.function) {
        value = format.function(value);
      } else {
        switch (type) {
          case 'date': {
            const dateTimeFormat = new Intl.DateTimeFormat(undefined, format);
            const date = dateTimeFormat.format(new Date(value));
            value = `${date}`;
            break;
          }
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
    header.format = { function: formatFunction };
  }


  #startHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    console.log(this.headers);
    for (const header of headers) {
      header.addEventListener('click', this.headers.get(header.dataset.id).clickHandler);
    }
  }


  #stopHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      header.removeEventListener('click', this.headers.get(header.dataset.id).clickHandler);
    }
  }


  connectedCallback() {
    // Add CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.#initHeaders();

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
    this.#stopHandlingClicks();
  }


  static get observedAttributes() { return ['sort-by', 'sort-direction']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    this.#initHeaders();

    switch (attr) {
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