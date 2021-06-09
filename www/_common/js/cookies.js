export default class Cookie {
  /**
   * Creates a cookie.
   * @param {string} name - Name of the cookie.
   * @param {*} value - Value of the cookie.
   * @param {string} path - Path to which the cookie will be restricted.
   * @param {?number} maxAge - Time before the cookie will automatically be deleted, in seconds.
   * @param {boolean} consent - Whether to ask for consent before creating the cookie.
   */
  constructor(name, value, path, maxAge = null, consent = false) {
    this.name = name;
    this.value = value;
    this.path = path;
    this.maxAge = maxAge;

    // Checks if the cookie can be set
    if (
      (consent === true && localStorage.getItem(`${path}/consent-cookie-all`) == 1)         // consent is required and has been given to all cookies
      || (consent === true && localStorage.getItem(`${path}/consent-cookie-${name}`) == 1)  // consent is required and has been given to this cookie
      || consent === false                                                                  // consent isn't necessary
    ) this.set();
  }


  /** Adds a cookie to the browser. */
  set() {
    const expiration = this.maxAge ? `max-age=${this.maxAge}` 
                                   : `expires=${new Date(2147483647000).toUTCString()}`;
    document.cookie = `${this.name}=${this.value}; path=${this.path}; ${expiration};`
  }


  /**
   * Asks for user consent before creating cookies.
   * @param {string} path - Path to which the cookies will be restricted.
   * @param  {...string} names - Names of the cookies the user should consent to.
   * @returns {boolean[]} Array of user responses.
   */
  static async prompt(path, ...names) {
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
   * @param {string} path - Path to which the cookie was restricted.
   * @param {*} name - Name of the cookie.
   */
  static delete(path, name) {
    new Cookie(name, '', path, -1);
  }
}