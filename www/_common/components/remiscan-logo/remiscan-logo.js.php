const adopt = ('adoptedStyleSheets' in document);
const template = document.createElement('template');
const css = `<?php include './style.css.php'; ?>`;

let sheet;
if (adopt) {
  sheet = new CSSStyleSheet();
} else {
  template.innerHTML += `<style>${css}</style>`;
}
template.innerHTML += `<?php include './logo.svg'; ?>`;



class RemiscanLogo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    if (adopt) this.shadow.adoptedStyleSheets = [sheet];
    this.text = this.shadow.querySelector('.text');
    this.background = this.shadow.querySelector('.background');
  }


  connectedCallback() {
    // Parse CSS on first connection
    if (sheet?.cssRules.length === 0) sheet.replaceSync(css);
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'background-color') {
      this.background.setAttribute('fill', newValue);
    }
    else if (name === 'text-color') {
      this.text.setAttribute('fill', newValue);
    }
  }


  static get observedAttributes() {
    return ['background-color', 'text-color'];
  }
}

if (!customElements.get('remiscan-logo')) customElements.define('remiscan-logo', RemiscanLogo);