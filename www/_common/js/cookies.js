export default class Cookie {
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


  ////////////////
  // Sets a cookie
  set() {
    const expiration = this.maxAge ? `max-age=${this.maxAge}` 
                                   : `expires=${new Date(2147483647000).toUTCString()}`;
    document.cookie = `${this.name}=${this.value}; path=${this.path}; ${expiration};`
  }


  ///////////////////////////////////////////
  // Sets a cookie consent localStorage value
  // - for all cookies if name === null
  // - for a specific cookie if name !== null
  static consent(path, bool, name = null) {
    if (name !== null) {
      if (bool) localStorage.setItem(`${path}/consent-cookie-${name}`, 1);
      else {
        localStorage.removeItem(`${path}/consent-cookie-${name}`);
        Cookie.delete(path, name);
      }
    } else {
      if (bool) localStorage.setItem(`${path}/consent-cookie-all`, 1);
      else {
        localStorage.removeItem(`${path}/consent-cookie-all`);
        Cookie.all.map(c => Cookie.delete(path, c.name));
      }
    }
  }


  /////////////////////////////////////
  // Gets the value of a certain cookie
  static get(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return (match !== null) ? match[1] : null;
  }


  /////////////////////////////////////////
  // Gets the name and value of all cookies
  // ⚠ This gets all cookies from the main domain, not just from path ⚠
  static get all() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies.push( { name, value } );
      return cookies;
    }, []);
  }


  ///////////////////////////
  // Deletes a certain cookie
  static delete(path, name) {
    return new Cookie(name, '', path, -1);
  }
}