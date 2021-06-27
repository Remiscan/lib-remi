// ▼ ES modules cache-busted grâce à PHP
/*<?php ob_start();?>*/

import '/_common/components/cookie-consent-mini/cookie-consent-mini.js.php';

/*<?php $imports = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
echo versionizeFiles($imports, __DIR__); ?>*/



/**
 * Creates a Cookie class for a specific app.
 * @param {string} path - Path to which the cookie will be restricted.
 * @param {string[]} noConsent - List of cookie names who will not require consent to be set.
 * @returns {class} The Cookie class for the app.
 */
export default function CookieMaker(path, noConsent = []) {
  return class Cookie {
    /**
     * Cookie options.
     * @typedef {Object} CookieOptions
     * @property {number} maxAge - The number of seconds after which the cookie will be deleted.
     * @property {string} expires - The date when the cookie will be deleted.
     * @property {boolean} [session=true] - Whether this cookie will be deleted when this session ends.
     * @property {string} [sameSite=lax] - Defines when the cookie will be sent to the server.
     * @property {boolean} [secure=true] - Whether the cookie will only be sent on HTTPS.
     */

    /**
     * Creates a cookie.
     * @param {string} name - Name of the cookie.
     * @param {*} value - Value of the cookie.
     * @param {CookieOptions} options - Other cookie parameters.
     * @param {boolean} consent - Whether to ask for consent before creating the cookie.
     */
    constructor(name, value, options = {}) {
      this.name = name;
      this.value = value;
      this.expiration = options.session ? '' : options.maxAge ? `max-age=${options.maxAge}`
                                             : options.expires ? `expires=${options.expires}`
                                             : `expires=${new Date(2147483647000).toUTCString()}`;
      this.sameSite = options.sameSite || 'lax';
      this.secure = options.secure === false ? '' : 'secure';
    }

    /** @returns {string} The path to which cookies will be restricted. */
    static get path() { return path; }

    /** @returns {string[]} List of cookies which do not require consent. */
    static get noConsent() { return noConsent; }

    /** 
     * Gets the previous user response about a particular cookie.
     * @param {string} name - Name of the cookie.
     * @returns {number} The previous user response for a particular cookie.
     */
    static previousDecision(name) { return localStorage.getItem(`${this.path}/consent-cookie-${name}`); }


    /** Sets the cookie. */
    set(force = false) {
      if (!force && !Cookie.noConsent.includes(this.name) && Cookie.previousDecision(this.name) != 1)
        throw `The user did not authorise this cookie ("${this.name}")`;
      document.cookie = `${this.name}=${this.value};path=${this.path};${this.expiration};${this.sameSite};${this.secure}`;
    }


    /**
     * Waits for user consent then sets a cookie.
     * @param {string} name - Name of the cookie.
     * @param {*} value - Value of the cookie.
     * @param {CookieOptions} options - Other cookie parameters.
     * @returns {Cookie} The created cookie.
     */
    static async submit(name, value, options = {}) {
      const cookie = new Cookie(name, value, options);
      const userConsent = await this.prompt(cookie);
      try {
        if (userConsent) cookie.set();
        else throw `The user did not authorise this cookie ("${name}")`;
      } catch (error) { console.log(error); }
    }


    /**
     * Asks for user consent about a cookie.
     * @param  {Cookie} cookie - Cookie the user should consent to.
     * @returns {boolean[]} Array of user responses.
     */
    static async prompt(cookie) {
      // If we're asking the user to consent to a single cookie and he already did so, don't ask again.
      const previousResponse = Cookie.previousDecision(cookie.name);
      if (previousResponse !== null) return !!previousResponse;

      // Prepares the request for user consent.
      const container = document.querySelector('.cookie-consent-container');
      if (!container) return false;
      const popup = document.createElement('cookie-consent-mini');
      popup.setAttribute('open', false);
      popup.setAttribute('cookie', cookie.name);
      popup.setAttribute('value', cookie.value);
      
      // Displays the request for user consent, with an animation managed by the cookie-prompt element itself.
      const previousPrompt = document.querySelector(`cookie-consent-mini[cookie="${cookie.name}"]`);
      if (previousPrompt) await Cookie.unprompt(cookie.name);
      container.appendChild(popup);
      container.dataset.children = (container.dataset.children || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, 10));
      popup.setAttribute('open', true);

      // A "cookieconsent" event will be sent for each cookie name if:
      // - names.length === 1 and the user gave an answer,
      // - names.length > 1 and the user clicked the cross or outside of the prompt to exit it.
      const promise = new Promise(resolve => {
        // If this cookie does not require consent, don't ask.
        if (this.noConsent.includes(cookie.name)) return resolve(true);

        // If this cookie requires consent, listen for the user's response.
        window.addEventListener('cookieconsent', event => {
          if (event.detail.name != cookie.name) return;
          if (event.detail.consent === true) {
            localStorage.setItem(`${this.path}/consent-cookie-${cookie.name}`, 1);
            return resolve(true);
          }
          else {
            localStorage.setItem(`${this.path}/consent-cookie-${cookie.name}`, 0);
            return resolve(false);
          }
        });
      });

      const response = await promise;

      // The cookie-prompt element removes itself after its closing animation ends.
      Cookie.unprompt(cookie.name);
      
      return response;
    }


    static async unprompt(name) {
      const container = document.querySelector('.cookie-consent-container');
      const popup = document.querySelector(`cookie-consent-mini[cookie="${name}"]`);
      if (!popup) return;
      container.dataset.children = container.dataset.children - 1;
      if (popup.getAttribute('open') === 'true') {
        popup.removeAttribute('open');
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      popup.remove();
      return;
    }


    /**
     * Get the value of a certain cookie.
     * @param {string} name - Name of the cookie whose value is asked.
     * @returns {*} Value of the cookie.
     */
    static get(name) {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return (match !== null) ? match[1] : null;
    }


    /**
     * Gets the name and value of all cookies.
     * ⚠ This gets all cookies from the main domain, not just from the current path! ⚠
     * @returns {{name: string, value: *}[]} The array of cookies.
     */
    static get all() {
      return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies.push( { name, value } );
        return cookies;
      }, []);
    }


    /**
     * Deletes a certain cookie.
     * @param {*} name - Name of the cookie.
     */
    static delete(name) {
      Cookie.unprompt(name);
      const cookie = new Cookie(name, '', { maxAge: -1 });
      cookie.set(true);
    }
  };
}