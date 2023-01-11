import materialIconsSheet from './ext/material_icons.css' assert { type: 'css' };
import themeSheet from './ext/themes.css' assert { type: 'css' };



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button class="surface">
    <span id="icon" class="material-icons"><slot name="icon"></slot></span>
    <span id="label" class="label-large"><slot name="label"></slot></span>
  </button>
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host { display: contents; }

  button {
    -webkit-appearance: none;
    appearance: none;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    font: inherit;

    height: 40px;
    width: fit-content;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 24px;
  }

  button:has(#icon:not(:empty)) {
    padding-left: 16px;
  }

  button:disabled {
    color: var(--on-surface);
    --elevation-opacity: 0;
  }

  button:disabled #label,
  button:disabled #icon {
    opacity: 38%;
  }

  button:hover {
    --elevation-opacity: var(--elevation-2-opacity);
    --state-opacity: var(--state-hover-opacity);
  }

  button:focus-visible {
    --elevation-opacity: var(--elevation-1-opacity);
    --state-opacity: var(--state-focus-opacity);
  }

  button:active {
    --elevation-opacity: var(--elevation-1-opacity);
    --state-opacity: var(--state-active-opacity);
  }

  /* Elevated */

  :host(.elevated) button {
    color: rgb(var(--primary));
    --elevation-opacity: var(--elevation-1-opacity);
    --elevation-shadow: var(--elevation-1-shadow);
    --state-tint: var(--primary);
  }

  :host(.elevated) button:hover {
    --elevation-shadow: var(--elevation-2-shadow);
  }

  :host(.elevated) button:focus-visible {
    --elevation-shadow: var(--elevation-1-shadow);
  }

  :host(.elevated) button:active {
    --elevation-shadow: var(--elevation-1-shadow);
  }

  /* Filled */

  :host(.filled) button {
    --surface: var(--primary);
    color: rgb(var(--on-primary));
    --state-tint: var(--on-primary);
  }

  /* Filled tonal */

  :host(.filled-tonal) button {
    --surface: var(--secondary-container);
    color: rgb(var(--on-secondary-container));
  }

  /* Outlined */

  :host(.outlined) button {
    --surface: transparent;
    outline: 1px solid rgb(var(--outline));
    color: rgb(var(--primary));
  }

  /* Text */

  :host(.text) button {
    --surface: transparent;
    color: rgb(var(--primary));
  }
`);

class MaterialButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [materialIconsSheet, themeSheet, sheet];
  }
}

if (!customElements.get('material-button')) customElements.define('material-button', MaterialButton);