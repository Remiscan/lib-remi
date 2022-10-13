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
 * Sets the lang attribute from a source element to an element.
 * @param {Element} element 
 * @param {Element} source 
 */
function setLangAttribute(element, source) {
  if (source) element.setAttribute('lang', source.getAttribute('lang'));
}



/**
 * Creates a MutationObserver that takes a set of elements,
 * finds their sources (= closest elements with a lang attribute),
 * observes these sources,
 * and reflects changes to these sources lang attributes onto the set of elements.
 */
class TranslationObserver {
  #elements = new Map();
  #observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        for (const [source, elements] of this.#elements) {
          for (const element of elements || new Set()) {
            setLangAttribute(element, source);
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
  serve(element, init = true) {
    const source = closestElement('[lang]', element) || document.documentElement;
    const elementsWithSameSource = this.#elements.get(source) || new Set();

    this.#elements.set(source, new Set([...elementsWithSameSource, element]));
    if (init) setLangAttribute(element, source);
    this.#observer.observe(source, { attributes: true });
  }


  /**
   * Here "unserve" an element means stop observing its source.
   * @param {Element} element - The element to unserve.
   */
  unserve(element) {
    let source;
    for (const [s, els] of this.#elements) {
      if (els.has(element)) {
        source = s;
        break;
      }
    }
    if (!source) return;

    const elementsWithSameSource = this.#elements.get(source) || new Set();
    if (this.#elements.get(source).has(element)) {
      elementsWithSameSource.delete(element);
      if (elementsWithSameSource.size > 0)  this.#elements.set(source, elementsWithSameSource);
      else                                  this.#elements.delete(source);
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
    for (const source of this.#elements.keys) {
      this.#observer.observe(source);
    }
  }
}

const observer = new TranslationObserver();
export default observer;