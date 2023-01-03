// See /_common/js/cookie-factory.js for how to use.

import translationObserver from 'translation-observer';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <div class="cookie-consent-prompt-question-container">
    <span class="cookie-consent-prompt-question" data-string="consent-question"></span>
    <button type="button" class="cookie-consent-prompt-button-yes" data-string="consent-yes"></button>
    <button type="button" class="cookie-consent-prompt-button-no" data-string="consent-no"></button>
  </div>
  <span class="cookie-consent-prompt-info" data-string="cookie-data"></span>
`;



const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(/*css*/`
  @layer cookie-consent-prompt {

    cookie-consent-prompt {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      opacity: 0;
      pointer-events: none;
    }

    cookie-consent-prompt[open="true"] {
      opacity: 1;
      pointer-events: auto;
    }

    cookie-consent-prompt > .cookie-consent-prompt-question-container {
      grid-row: 1;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: auto auto auto 1fr;
      gap: 1ch;
      align-items: center;
    }

    cookie-consent-prompt > .cookie-consent-prompt-info {
      grid-row: 2;
      grid-column: 1 / -1;
    }

  }
`);



const strings = {
  "fr": {
    "consent-question": "Se rappeler de ce choix ? (Utilise un cookie)",
    "consent-yes": "Oui",
    "consent-no": "Non",
    "cookie-data": "Données du cookie : nom = \"{{name}}\", valeur = \"{{content}}\"."
  },
  
  "en": {
    "consent-question": "Should this choice be remembered? (Uses a cookie)",
    "consent-yes": "Yes",
    "consent-no": "No",
    "cookie-data": "Cookie data: name = \"{{name}}\", value = \"{{content}}\"."
  }
};



export class CookieConsentPrompt extends HTMLElement {
  constructor() {
    super();
    this.uuid = crypto.randomUUID();
    this.consentYes = event => this.dispatchConsentEvent(true);
    this.consentNo = event => this.dispatchConsentEvent(false);
  }


  dispatchConsentEvent(bool) {
    window.dispatchEvent(
      new CustomEvent('cookieconsent', {
        detail: {
          name: this.getAttribute('cookie'),
          consent: bool
        }
      })
    );
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(styleSheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
    if (!this.innerHTML)
      this.appendChild(template.content.cloneNode(true));

    translationObserver.serve(this);

    // Listen to button clicks
    const buttonYes = this.querySelector('.cookie-consent-prompt-button-yes');
    const buttonNo = this.querySelector('.cookie-consent-prompt-button-no');
    buttonYes.addEventListener('click', this.consentYes);
    buttonNo.addEventListener('click', this.consentNo);
  }


  disconnectedCallback() {
    translationObserver.unserve(this);

    const buttonYes = this.querySelector('.cookie-consent-prompt-button-yes');
    const buttonNo = this.querySelector('.cookie-consent-prompt-button-no');
    buttonYes.removeEventListener('click', this.consentYes);
    buttonNo.removeEventListener('click', this.consentNo);
  }


  static get observedAttributes() { return ['lang']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'lang') {
      const lang = newValue;
      const defaultLang = 'en';
      translationObserver.translate(this, strings, lang, defaultLang);

      // Populate cookie info message
      const info = this.querySelector('.cookie-consent-prompt-info');
      info.innerHTML = info.innerHTML.replace('{{name}}', this.getAttribute('cookie'));
      info.innerHTML = info.innerHTML.replace('{{content}}', this.getAttribute('value'));
    }
  }
}

if (!customElements.get('cookie-consent-prompt')) customElements.define('cookie-consent-prompt', CookieConsentPrompt);