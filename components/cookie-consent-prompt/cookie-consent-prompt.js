// See /_common/js/cookie-maker.js for how to use.

import strings from 'cookie-consent-prompt-strings' assert { type: 'json' };
import sheet from 'cookie-consent-prompt-styles' assert { type: 'css' };
import template from 'cookie-consent-prompt-template';
import translationObserver from 'translation-observer';



export class CookieConsentPrompt extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    if (!this.innerHTML)
      this.appendChild(template.content.cloneNode(true));

    translationObserver.serve(this);

    // Listen to button clicks
    const buttonYes = this.querySelector('.cookie-consent-prompt-button-yes');
    const buttonNo = this.querySelector('.cookie-consent-prompt-button-no');
    const consentEvent = bool => window.dispatchEvent(
      new CustomEvent('cookieconsent', {
        detail: {
          name: this.getAttribute('cookie'),
          consent: bool
        }
      })
    );
    buttonYes.addEventListener('click', () => {
      consentEvent(true);
    });
    buttonNo.addEventListener('click', () => {
      consentEvent(false);
    });
  }


  disconnectedCallback() {
    translationObserver.unserve(this);
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