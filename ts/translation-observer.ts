/** The method used to notify an element of a language change. */
type notificationMethod = 'attribute' | 'event' | 'both';
type TranslatedStrings = { [key: string]: { [key: string]: string }};



/**
 * Finds the closest element to a base element that matches a selector.
 */
function closestElement(selector: string, base: Node | Window): Element | null {
  if (!base || !(base instanceof Element)) return null;
  let result = base.closest(selector);
  if (!result) {
    let newBase = base.getRootNode();
    if (newBase instanceof ShadowRoot) newBase = newBase.host;
    result = closestElement(selector, newBase);
  }
  return result;
}



/**
 * Creates a MutationObserver that takes a set of elements,
 * finds their sources (= closest elements with a lang attribute),
 * observes these sources, and reflects changes to these sources'
 * lang attributes onto the set of elements. Used by custom elements
 * to translate their content when their container changes language.
 */
export class TranslationObserver {
  #jobs: Map< Element, Map<Node, { method: notificationMethod }> > = new Map(); // Map<source, jobs>>
  #observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        const source = mutation.target;
        if (!(source instanceof Element)) throw new TypeError('Expecting Element');
        const jobs = this.#jobs.get(source) || new Map();
        for (const [element, { method }] of jobs.entries()) {
          this.notify(element, source, method);
        }
      }
    }
  });
  defaultLang = 'en';


  /**
   * Here "serve" an element means observe its source and notify the element when the source's lang attribute changes.
   * @param {Node} node - The element to serve.
   * @param {boolean} init - Whether to immediately update the element's lang attribute before observing changes.
   * @param {notificationMethod} method - The method used to notify the element.
   */
  serve(node: Node, { init = true, method = 'attribute' }: { init?: boolean, method?: notificationMethod } = {}) {
    if (node === document.documentElement) method = 'event';
    const source = closestElement('[lang]', node) || document.documentElement;

    let jobsWithSameSource = this.#jobs.get(source);
    if (!jobsWithSameSource) {
      jobsWithSameSource = new Map();
      this.#jobs.set(source, jobsWithSameSource);
    }
    jobsWithSameSource.set(node, { method });

    if (init) this.notify(node, source, method);
    this.#observer.observe(source, { attributes: true });
  }


  /**
   * Here "unserve" an element means stop observing its source.
   * @param {Node} node - The element to unserve.
   */
  unserve(node: Node) {
    const source = this.getSourceOf(node);
    if (!source) return;

    const jobsWithSameSource = this.#jobs.get(source) || new Map();
    jobsWithSameSource.delete(node);
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
   */
  translate(container: Element | DocumentFragment, strings: TranslatedStrings, lang: string, defaultLang: string = this.defaultLang) {
    let currentLang = lang;
    if (!lang) {
      const source = this.getSourceOf(container) ?? document.documentElement;
      currentLang = source.getAttribute('lang') ?? '';
    }
    const getString = (id: string): string => strings[currentLang]?.[id] ?? strings[defaultLang]?.[id] ?? 'undefined string';

    // Translate all texts in the container
    if ('shadowRoot' in container && container.shadowRoot instanceof ShadowRoot) {
      container = container.shadowRoot as DocumentFragment;
    }
    for (const e of [...container.querySelectorAll('[data-string]')]) {
      if (e instanceof HTMLImageElement) e.alt = getString(e.getAttribute('data-string') ?? '');
      else if (e instanceof Element)     e.innerHTML = getString(e.getAttribute('data-string') ?? '');
    }
    for (const e of [...container.querySelectorAll('[data-label]')]) {
      e.setAttribute('aria-label', getString(e.getAttribute('data-label') ?? ''));
    }
  }


  /**
   * Notifies an element that it's source's lang attribute changed.
   */
  notify(node: Node, source: Element, method: notificationMethod) {
    if (!source) return;
    const language = source.getAttribute('lang') ?? this.defaultLang;
    if (node instanceof Element && (method === 'attribute' || method === 'both')) {
      node.setAttribute('lang', language);
    }
    if (!(node instanceof Element) || method === 'event' || method === 'both') {
      node.dispatchEvent(
        new CustomEvent('translate', { detail: { lang: language, language: language } })
      );
    }
  }


  /**
   * Finds the source of an element.
   */
  getSourceOf(node: Node) {
    for (const [s, els] of this.#jobs) {
      if (els.has(node)) return s;
    }
    return null;
  }
}

const observer = new TranslationObserver();
export default observer;