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
    this.ready = false;
  }


  toggle() {
    if (!this.tabs) this.tabs = [...document.querySelectorAll(`input[name="${this.group}"]`)];
    for (const tab of this.tabs) {
      const element = document.getElementById(tab.getAttribute('aria-controls'));
      if (tab.checked)  element.removeAttribute('hidden');
      else              element.setAttribute('hidden', 'hidden');
    }
  }


  update(attributes = TabLabel.observedAttributes) {
    if (!this.ready) return;

    label: {
      if (!attributes.includes('label')) break label;
      this.label.innerHTML = this.getAttribute('label');
    }
  }


  connectedCallback() {
    // Add CSS to the page
    if (!document.getElementById('tab-label-style')) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'tab-label-style';
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
    }
    const content = this.innerText;
    this.innerHTML = html;

    this.label = this.querySelector('label');
    if (content) this.setAttribute('label', content);

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
          this.label.setAttribute('for', id);
          this.label.id = `${id}-label`;
          this.input.setAttribute('aria-controls', attr.value);
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
    this.controlledElement.setAttribute('aria-labelledby', this.label.id);
    this.controlledElement.setAttribute('role', 'tabpanel');
    if (!this.input.checked)  this.controlledElement.setAttribute('hidden', 'hidden');
    else                      this.controlledElement.removeAttribute('hidden');
    
    this.input.addEventListener('change', () => this.toggle());
    this.ready = true;
    this.update();
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;
    this.update([name]);
  }


  static get observedAttributes() {
    return ['label'];
  }
}

if (!customElements.get('tab-label')) customElements.define('tab-label', TabLabel);