///////////////////////////////////////////////////////////
// Pour traduire un(e) appli / site web avec ce module : //
// voir exemple en fin de fichier                        //
///////////////////////////////////////////////////////////

export default class Traduction {
  /**
   * Crée un module de traduction pour une application.
   * @param {string} app - Nom de l'application à traduire
   * @param {string} path - Chemin du fichier .json contenant les textes
   * @param {string} defaultLanguage - Langage par défaut
   */
  constructor(app, path, defaultLanguage = 'en') {
    this.app = app;
    this.path = path;
    this.Textes = {};
    this.loaded = false;
    this.defaultLanguage = defaultLanguage;
    this.buttonsReady = false;

    const html = document.documentElement;
    this.language = html.lang || html.dataset.userLang
                              || localStorage.getItem(`${this.app}/langage`)
                              || html.dataset.httpLang
                              || navigator.language?.substring(0, 2)
                              || defaultLanguage;
  }


  /** @returns {Promise.<string[]>} Liste des langages supportés par l'application. */
  get supportedLanguages() {
    return this.ready().then(() => Object.getOwnPropertyNames(this.Textes));
  }

  /** @returns {Node[]} Liste des boutons de changement de langue. */
  get languageButtons() {
    return [...document.querySelectorAll('button[data-lang]')];
  }


  /**
   * Initialise le module de traduction en récupérant les textes.
   * @returns {true} une fois initialisé.
   * @throws si les textes n'ont pas pu être récupérés.
   */
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


  /**
   * Initialise les boutons de changement de langue.
   */
  initLanguageButtons() {
    if (this.buttonsReady) return;
    let translating = false;
    for (const bouton of this.languageButtons) {
      bouton.addEventListener('click', async event => {
        if (translating) return;
        translating = true;
        if (bouton.tagName == 'A') event.preventDefault();
        this.changeLanguage(bouton.dataset.lang || bouton.lang);
        await this.traduire(document);
        translating = false;
      });
    }
    this.buttonsReady = true;
    return;
  }


  /**
   * Change la langue sélectionnée par le module.
   * @param {string} lang - Identifiant de la langue sélectionnée.
   */
  changeLanguage(lang) {
    this.language = lang;
    window.dispatchEvent(new CustomEvent('langchange', { detail: {
      language: lang, lang: lang
    }}));
  }

  /** Alias asynchrone de changeLanguage pour des raisons de compatibilité. */
  async switchLanguage(lang = false) {
    return this.changeLanguage(lang);
  }


  /**
   * Récupère de manière synchrone un texte dans la langue sélectionnée.
   * @param {string} id - Identifiant du texte à récupérer.
   * @param {?string} lang - Identifiant de la langue sélectionnée.
   * @returns {string} Le texte demandé.
   */
  getString(id, lang = this.language) {
    if (!this.loaded) throw 'La Traduction n\'est pas prête';
    return this.Textes[lang][id] || this.Textes[this.defaultLanguage][id] || 'undefined string';
  }


  /**
   * Traduit les textes d'un groupe d'éléments.
   * @param {Node} element - Le parent des éléments à traduire.
   * @param {string} language - Le langage dans lequel traduire les textes.
   * @returns {boolean} selon la réussite de la traduction.
   */
  async traduire(element = document, language = this.language) {
    try {
      // Prépare le module de traduction s'il n'est pas déjà prêt
      await this.ready();
      this.initLanguageButtons();
      if (language != this.language) this.changeLanguage(language);

      // Détermine la langue qui sera utilisée
      const supportedLanguages = await this.supportedLanguages;
      const effectiveLanguage = supportedLanguages.includes(language) ? language : this.defaultLanguage;

      // <html lang>
      if (element == document) document.documentElement.lang = effectiveLanguage;

      // Dés/active les boutons de traduction
      for (const bouton of this.languageButtons) {
        if (bouton.dataset.lang == effectiveLanguage) {
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

      window.dispatchEvent(new CustomEvent('translate', { detail: {
        element: element,
        lang: language,
        language: language
      }}));

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
import DefTraduction from '/_common/js/traduction.js';

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