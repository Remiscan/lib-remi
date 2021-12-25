import sheet from './styles.css' assert { type: 'css' };
import template from './template.js';



class SampleElement extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }


  connectedCallback() {

  }


  // Automatically called for every set attribute before connectedCallback
  // (no need to check this.ready)
  attributeChangedCallback(name, oldValue, newValue) {

  }
}

if (!customElements.get('sample-element')) customElements.define('sample-element', SampleElement);