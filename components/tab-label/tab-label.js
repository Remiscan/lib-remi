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

<div role="tablist">
  <tab-label group="tabs-group-name" controls="controlled-element-1-id" label="Tab 1 name" active="true"></tab-label>
  <tab-label group="tabs-group-name" controls="controlled-element-2-id" label="Tab 2 name"></tab-label>
  <tab-label group="tabs-group-name" controls="controlled-element-3-id" label="Tab 3 name"></tab-label>
</div>

<div id="controlled-element-1-id"></div>
<div id="controlled-element-2-id" hidden></div>
<div id="controlled-element-3-id" hidden></div>

**************************************/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <input type="radio" role="tab" aria-selected="false">
  <label></label>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer tab-label {

    [role="tablist"] {
      display: flex;
      margin: 0;
      border: none;
      gap: .6em;
      padding: 0 .6em;
      box-shadow: inset 0 -1px 0 var(--on-bg-color);

      --on-bg-color: hsl(231, 40%, 50%);
      --hover-bg-color: hsl(231, 40%, 50%, .3);
      --active-bg-color: hsl(231, 40%, 50%, .4);
      --off-text-color: black;
      --on-text-color: white;
    }

    [role="tablist"][aria-orientation="vertical"] {
      flex-direction: column;
      width: fit-content;
      padding: .6em 0;
      box-shadow: inset -1px 0 0 var(--on-bg-color);
      float: left;
    }

    @media (prefers-color-scheme: dark) {
      [role="tablist"] {
        --on-bg-color: hsl(217, 89%, 75%);
        --hover-bg-color: hsl(217, 89%, 75%, .3);
        --active-bg-color: hsl(217, 89%, 75%, .4);
        --off-text-color: white;
        --on-text-color: rgb(48, 48, 48);
      }
    }

    [role="tablist"] > legend {
      font-size: 0;
      padding: 0;
    }

    tab-label {
      display: grid;
      place-items: center;
    }

    tab-label:not([label]) {
      opacity: 0;
    }

    input[type=radio][role="tab"] {
      height: 0;
      width: 0;
      position: absolute;
      margin: 0;
      opacity: 0;
      pointer-events: none;
    }

    input[type=radio][role="tab"] + label {
      padding: .3em .6em;
      border: 1px solid var(--on-bg-color);
      color: var(--off-text-color);
      border-radius: 5px 5px 0 0;
    }

    [role="tablist"][aria-orientation="vertical"] input[type=radio][role="tab"] + label {
      border-radius: 5px 0 0 5px;
    }

    input[type=radio][role="tab"] + label:hover {
      background: var(--hover-bg-color)
    }

    input[type=radio][role="tab"] + label:active {
      background: var(--active-bg-color)
    }

    input[type=radio][role="tab"]:focus + label {
      outline: 2px solid var(--off-text-color);
      outline: 5px auto Highlight;
      outline: 5px auto -webkit-focus-ring-color;
      outline-offset: 3px;
    }

    input[type=radio][role="tab"]:focus:not(:focus-visible) + label {
      outline: none;
    }

    input[type=radio][role="tab"]:checked + label {
      background: var(--on-bg-color);
      color: var(--on-text-color);
    }

    [hidden] {
      display: none !important;
    }

  }
`);



class TabLabel extends HTMLElement {
  constructor() {
    super();
    this.ready = false;

    this.changeHandler = event => {
      this.toggle();
    };

    // Handles focus events
    this.focusHandler = focusEvent => {
      const tabs = [...document.querySelectorAll(`input[name="${this.group}"]`)];

      const keydownHandler = keydownEvent => {
        let supportedKey = true;
        let requestedInput = null;

        switch (keydownEvent.code) {
          case 'Home': {
            requestedInput = tabs?.at(0);
          } break;

          case 'End': {
            requestedInput = tabs?.at(-1);
          } break;

          default: {
            supportedKey = false;
          }
        }

        if (supportedKey && requestedInput) {
          keydownEvent.preventDefault();
          requestedInput.checked = true;
          requestedInput.focus();
          this.toggle();
        }
      };

      const blurHandler = blurEvent => {
        focusEvent.target.removeEventListener('keydown', keydownHandler);
        focusEvent.target.removeEventListener('blur', blurHandler);
      };

      focusEvent.target.addEventListener('keydown', keydownHandler);
      focusEvent.target.addEventListener('blur', blurHandler);
    };
  }


  toggle() {
    const tabs = [...document.querySelectorAll(`input[name="${this.group}"]`)];
    for (const tab of tabs) {
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


  get tablist() {
    return this.closest('[role="tablist"]');
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
    if (!this.innerHTML)
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
      this.group = this.tablist.dataset.group;
      this.input.setAttribute('name', this.group);
    }

    this.controlledElement.setAttribute('aria-labelledby', this.label.id);
    if (!this.input.checked)  this.controlledElement.setAttribute('hidden', 'hidden');
    else                      this.controlledElement.removeAttribute('hidden');
    
    this.input.addEventListener('change', this.changeHandler);
    this.input.addEventListener('focus', this.focusHandler);

    this.ready = true;
    for (const attr of TabLabel.observedAttributes) {
      this.update(attr);
    }
  }


  disconnectedCallback() {
    this.input?.removeEventListener('change', this.changeHandler);
    this.input?.removeEventListener('focus', this.focusHandler);
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