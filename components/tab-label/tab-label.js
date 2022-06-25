/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "tab-label": "/_common/components/tab-label/tab-label.js",
    "tab-label-styles": "/_common/components/tab-label/styles.css",
    "tab-label-template": "/_common/components/tab-label/template.js"
  }
}
</script>
*/



/**************************************
***** EXAMPLE OF USE ******************
***************************************

<fieldset role="tablist" data-group="tabs-group-name">
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



import sheet from 'tab-label-styles' assert { type: 'css' };
import template from 'tab-label-template';



class TabLabel extends HTMLElement {
  constructor() {
    super();
    this.ready = false;
  }


  toggle() {
    if (!this.tabs) this.tabs = [...document.querySelectorAll(`input[name="${this.group}"]`)];
    for (const tab of this.tabs) {
      const element = document.getElementById(tab.getAttribute('aria-controls'));
      if (tab.checked) {
        element.removeAttribute('hidden');
        element.setAttribute('tabindex', 0);
        tab.setAttribute('aria-selected', 'true');
        window.dispatchEvent(new CustomEvent('tabchange', { detail: { group: this.group, value: tab.value } }));
      } else {
        element.setAttribute('hidden', 'hidden');
        element.setAttribute('tabindex', -1);
        tab.setAttribute('aria-selected', 'false');
      }
    }
  }


  update(attr) {
    if (!this.ready) return;

    switch (attr) {
      case 'label': {
        this.label.innerHTML = this.getAttribute('label');
      } break;
    }
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    this.appendChild(template.content.cloneNode(true));

    this.label = this.querySelector('label');

    this.controlledElement = document.getElementById(this.getAttribute('controls'));
    this.controlledElement.setAttribute('role', 'tabpanel');
    this.controlledElement.setAttribute('tabindex', -1);

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
          this.input.setAttribute('value', attr.value);
          break;
        case 'active':
          this.input.setAttribute('checked', attr.value !== 'false');
          this.input.setAttribute('aria-selected', attr.value !== 'false');
          this.controlledElement.setAttribute('tabindex', 0);
          this.removeAttribute('active');
          break;
      }
    }

    if (!this.input.getAttribute('name')) {
      this.group = this.parentElement.dataset.group;
      this.input.setAttribute('name', this.group);
    }

    this.controlledElement.setAttribute('aria-labelledby', this.label.id);
    if (!this.input.checked)  this.controlledElement.setAttribute('hidden', 'hidden');
    else                      this.controlledElement.removeAttribute('hidden');
    
    this.input.addEventListener('change', () => this.toggle());

    this.ready = true;
    for (const attr of TabLabel.observedAttributes) {
      this.update(attr);
    }
  }


  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue == newValue) return;
    this.update(attr);
  }


  static get observedAttributes() {
    return ['label'];
  }
}

if (!customElements.get('tab-label')) customElements.define('tab-label', TabLabel);