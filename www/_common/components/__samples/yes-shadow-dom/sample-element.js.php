const adopt = ('adoptedStyleSheets' in document);
const template = document.createElement('template');
const css = `<?php include './style.css.php'; ?>`;

let sheet;
if (adopt) {
  sheet = new CSSStyleSheet();
} else {
  template.innerHTML += `<style>${css}</style>`;
}
template.innerHTML += `<?php include './element.html'; ?>`;



class SampleElement extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    if (adopt) this.shadow.adoptedStyleSheets = [sheet];
  }


  connectedCallback() {
    // Parse CSS on first connection
    if (sheet?.cssRules.length === 0) sheet.replaceSync(css);

    // Do other stuff here
  }
}

if (!customElements.get('sample-element')) customElements.define('sample-element', SampleElement);