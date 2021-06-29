const module = 'sample-element';
const css = `<?php include './style.css.php'; ?>`;
const html = `<?php include './element.html'; ?>`;



class SampleElement extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    // Add CSS to the page
    if (!document.querySelector(`style[data-module="${module}"],link[rel="stylesheet"][data-module="${module}"],link[as="style"][data-module="${module}"]`)) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.dataset.module = module;
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
    }
    this.innerHTML = html;

    // Do other stuff here
  }
}

if (!customElements.get(module)) customElements.define(module, SampleElement);