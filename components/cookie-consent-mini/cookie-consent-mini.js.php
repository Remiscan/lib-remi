let cssReady = false;
const css = `<?php include './style.css.php'; ?>`;
const html = `<?php include './element.html'; ?>`;



class CookieConsentMini extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    // Add CSS to the page
    if (!cssReady) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'cookie-consent-mini-style';
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
      cssReady = true;
    }
    this.innerHTML = html;

    // Populate cookie info message
    const info = this.querySelector('.cookie-consent-mini-info');
    info.innerHTML = info.innerHTML.replace('{{name}}', this.getAttribute('cookie'));
    info.innerHTML = info.innerHTML.replace('{{content}}', this.getAttribute('value'));

    // Listen to button clicks
    const buttonYes = this.querySelector('.cookie-consent-mini-button-yes');
    const buttonNo = this.querySelector('.cookie-consent-mini-button-no');
    const consentEvent = bool => window.dispatchEvent(new CustomEvent('cookieconsent', { detail: { name: this.getAttribute('cookie'), consent: bool } }));
    buttonYes.addEventListener('click', () => consentEvent(true));
    buttonNo.addEventListener('click', () => consentEvent(false));
  }


  static define() {
    if (!customElements.get('cookie-consent-mini')) customElements.define('cookie-consent-mini', CookieConsentMini);
  }
}

export default CookieConsentMini;