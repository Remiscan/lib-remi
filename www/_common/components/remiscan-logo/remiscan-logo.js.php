const module = 'remiscan-logo';
const css = `<?php include './style.css.php'; ?>`;
const html = `<a href="https://remiscan.fr"><?php include './logo.svg'; ?></a>`;



class RemiscanLogo extends HTMLElement {
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
  }
}

if (!customElements.get(module)) customElements.define(module, RemiscanLogo);