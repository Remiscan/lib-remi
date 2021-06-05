///////////////////////////////////////////////////////////
// Pour traduire un(e) appli / site web avec ce module : //
// voir exemple en fin de fichier                        //
///////////////////////////////////////////////////////////

export default class Traduction {
  constructor(app, path, defaultLanguage = 'fr') {
    this.app = app;
    this.path = path;
    this.Textes = {};
    this.loaded = false;
    this.defaultLanguage = defaultLanguage;
    this.buttonsReady = false;

    const localLang = localStorage.getItem(`${this.app}/langage`);
    const httpLang = document.documentElement.dataset.httpLang;
    const navLang = navigator.language;
    if (localLang != null)
      this.language = localLang
    else if (httpLang)
      this.language = httpLang;
    else if (navLang != null)
      this.language = navLang.substring(0, 2);
    else
      this.language = defaultLanguage;
  }

  // Initialise le module de traduction pour ${projet}
  async ready() {
    if (this.loaded === true) return true;

    let response = await fetch(this.path);
    if (response.status !== 200) 
      throw '[:(] Erreur ' + response.status + ' lors de la requête';
    response = await response.json();

    this.Textes = response;
    this.loaded = true;
    return true;
  }

  // Initialise les boutons pour changer de langue
  async initLanguageButtons() {
    if (this.buttonsReady) return true;
    try {
      for (const bouton of [...document.querySelectorAll('.bouton-langage')]) {
        bouton.addEventListener('click', async event => {
          if (bouton.tagName == 'A') event.preventDefault();
          const lang = bouton.dataset.lang || bouton.lang;
          await this.switchLanguage(lang);
          window.dispatchEvent(new CustomEvent('translate', { detail: { lang: lang } }));
          await this.traduire();
        });
      }
      this.buttonsReady = true;
      return true;
    }
    catch(error) {
      console.error(error);
      return false;
    }
  }

  // Récupère un string dans la langue paramétrée de manière synchrone
  getString(id, lang = false) {
    const language = lang || this.language;
    if (!this.loaded) throw 'La Traduction n\'est pas prête';
    return this.Textes[language][id] || this.Textes[this.defaultLanguage][id] || 'undefined string';
  }

  // Change la langue paramétrée
  async switchLanguage(lang = false) {
    try {
      let nextLanguage = lang;
      if (lang == false) {
        const supportedLanguages = await this.supportedLanguages;
        const k = supportedLanguages.findIndex(l => l == this.language);
        nextLanguage = supportedLanguages[(k + 1) % supportedLanguages.length];
      }
      this.language = nextLanguage;
      return true;
    }
    catch(error) {
      console.error(error);
      return false;
    }
  }

  set language(lang) {
    localStorage.setItem(`${this.app}/langage`, lang);
  }

  get language() {
    return localStorage.getItem(`${this.app}/langage`) || this.defaultLanguage;
  }

  get supportedLanguages() {
    return this.ready().then(() => Object.getOwnPropertyNames(this.Textes));
  }

  async traduire(element = document, language = this.language) {
    try {
      await this.ready();
      if (language != this.language) await this.switchLanguage(language);

      // <html lang>
      if (element == document) document.documentElement.lang = this.language;

      // Dés/active les boutons de traduction
      for (const bouton of [...element.querySelectorAll('button[data-lang]')]) {
        if (bouton.dataset.lang == this.language) {
          bouton.disabled = true;
          bouton.tabIndex = -1;
        } else {
          bouton.disabled = false;
          bouton.tabIndex = 0;
        }
      }

      // Traduit les textes
      for (const e of [...element.querySelectorAll('[data-string]')]) {
        if (e.tagName == 'IMG') e.alt = this.getString(e.dataset.string);
        else                    e.innerHTML = this.getString(e.dataset.string);
      }

      // Traduit les aria-labels
      for (const e of [...element.querySelectorAll('[data-label]')]) {
        e.setAttribute('aria-label', this.getString(e.dataset.label));
      }

      return true;
    }
    catch(error) {
      console.error(error);
      return false;
    }
  }
}

/*************************
 * Exemple de traduction *
 *************************/

/*
import DefTraduction from '../../_common/js/traduction.js';

class ExtTraduction extends DefTraduction {
  constructor() {
    const version = document.querySelector('link#strings').dataset.version || document.documentElement.dataset.version || 0;
    const path = `/app/strings--${version}.json`;
    super('app', path);
  }

  async traduire(element = document) {
    await super.traduire(element);
    // Faire les opérations de traduction spécifiques à l'appli ici
  }
}

export const Traduction = new ExtTraduction();
export const getString = Traduction.getString.bind(Traduction);
*/