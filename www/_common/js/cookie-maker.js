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
      if (!this.noConsent.includes(name) && Number(localStorage.getItem(`${path}/consent-cookie-${names[0]}`)) !== 1) return;

      const expiration = options.session ? '' : options.maxAge ? `max-age=${options.maxAge}`
                                              : options.expires ? `expires=${options.expires}`
                                              : `expires=${new Date(2147483647000).toUTCString()}`;
      const sameSite = options.sameSite ? `samesite=${options.sameSite}` : `samesite=lax`;
      const secure = options.secure === false ? '' : 'secure;'
      
      document.cookie = `${name}=${value};path=${this.path};${expiration};${sameSite};${secure}`
    }

    /** @returns {string} The path to which cookies will be restricted. */
    static get path() { return path; }

    /** @returns {string[]} List of cookies which do not require consent. */
    static get noConsent() { return noConsent; }


    /**
     * 
     * @param {string} name - Name of the cookie.
     * @param {*} value - Value of the cookie.
     * @param {CookieOptions} options - Other cookie parameters.
     * @returns {Cookie} The created cookie.
     */
    static async set(name, value, options = {}) {
      const userConsent = await this.prompt(name);
      try {
        if (userConsent) return new Cookie(name, value, options);
        else throw `The user did not authorise this cookie ("${name}")`;
      } catch (error) {}
    }


    /**
     * Asks for user consent before creating cookies.
     * @param  {...string} names - Names of the cookies the user should consent to.
     * @returns {boolean[]} Array of user responses.
     */
    static async prompt(...names) {
      // If we're asking the user to consent to a single cookie and he already did so, don't ask again.
      if (names.length === 1 && Number(localStorage.getItem(`${path}/consent-cookie-${names[0]}`)) === 1)
        return [true];

      // Prepares the request for user consent.
      const popup = document.createElement('cookie-prompt');
      popup.setAttribute('cookies', JSON.stringify(names));
      await Traduction.translate(popup);
      
      // Displays the request for user consent, with an animation managed by the cookie-prompt element itself.
      document.body.appendChild(popup);
      popup.setAttribute('open', true);

      // A "cookieconsent" event will be sent for each cookie name if:
      // - names.length === 1 and the user gave an answer,
      // - names.length > 1 and the user clicked the cross or outside of the prompt to exit it.
      const promises = [];
      for (const name of names) {
        const promise = new Promise(resolve => {
          // If this cookie does not require consent, don't ask.
          if (this.noConsent.includes()) return resolve(true);

          // If this cookie requires consent, listen for the user's response.
          window.addEventListener('cookieconsent', event => {
            if (event.detail.name != name) return;
            if (event.detail.consent === true) {
              localStorage.setItem(`${path}/consent-cookie-${name}`, 1);
              return resolve(true);
            }
            else {
              localStorage.setItem(`${path}/consent-cookie-${name}`, 0);
              return resolve(false);
            }
          });
        });
        promises.push(promise);
      }

      const responses = await Promise.all(promises);

      // The cookie-prompt element removes itself after its closing animation ends.
      popup.setAttribute('open', false);
      
      return responses;
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
    static delete(path, name) {
      new Cookie(name, '', path, -1);
    }
  };
}