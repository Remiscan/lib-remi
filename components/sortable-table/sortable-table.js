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
    this.headers = new Map(); // Map<order, { title, type, format, clickHandler }>
    this.data = new Map(); // Map<id, { [title]: [value] }>
  }


  sortTable(
    title = this.getAttribute('sort-by') ?? this.getAttribute('default-sort-by') ?? this.headers.get(0).title,
    direction = this.getAttribute('sort-direction') ?? this.getAttribute('default-sort-direction') ?? 'ascending'
  ) {
    const tbody = this.querySelector('tbody');
    tbody.innerHTML = '';

    const sortedKeys = this.#sortData(title, direction);
    for (const id of sortedKeys) {
      const tr = this.#dataToRow(this.data.get(id));
      tr.dataset.id = id;
      tbody.appendChild(tr);
    }

    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      header.classList.remove('ascending', 'descending');
      if (header.dataset.title === title) {
        header.classList.add('sorted', direction);
      } else {
        header.classList.remove('sorted');
      }
    }
  }


  #sortData(title, direction) {
    const keys = [...this.data.keys()];
    const type = this.#getHeaderFromTitle(title).type;
    
    return keys.sort((a, b) => {
      const [valueA, valueB] = [a, b].map(v => this.data.get(v)[title]);

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


  #rowToData(tr) {
    const cells = tr.querySelectorAll('td');
    const data = {};

    for (const [k, cell] of [...cells].map((v, k) => [k, v])) {
      let value = cell.innerHTML;
      const { title, type } = this.headers.get(k);
      switch (type) {
        case 'date':
        case 'number':
          value = Number(value);
          break;
        case 'string':
          value = String(value);
          break;
      }
      data[title] = value;
    }

    return data;
  }


  #dataToRow(data) {
    const tr = document.createElement('tr');

    for (const [order, { title, type, format }] of this.headers) {
      let value = data[title];
      switch (type) {
        case 'date': {
          const formatOptions = JSON.parse(format ?? '{ "dateStyle": "long", "timeStyle": "long" }');
          if (formatOptions.function) {
            value = window[formatOptions.function](Number(value));
          } else {
            const dateTimeFormat = new Intl.DateTimeFormat(undefined, formatOptions);
            const date = dateTimeFormat.format(new Date(value));
            value = `${date}`;
          }
          break;
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
    for (const [k, header] of [...headers].map((v, k) => [k, v])) {
      const title = header.innerText;
      const type = header.dataset.type;
      const format = header.dataset.format;

      const clickHandler = () => {
        this.sortTable(title,
          header.classList.contains('ascending') ? 'descending' :
          header.classList.contains('descending') ? 'ascending' :
          this.getAttribute('default-sort-direction') ?? 'ascending'
        );
      };

      header.dataset.title = title;
      this.headers.set(k, { title, type, format, clickHandler });
    }
  }


  #getHeaderFromTitle(title) {
    for (const [k, header] of this.headers) {
      if (header.title === title) return header;
    }
    return null;
  }


  #startHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    for (const [k, header] of [...headers].map((v, k) => [k, v])) {
      header.addEventListener('click', this.headers.get(k).clickHandler);
    }
  }


  #stopHandlingClicks() {
    const headers = this.querySelectorAll(`thead td`);
    for (const [k, header] of [...headers].map((v, k) => [k, v])) {
      header.removeEventListener('click', this.headers.get(k).clickHandler);
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