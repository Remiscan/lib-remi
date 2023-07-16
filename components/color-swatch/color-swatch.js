import Couleur from 'colori';
import translationObserver from 'translation-observer';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <div class="color-swatch-preview"></div>
  <code class="color-swatch-expression in-gamut"></code>
  <code class="color-swatch-expression out-of-gamut"></code>
  <span class="color-swatch-in-gamut-warning" data-string="in-gamut-warning"></span>
  <span class="color-swatch-out-of-gamut-warning" data-string="out-of-gamut-warning"></span>
  <button type="button" class="color-swatch-see-alt out-of-gamut">
    <svg viewBox="1 1 22 22">
      <style>.alt-icon { fill: currentColor; }</style>
      <path class="alt-icon" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
    </svg>
    <span class="in-gamut" data-string="switch-to-out"></span>
    <span class="out-of-gamut" data-string="switch-to-in"></span>
  </button>
  <button type="button" class="color-swatch-copy" data-label="copy">
    <svg viewBox="0 0 24 24">
      <style>.copy-icon { fill: currentColor; }</style>
      <path class="copy-icon" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  </button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer color-swatch {
    color-swatch {
      display: inline-grid;
      grid-template-columns: var(--color-preview-width) auto auto;
      gap: 1ch;
      align-items: center;
      min-height: 2em;
      --echiquier-transparence: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
      linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
      linear-gradient(to right, #ddd 0% 100%);
      --warning-color: darkred;
      --color-preview-width: 3em;
    }
    @media (prefers-color-scheme: dark) {
      color-swatch {
        --warning-color: lightpink;
      }
    }
    color-swatch[clipped] {
      grid-template-columns: var(--color-preview-width) auto auto auto;
      grid-template-rows: auto auto;
      row-gap: 0;
    }
    color-swatch[mini] {
      grid-template-columns: var(--color-preview-width);
    }
    color-swatch[clipped]:is([format="name"], [format="hex"]) {
      grid-template-columns: var(--color-preview-width) auto auto;
    }
    color-swatch > .color-swatch-preview {
      --displayed-color: var(--color);
      grid-row: 1 / -1;
      background: linear-gradient(to right, var(--displayed-color) 0% 100%),
                  var(--echiquier-transparence);
      background-size: 100% 100%, 16px 16px, 16px 16px;
      background-position: 0 0, 0 0, 8px 8px;
      background-repeat: no-repeat, repeat, repeat;
      width: 100%;
      height: 100%;
    }
    color-swatch[alt] > .color-swatch-preview {
      --displayed-color: var(--alt-color, var(--color));
    }
    color-swatch > .color-swatch-expression {
      grid-row: 1;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
      white-space: nowrap;
    }
    color-swatch > .color-swatch-in-gamut-warning,
    color-swatch > .color-swatch-out-of-gamut-warning {
      grid-row: 2;
      grid-column: 2;
      font-size: .7em;
    }
    color-swatch[clipped] > .color-swatch-in-gamut-warning,
    color-swatch[clipped] > .color-swatch-out-of-gamut-warning {
      color: var(--warning-color);
    }
    color-swatch > button {
      grid-row: 1 / -1;
      display: inline-grid;
      place-items: center;
    }
    color-swatch > button > svg {
      width: 1.5em;
      height: 1.5em;
    }
    color-swatch > button > span {
      font-size: 0;
    }
    color-swatch > .color-swatch-see-alt > svg {
      transform: scale(-1, 1);
      transition: transform .1s ease;
    }
    color-swatch[alt] > .color-swatch-see-alt > svg {
      transform: scale(-1, 1) rotate(-90deg);
    }
    color-swatch .color-swatch-format {
      text-transform: uppercase;
    }
    color-swatch:not([clipped]) > .color-swatch-see-alt,
    color-swatch[clipped]:is([format="name"], [format="hex"]) > .color-swatch-see-alt,
    color-swatch[alt] > .color-swatch-expression.in-gamut,
    color-swatch:not([alt]) .color-swatch-expression.out-of-gamut,
    color-swatch[alt] > .color-swatch-see-alt > .in-gamut,
    color-swatch:not([alt]) .color-swatch-see-alt > .out-of-gamut,
    color-swatch:not([clipped]) > .color-swatch-in-gamut-warning,
    color-swatch:not([clipped]) > .color-swatch-out-of-gamut-warning,
    color-swatch[clipped]:not([alt]) > .color-swatch-out-of-gamut-warning,
    color-swatch[clipped][alt] > .color-swatch-in-gamut-warning {
      display: none;
    }
    color-swatch[mini] > .color-swatch-expression,
    color-swatch[mini] > button {
      display: none;
    }
    html[lang="fr"] color-swatch [lang="en"],
    html:not([lang="fr"]) color-swatch [lang="fr"] {
      display: none;
    }
  }
`);



const strings = {
  "fr": {
    "in-gamut-warning": "Projeté sur le gamut <span class=\"color-swatch-format\"></span>",
    "out-of-gamut-warning": "Hors du gamut <span class=\"color-swatch-format\"></span>",
    "switch-to-out": "Voir l'expression hors du gamut",
    "switch-to-in": "Voir l'expression dans le gamut",
    "copy": "Copier"
  },
  
  "en": {
    "in-gamut-warning": "Mapped onto <span class=\"color-swatch-format\"></span> gamut",
    "out-of-gamut-warning": "Out of <span class=\"color-swatch-format\"></span> gamut",
    "switch-to-out": "See out-of-gamut expression",
    "switch-to-in": "See in-gamut expression",
    "copy": "Copy"
  }
};



class ColorSwatch extends HTMLElement {
  constructor() {
    super();
    this.ready = false;
    this.color = null;
    this.gamut = null;
    this.copyHandle = () => {};
    this.altHandle = () => {};
  }


  update(attr, oldValue, newValue) {
    if (!this.ready) return;

    switch (attr) {
      case 'color': {
        this.color = new Couleur(newValue);

        const preview = this.querySelector('.color-swatch-preview');
        const expression = this.querySelector('.color-swatch-expression.in-gamut');
        this.removeAttribute('clipped');
        
        const format = this.getAttribute('format');
        let value = '';
        switch (format) {
          case 'name': value = this.color.name; break;
          case 'hex':  value = this.color.hex; break;
          default:     value = this.color.toString(this.getAttribute('format'), {
            precision: format.startsWith('color-') ? 4 : 2,
            clamp: true
          });
        }
        expression.innerHTML = value;
        preview.style.setProperty('--color', CSS.supports(`color: ${value}`) ? value : this.color.rgb);
        preview.style.removeProperty('--alt-color');

        const space = ['name', 'hex'].includes(format) ? 'srgb' : format;
        const inGamut = this.color.inGamut(space.replace('color-', ''));
        let gamut = space.replace('color-', '');
        if (['rgb', 'hex', 'name', 'hsl', 'hwb'].includes(gamut)) gamut = 'srgb';
        this.gamut = gamut;

        if (!inGamut) {
          this.setAttribute('clipped', '');
          const expressionAlt = this.querySelector('.color-swatch-expression.out-of-gamut');
          const value = this.color.toString(space, {
            precision: format.startsWith('color-') ? 4 : 2,
            clamp: false
          });
          expressionAlt.innerHTML = value;

          if (gamut !== 'srgb') {
            preview.style.setProperty('--alt-color', CSS.supports(`color: ${value}`) ? value : this.color.rgb);
          }
        }
      } break;

      case 'format': {
        this.update('color', '', this.getAttribute('color'));
      } break;
    }
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    this.appendChild(template.content.cloneNode(true));
    
    // Copy the color expression by clicking the copy button
    const copyButton = this.querySelector('.color-swatch-copy');
    copyButton.addEventListener('click', this.copyHandle = event => {
      const expression = this.getAttribute('alt') != null ? this.querySelector('.color-swatch-expression.out-of-gamut')
                                                          : this.querySelector('.color-swatch-expression.in-gamut');
      const valueToCopy = expression.innerText;

      try {
        navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
          if (result.state === 'granted' || result.state === 'prompt') {
            navigator.clipboard.writeText(valueToCopy);
          }
        });
      } catch {}
    });

    // Switch to the out-of-gamut expression by clicking the warning button
    const altButton = this.querySelector('.color-swatch-see-alt');
    altButton.addEventListener('click', this.altHandle = event => {
      if (this.getAttribute('alt') == null) this.setAttribute('alt', '');
      else                                  this.removeAttribute('alt'); 
    });

    this.ready = true;
    for (const attr of ColorSwatch.observedAttributes) {
      this.update(attr, '', this.getAttribute(attr));
    }

    translationObserver.serve(this);
  }


  disconnectedCallback() {
    const copyButton = this.querySelector('.color-swatch-copy');
    copyButton.removeEventListener('click', this.copyHandle);

    const altButton = this.querySelector('.color-swatch-see-alt');
    altButton.removeEventListener('click', this.altHandle);

    translationObserver.unserve(this);
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'lang') {
      const lang = newValue;
      const defaultLang = 'en';
      translationObserver.translate(this, strings, lang, defaultLang);
      for (const el of [...this.querySelectorAll('.color-swatch-format')]) {
        el.innerHTML = this.gamut;
      }
    } else {
      this.update(name, oldValue, newValue);
    }
  }

  static get observedAttributes() {
    return ['color', 'format', 'lang'];
  }
}

if (!customElements.get('color-swatch')) customElements.define('color-swatch', ColorSwatch);