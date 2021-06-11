/**************************************
***** EXAMPLE OF USE ******************
***************************************

<fieldset role="tablist">
  <legend data-string="tabs-group-name-label"></legend>

  <tab-label group="tabs-group-name" controls="controlled-element-1-id" id="tab-1-id" active="true">Tab 1 name</tab-label>
  <tab-label group="tabs-group-name" controls="controlled-element-2-id" id="tab-2-id">Tab 2 name</tab-label>
  <tab-label group="tabs-group-name" controls="controlled-element-3-id" id="tab-3-id">Tab 3 name</tab-label>
</fieldset>

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
        case 'controls': input.setAttribute('aria-controls', attr.value); break;
        case 'active':
          input.setAttribute('checked', attr.value !== 'false');
          this.removeAttribute('active');
          break;
        case 'id': 
          input.setAttribute('id', attr.value);
          input.setAttribute('value', attr.value);
          label.setAttribute('for', attr.value);
          label.id = `${attr.value}-label`;
          this.removeAttribute('id');
          break;
        default: input.setAttribute(attr.name, attr.value);
      }
    }

    const controlledElement = document.getElementById(this.getAttribute('controls'));
    controlledElement.setAttribute('aria-labelledby', label.id);
    controlledElement.setAttribute('role', 'tabpanel');
    
    this.updateGroup(input.name);
    input.addEventListener('change', () => this.updateGroup(input.name));
  }
}

if (!customElements.get('tab-label')) customElements.define('tab-label', TabLabel);