/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "cookie-consent-prompt": "/_common/components/cookie-consent-prompt/cookie-consent-prompt.js",
    "cookie-consent-prompt-template": "/_common/components/cookie-consent-prompt/template.js",
    "cookie-factory": "/_common/js/cookie-factory.js"
  }
}
</script>
*/



/**
 * Creates a Cookie class for a specific app.
 * @param {string} path - Path to which the cookie will be restricted.
 * @param {string[]} noConsent - List of cookie names who will not require consent to be set.
 * @returns {class} The Cookie class for the app.
 */
export default function CookieFactory(path, noConsent = []) {
  const removeObserver = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      for (const node of mutation.removedNodes) {
        const cookieName = node.getAttribute('cookie');
        if (!cookieName) continue;
        const uuid = node.uuid;
        window.dispatchEvent(
          new CustomEvent('promptremoved', {
            detail: {
              name: cookieName,
              uuid
            }
          })
        );
      }
    }
  });

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
      this.path = options.path || Cookie.path;
      this.secure = options.secure === false ? '' : 'secure';
    }

    /** @returns {string} The path to which cookies will be restricted. */
    static get path() { return path; }

    /** @returns {string[]} List of cookies which do not require consent. */
    static get noConsent() { return noConsent; }


    /** Sets the cookie. */
    #set(force = false) {
      if (!force && !Cookie.noConsent.includes(this.name) && !Cookie.#getSavedConsent(this.name))
        throw `The user did not authorise this cookie ("${this.name}")`;
      document.cookie = `${this.name}=${this.value};path=${this.path};${this.expiration};${this.sameSite};${this.secure}`;
    }


    /**
     * Waits for user consent then sets a cookie.
     */
    async prompt(reprompt = false) {
      const userConsent = await this.#openPrompt(reprompt);
      try {
        if (userConsent) {
          this.#set();
          console.log(`Cookie "${this.name}" was set with user consent.`)
        }
        else throw `no-consent`;
      } catch (error) {
        if (error === 'no-consent') {
          console.log(`The user did not authorise cookie "${this.name}".`);
          if (Cookie.exists(this.name)) {
            console.log(`Cookie "${this.name}" already existed, so it was deleted.`)
            Cookie.delete(this.name);
          }
        }
      }
    }


    /**
     * Asks for user consent about the cookie.
     * @returns {boolean} User response.
     */
    async #openPrompt(reprompt) {
      // If we're asking the user to consent to a single cookie and he already did so, don't ask again.
      if (!reprompt) {
        const previousResponse = Cookie.#getSavedConsent(this.name);
        if (previousResponse !== null) return !!previousResponse;
      }

      // If this cookie does not require consent, don't ask.
      if (Cookie.noConsent.includes(this.name)) return true;

      // Prepares the request for user consent.
      const container = document.querySelector('.cookie-consent-container') || document.body;
      await import('cookie-consent-prompt');
      const popup = document.createElement('cookie-consent-prompt');
      popup.setAttribute('open', false);
      popup.setAttribute('cookie', this.name);
      popup.setAttribute('value', this.value);
      const popupId = popup.uuid;
      
      // If another prompt for the same cookie is already displayed, hide it.
      const previousPrompt = document.querySelector(`cookie-consent-prompt[cookie="${this.name}"]`);
      if (previousPrompt) await Cookie.#closePrompt(this.name);

      // Displays the request for user consent, with an animation managed by the cookie-prompt element itself.
      container.appendChild(popup);
      await new Promise(resolve => setTimeout(resolve, 10));
      popup.setAttribute('open', true);

      // A "cookieconsent" event will be sent for each cookie name if:
      // - names.length === 1 and the user gave an answer,
      // - names.length > 1 and the user clicked the cross or outside of the prompt to exit it.
      const promise = new Promise(resolve => {
        // If this cookie requires consent, listen for the user's response.
        removeObserver.observe(container, { childList: true, subtree: false });

        const removeHandler = event => {
          if (event.detail.uuid !== popupId) return;
          window.removeEventListener('promptremoved', removeHandler);

          popup.dispatchConsentEvent(false);
        };

        const consentHandler = event => {
          if (event.detail.name != this.name) return;
          window.removeEventListener('promptremoved', removeHandler);

          Cookie.#setSavedConsent(this.name, event.detail.consent);
          if (event.detail.consent === true) resolve(true);
          else                               resolve(false);

          window.removeEventListener('cookieconsent', consentHandler);
        };
        
        window.addEventListener('promptremoved', removeHandler);
        window.addEventListener('cookieconsent', consentHandler);
      });

      const consent = await promise;

      // The cookie-prompt element removes itself after its closing animation ends.
      Cookie.#closePrompt(this.name);

      return consent;
    }


    static async #closePrompt(name) {
      const container = document.querySelector('.cookie-consent-container');
      const popup = document.querySelector(`cookie-consent-prompt[cookie="${name}"]`);
      if (!popup) return;
      if (popup.getAttribute('open') === 'true') {
        popup.removeAttribute('open');
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      popup.remove();
      if ([...document.querySelectorAll(`cookie-consent-prompt[cookie]`)].length === 0) {
        removeObserver.disconnect();
      }
      return;
    }


    static get savePath() {
      return `${Cookie.path}/cookie-consent`;
    }


    static get savedConsentList() {
      return JSON.parse(localStorage.getItem(Cookie.savePath) || '[]');
    }


    static #setSavedConsent(name, consent) {
      const savedConsent = Cookie.savedConsentList;
      const nameIndex = savedConsent.findIndex(e => e.name === name);
      const toSave = { name, consent: Number(consent) };
      if (nameIndex >= 0) savedConsent[nameIndex] = toSave;
      else                savedConsent.push(toSave);
      localStorage.setItem(Cookie.savePath, JSON.stringify(savedConsent));
    }

    static #getSavedConsent(name) {
      const savedConsent = Cookie.savedConsentList;
      const consent = Boolean(savedConsent.find(e => e.name === name).consent);
      return consent;
    }


    /**
     * Get the value of a certain cookie.
     * @param {string} name - Name of the cookie whose value is asked.
     * @returns {*} Value of the cookie.
     */
    static getValue(name) {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return (match !== null) ? match[1] : null;
    }


    /**
     * Determines whether a cookie exists or not.
     * @param {string} name - Name of the cookie.
     * @returns {boolean} Whether it exists.
     */
    static exists(name) {
      return Cookie.getValue(name) !== null;
    }


    /**
     * Gets the name and value of all cookies.
     * ⚠ This gets all cookies from the main domain, not just from the current path! ⚠
     * @returns {{name: string, value: *}[]} The array of cookies.
     */
    static get all() {
      return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (value != null) cookies.push( { name, value } );
        return cookies;
      }, []);
    }


    /**
     * Deletes a certain cookie.
     * @param {*} name - Name of the cookie.
     */
    static delete(name) {
      Cookie.#closePrompt(name);
      const cookie = new Cookie(name, '', { maxAge: -1 });
      cookie.#set(true);
    }
  };
}