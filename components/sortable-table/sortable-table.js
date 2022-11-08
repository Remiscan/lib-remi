const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layout sortable-table {
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
    this.rows = 0;
    this.titles = new Map(); // Map<title, { type, format }>
    this.data = new Map(); // Map<id, { [title]: [value] }>
  }


  sortTable(title, direction = 'ascending') {
    const tbody = this.querySelector('tbody');
    tbody.innerHTML = '';

    const sortedKeys = this.#sortData(title, direction);
    for (const id of sortedKeys) {
      let html = `<tr>`;
      for (const [title, { type, format }] of this.titles) {
        let value = this.data.get(id)[title];
        switch (type) {
          case 'date':
            value = new Date(value).toLocaleDateString();
            break;
        }
        html += `<td>${value}</td>`;
      }
      html += `</tr>`;
      tbody.innerHTML += html;
    }

    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      if (header.dataset.title === title) header.classList.add('sorted');
      else                                header.classList.remove('sorted');
    }
  }


  #sortData(title, direction = 'ascending') {
    const keys = [...this.data.keys()];
    return keys.sort((a, b) => {
      const type = this.titles.get(title);
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

      return (direction === 'ascending' ? 1 : -1) * comparison;
    });
  }


  #addRow(tr) {
    if (tr.dataset.id) return;

    const id = this.rows;
    const cells = tr.querySelector('td');
    const data = {};

    for (const [k, cell] of cells.map((v, k) => [k, v])) {
      data[this.titles[k]] = cell.innerHTML;
    }

    this.data.set(id, data);
    tr.dataset.id = id;
    this.rows++;
  }


  #deleteRow(id) {
    this.data.delete(id);
  }


  #initHeaders() {
    const headers = this.querySelectorAll(`thead td`);
    for (const header of headers) {
      const title = header.innerText;
      const type = header.dataset.type;
      const format = header.dataset.format;
      header.dataset.title = title;
      this.titles.set(title, { type, format });
    }
  }


  connectedCallback() {
    // Add CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.#initHeaders();
    const rows = this.querySelectorAll('tr');
    for (const row of rows) {
      this.#addRow(row);
    }
  }


  disconnectedCallback() {

  }


  static get observedAttributes() { return []; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      
    }
  }
}

if (!customElements.get('sortable-table')) customElements.define('sortable-table', SortableTable);