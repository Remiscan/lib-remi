export default class Cookie {
  /**
   * Creates a cookie.
   * @param {string} name - Name of the cookie.
   * @param {*} value - Value of the cookie.
   * @param {string} path - Path to which the cookie will be restricted.
   * @param {?number} maxAge - Time before the cookie will automatically be deleted, in seconds.
   */
  constructor(name, value, path, maxAge = null) {
    this.name = name;
    this.value = value;
    this.path = path;
    this.maxAge = maxAge;
    this.set();
  }


  /** Adds a cookie to the browser. */
  set() {
    const expiration = this.maxAge ? `max-age=${this.maxAge}` 
                                   : `expires=${new Date(2147483647000).toUTCString()}`;
    document.cookie = `${this.name}=${this.value}; path=${this.path}; ${expiration};`
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