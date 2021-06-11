/**************************************
***** EXAMPLE OF USE ******************
***************************************

<fieldset role="tablist" group="tabs-group-name">
  <legend data-string="tabs-group-name-label"></legend>

  <tab-label controls="controlled-element-1-id" label="Tab 1 name" active="true"></tab-label>
  <tab-label controls="controlled-element-2-id" label="Tab 2 name"></tab-label>
  <tab-label controls="controlled-element-3-id" label="Tab 3 name"></tab-label>
</fieldset>

<div id="controlled-element-1-id"></div>
<div id="controlled-element-2-id" hidden></div>
<div id="controlled-element-3-id" hidden></div>

***** or ******************************

<tab-label group="tabs-group-name" controls="controlled-element-1-id" label="Tab 1 name" active="true"></tab-label>
<tab-label group="tabs-group-name" controls="controlled-element-2-id" label="Tab 2 name"></tab-label>
<tab-label group="tabs-group-name" controls="controlled-element-3-id" label="Tab 3 name"></tab-label>

<div id="controlled-element-1-id"></div>
<div id="controlled-element-2-id" hidden></div>
<div id="controlled-element-3-id" hidden></div>

**************************************/



let cssReady = false;
const css = `<?php include './style.css.php'; ?>`;
const html = `<?php include './element.html'; ?>`;



class TabLabel extends HTMLElement {
  constructor() {
    super();
  }


  toggle() {
    if (!this.tabs) this.tabs = [...document.querySelectorAll(`input[name="${this.group}"]`)];
    for (const tab of this.tabs) {
      const element = document.getElementById(tab.getAttribute('aria-controls'));
      if (tab.checked)  element.removeAttribute('hidden');
      else              element.setAttribute('hidden', 'hidden');
    }
  }


  connectedCallback() {
    // Add CSS to the page
    if (!cssReady) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'tab-label-style';
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
      cssReady = true;
    }
    const content = this.innerHTML;
    this.innerHTML = html;

    const label = this.querySelector('label');
    label.innerHTML = content;

    // Pass the correct attributes to the input[type="radio"]
    this.input = this.querySelector('input[role="tab"]');
    for (const attr of [...this.attributes]) {
      switch (attr.name) {
        case 'group':
          this.group = attr.value;
          this.input.setAttribute('name', attr.value);
          break;
        case 'controls':
          const id = `input-for-${attr.value}`;
          this.input.setAttribute('id', id);
          label.setAttribute('for', id);
          label.id = `${id}-label`;
          this.input.setAttribute('aria-controls', attr.value);
          break;
        case 'label':
          if (label.innerHTML == '') label.innerHTML = attr.value;
          break;
        case 'active':
          this.input.setAttribute('checked', attr.value !== 'false');
          this.removeAttribute('active');
          break;
      }
    }

    if (!this.input.getAttribute('name')) {
      this.group = this.parentElement.dataset.group;
      this.input.setAttribute('name', this.group);
    }

    this.controlledElement = document.getElementById(this.getAttribute('controls'));
    this.controlledElement.setAttribute('aria-labelledby', label.id);
    this.controlledElement.setAttribute('role', 'tabpanel');
    if (!this.input.checked)  this.controlledElement.setAttribute('hidden', 'hidden');
    else                      this.controlledElement.removeAttribute('hidden');
    
    this.input.addEventListener('change', () => this.toggle());
  }
}

if (!customElements.get('tab-label')) customElements.define('tab-label', TabLabel);