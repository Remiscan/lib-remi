/**************************************
***** EXAMPLE OF USE ******************
***************************************

<fieldset role="tablist" group="tabs-group-name">
  <legend data-string="tabs-group-name-label"></legend>

  <tab-label controls="controlled-element-1-id" active="true">Tab 1 name</tab-label>
  <tab-label controls="controlled-element-2-id">Tab 2 name</tab-label>
  <tab-label controls="controlled-element-3-id">Tab 3 name</tab-label>
</fieldset>

<div id="controlled-element-1-id"></div>
<div id="controlled-element-2-id" hidden></div>
<div id="controlled-element-3-id" hidden></div>

***** or ******************************

<div group="tabs-group-name" id="controlled-element-1-id"></div>
<div group="tabs-group-name" id="controlled-element-2-id" hidden></div>
<div group="tabs-group-name" id="controlled-element-3-id" hidden></div>

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


  updateGroup(name) {
    const tabs = [...document.querySelectorAll(`input[name="${name}"]`)];
    for (const tab of tabs) {
      const element = document.getElementById(tab.getAttribute('aria-controls'));
      if (tab.checked) {
        element.removeAttribute('hidden');
      } else {
        element.setAttribute('hidden', 'hidden');
      }
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
    const input = this.querySelector('input[role="tab"]');
    for (const attr of [...this.attributes]) {
      switch (attr.name) {
        case 'group': input.setAttribute('name', attr.value); break;
        case 'controls':
          const id = `input-for-${attr.value}`;
          input.setAttribute('id', id);
          label.setAttribute('for', id);
          label.id = `${id}-label`;
          input.setAttribute('aria-controls', attr.value);
          break;
        case 'active':
          input.setAttribute('checked', attr.value !== 'false');
          this.removeAttribute('active');
          break;
      }
    }

    if (!input.getAttribute('name')) input.setAttribute('name', this.parentElement.dataset.group);

    const controlledElement = document.getElementById(this.getAttribute('controls'));
    controlledElement.setAttribute('aria-labelledby', label.id);
    controlledElement.setAttribute('role', 'tabpanel');
    
    this.updateGroup(input.name);
    input.addEventListener('change', () => this.updateGroup(input.name));
  }
}

if (!customElements.get('tab-label')) customElements.define('tab-label', TabLabel);