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
  #jobs = new Map(); // Map<source: Element, jobs: Set<{ element: Element, method: 'attribute'|'event'|'both' }>>
  #observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        for (const [source, jobs] of this.#jobs) {
          for (const { element, method } of jobs || new Set()) {
            TranslationObserver.notify(element, source, method);
          }
        }
      }
    }
  });


  /**
   * Here "serve" an element means observe its source and update the element's lang attribute when the source's lang attribute changes.
   * @param {Element} element - The element to serve.
   * @param {boolean} init - Whether to immediately update the element's lang attribute before observing changes.
   */
  serve(element, { init = true, method = 'attribute' } = {}) {
    const source = closestElement('[lang]', element) || document.documentElement;
    const jobsWithSameSource = this.#jobs.get(source) || new Set();

    this.#jobs.set(source, new Set([...jobsWithSameSource, { element, method }]));
    if (init) TranslationObserver.notify(element, source, method);
    this.#observer.observe(source, { attributes: true });
  }


  /**
   * Here "unserve" an element means stop observing its source.
   * @param {Element} element - The element to unserve.
   */
  unserve(element) {
    let source;
    for (const [s, els] of this.#jobs) {
      if (els.has(element)) {
        source = s;
        break;
      }
    }
    if (!source) return;

    const jobsWithSameSource = this.#jobs.get(source) || new Set();
    const existingJob = [...jobsWithSameSource].find(job => job.element === element);
    if (existingJob) {
      jobsWithSameSource.delete(existingJob);
      if (jobsWithSameSource.size > 0) {
        this.#jobs.set(source, jobsWithSameSource);
      } else {
        this.#jobs.delete(source);
        this.disconnect();
        this.reconnect();
      }
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
    for (const source of this.#jobs.keys) {
      this.#observer.observe(source);
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
    const getString = id => strings[lang]?.[id] ?? strings[defaultLang]?.[id] ?? 'undefined string';

    // Translate all texts in the container
    for (const e of [...container.querySelectorAll('[data-string]')]) {
      if (e.tagName == 'IMG') e.alt = getString(e.dataset.string);
      else                    e.innerHTML = getString(e.dataset.string);
    }
    for (const e of [...container.querySelectorAll('[data-label]')]) {
      e.setAttribute('aria-label', getString(e.dataset.label));
    }
  }


  /**
   * Sets the lang attribute from a source element to an element.
   * @param {Element} element
   * @param {Element} source
   */
  static setLangAttribute(element, source) {
    if (!source) return;
    element.setAttribute('lang', source.getAttribute('lang'));
  }


  /**
   * Sends a translate event containing the source's lang attribute to an element.
   * @param {Element} element
   * @param {Element} source
   */
  static sendTranslateEvent(element, source) {
    if (!source) return;
    const language = source.getAttribute('lang');
    element.dispatchEvent(
      new CustomEvent('translate', { detail: { lang: language, language: language } })
    );
  }


  /**
   * Notifies an element that it's source's lang attribute changed.
   * @param {Element} element 
   * @param {Element} source 
   * @param {'attribute'|'event'|'both'} method 
   */
  static notify(element, source, method) {
    if (method === 'attribute' || method === 'both') TranslationObserver.setLangAttribute(element, source);
    if (method === 'event' || method === 'both')     TranslationObserver.sendTranslateEvent(element, source);
  }
}

const observer = new TranslationObserver();
export default observer;