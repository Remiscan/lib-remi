import materialIconsSheet from './ext/material_icons.css' assert { type: 'css' };
import themeSheet from './ext/themes.css' assert { type: 'css' };



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button class="surface">
    <span id="icon" class="material-icons"><slot name="icon"></slot></span>
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
    width: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    --surface: transparent;
    color: rgb(var(--on-surface));
  }

  :host(.filled) button {
    --surface: var(--primary);
    color: rgb(var(--on-primary));
  }

  :host(.filled-tonal) button {
    --surface: var(--secondary-container);
    color: rgb(var(--on-secondary-container));
  }

  :host(.outlined) button {
    --surface: transparent;
    color: rgb(var(--on-surface));
    outline: 1px solid rgb(var(--outline));
  }

  button::before {
    content: '';
    display: block;
    width: 48px;
    height: 48px;
    position: absolute;
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
    --elevation-opacity: var(--elevation-4-opacity);
    --state-opacity: var(--state-hover-opacity);
  }

  button:focus-visible {
    --elevation-opacity: var(--elevation-3-opacity);
    --state-opacity: var(--state-focus-opacity);
  }

  button:active {
    --elevation-opacity: var(--elevation-3-opacity);
    --state-opacity: var(--state-active-opacity);
  }
`);

class MaterialIconButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [materialIconsSheet, themeSheet, sheet];
  }
}

if (!customElements.get('material-icon-button')) customElements.define('material-icon-button', MaterialIconButton);