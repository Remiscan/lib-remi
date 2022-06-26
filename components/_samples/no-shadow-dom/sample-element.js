import sheet from './styles.css' assert { type: 'css' };
import template from './template.js';



class SampleElement extends HTMLElement {
  constructor() {
    super();
    this.ready = false;
  }


  update(attr, oldValue, newValue) {
    if (!this.ready) return;
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    if (!this.innerHTML)
      this.appendChild(template.content.cloneNode(true));

    // Do other stuff here

    this.ready = true;
    for (const attr of SampleElement.observedAttributes) {
      this.update(attr, '', this.getAttribute(attr));
    }
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.update(name, oldValue, newValue);
  }
}

if (!customElements.get('sample-element')) customElements.define('sample-element', SampleElement);