/**
 * The method used to notify an element of a language change.
 * @typedef { 'attribute' | 'event' | 'both' } notificationMethod
 */



/**
 * Finds the closest element to a base element that matches a selector.
 * @param {string} selector 
 * @param {Element} base 
 * @returns {Element}
 */
function closestElement(selector, base) {
  if (!base || base === document || base === window) return null;
  return base.closest(selector) ?? closestElement(selector, base.getRootNode().host);
}



/**
 * Creates a MutationObserver that takes a set of elements,
 * finds their sources (= closest elements with a lang attribute),
 * observes these sources, and reflects changes to these sources'
 * lang attributes onto the set of elements. Used by custom elements
 * to translate their content when their container changes language.
 */
export class TranslationObserver {
  #jobs = new Map(); // Map<source: Element, jobs: Map<Element, { method: 'attribute'|'event'|'both' }>>
  #observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        const source = mutation.target;
        const jobs = this.#jobs.get(source) || new Map();
        for (const [element, { method }] of jobs.entries()) {
          this.notify(element, source, method);
        }
      }
    }
  });


  /**
   * Here "serve" an element means observe its source and notify the element when the source's lang attribute changes.
   * @param {Element} element - The element to serve.
   * @param {boolean} init - Whether to immediately update the element's lang attribute before observing changes.
   * @param {notificationMethod} method - The method used to notify the element.
   */
  serve(element, { init = true, method = 'attribute' } = {}) {
    if (element === document.documentElement) method = 'event';
    const source = closestElement('[lang]', element) || document.documentElement;

    let jobsWithSameSource = this.#jobs.get(source);
    if (!jobsWithSameSource) {
      jobsWithSameSource = new Map();
      this.#jobs.set(source, jobsWithSameSource);
    }
    jobsWithSameSource.set(element, { method });

    if (init) this.notify(element, source, method);
    this.#observer.observe(source, { attributes: true });
  }


  /**
   * Here "unserve" an element means stop observing its source.
   * @param {Element} element - The element to unserve.
   */
  unserve(element) {
    const source = this.getSourceOf(element);
    if (!source) return;

    const jobsWithSameSource = this.#jobs.get(source) || new Map();
    jobsWithSameSource.delete(element);
    if (jobsWithSameSource.keys().next().done) {
      this.#jobs.delete(source);
      this.disconnect();
      this.reconnect();
    }
  }


  /**
   * Stops the observer from observing every source.
   */
  disconnect() {
    this.#observer.disconnect();
  }


  /**
   * Starts observing every source currently remembered by the observer.
   */
  reconnect() {
    for (const source of this.#jobs.keys()) {
      this.#observer.observe(source, { attributes: true });
    }
  }


  /**
   * Translates an element's and it's children's contents.
   * @param {Element} container - The element to translate.
   * @param {object} strings - The JSON object containing all translated strings, imported as a JSON module.
   * @param {string} lang - The language into which the element will be translated.
   * @param {string} defaultLang - The language to use if the requested language or string isn't supported.
   */
  translate(container, strings, lang, defaultLang = 'en') {
    let currentLang = lang;
    if (!lang) {
      const source = this.getSourceOf(container) ?? document.documentElement;
      currentLang = source.getAttribute('lang') ?? '';
    }
    const getString = id => strings[currentLang]?.[id] ?? strings[defaultLang]?.[id] ?? 'undefined string';

    // Translate all texts in the container
    let _container = container.shadowRoot ?? container;
    for (const e of [..._container.querySelectorAll('[data-string]')]) {
      if (e.tagName == 'IMG') e.alt = getString(e.dataset.string);
      else                    e.innerHTML = getString(e.dataset.string);
    }
    for (const e of [..._container.querySelectorAll('[data-label]')]) {
      e.setAttribute('aria-label', getString(e.dataset.label));
    }
  }


  /**
   * Notifies an element that it's source's lang attribute changed.
   * @param {Element} element 
   * @param {Element} source 
   * @param {notificationMethod} method
   */
  notify(element, source, method) {
    if (!source) return;
    const language = source.getAttribute('lang');
    if (method === 'attribute' || method === 'both') {
      element.setAttribute('lang', language);
    }
    if (method === 'event' || method === 'both') {
      element.dispatchEvent(
        new CustomEvent('translate', { detail: { lang: language, language: language } })
      );
    }
  }


  /**
   * Finds the source of an element.
   * @param {Element} element
   */
  getSourceOf(element) {
    for (const [s, els] of this.#jobs) {
      if (els.has(element)) return s;
    }
    return null;
  }
}

const observer = new TranslationObserver();
export default observer;