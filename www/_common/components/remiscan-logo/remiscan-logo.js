import sheet from 'remiscan-logo-styles' assert { type: 'css' };
import template from 'remiscan-logo-template';



class RemiscanLogo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }
}

if (!customElements.get('remiscan-logo')) customElements.define('remiscan-logo', RemiscanLogo);