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

    height: 56px;
    width: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;

    --surface: var(--primary-container);
    color: rgb(var(--on-primary-container));
    --elevation-opacity: var(--elevation-3-opacity);
    --elevation-shadow: var(--elevation-3-shadow);
  }

  :host(:not(.extended)) #label {
    display: none;
  }

  :host(.extended) button {
    min-width: 80px;
    width: auto;
  }

  :host(.small) button {
    height: 40px;
    width: 40px;
    border-radius: 12px;
  }

  :host(.large) button {
    height: 96px;
    width: 96px;
    border-radius: 28px;
    padding: 16px;
  }

  :host(.large) .material-icons {
    font-size: 2.25rem;
  }

  :host(.color-surface) button {
    --surface: var(--surface);
    --state-tint: var(--primary);
    color: rgb(var(--primary));
  }

  :host(.secondary) button {
    --surface: var(--secondary-container);
    --state-tint: var(--on-secondary-container);
    color: rgb(var(--on-secondary-container));
  }

  :host(.tertiary) button {
    --surface: var(--tertiary-container);
    --state-tint: var(--on-tertiary-container);
    color: rgb(var(--on-tertiary-container));
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

class MaterialFab extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [materialIconsSheet, themeSheet, sheet];
  }
}

if (!customElements.get('material-fab')) customElements.define('material-fab', MaterialFab);