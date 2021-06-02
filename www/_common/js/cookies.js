export default class Cookie {
  constructor(name, value, path, maxAge = null, consent = false) {
    this.name = name;
    this.value = value;
    this.path = path;
    this.maxAge = maxAge;
    if ((consent === true && Cookie.get('consent')) || consent === false) this.set();
  }

  set() {
    const expiration = this.maxAge ? `max-age=${this.maxAge}` 
                                   : `expires=${new Date(2147483647000).toUTCString()}`;
    document.cookie = `${this.name}=${this.value}; path=${this.path}; ${expiration};`
  }

  static consent(path, bool) {
    if (bool) return new Cookie('consent', '1', path, null);
    else      return Cookie.delete('consent');
  }

  static get(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return (match !== null) ? match[1] : null;
  }

  static delete(path, name) {
    return new Cookie(name, '', path, -1);
  }
}