/* Use with this import map :
<script type="importmap">
{
  "imports": {
    "cancelable-async": "/_common/js/cancelable-async.js",
    "markdown-wasm": "/_common/components/markdown-block/markdown-wasm/markdown.es.js",
    "markdown-block": "/_common/components/markdown-block/markdown-block.js"
  }
}
</script>
*/

import { cancelableAsync } from 'cancelable-async';
import * as Parser from 'markdown-wasm';



/**
 * Gets the content of the source element and converts it from Markdown to HTML.
 * Defined as a generator to use it with cancelable-async, so that only the last instance per markdown-block proceeds.
 * "this" refers to the markdown-block element doing the parsing.
 */
function* parseContent(content) {
  if (this.parsed || this.parsing) return;
  this.parsing = true;

  // Get the content of the source element
  if (!content) {
    const sourceID = this.getAttribute('source');
    const source = document.getElementById(sourceID) ?? this;
    if (this.source !== source) {
      this.source = source;
      this.observeSource();
    }
  }

  // Parse the source's content and inset it into the block
  const markdown = content ?? this.source.textContent;
  yield Parser.ready;
  const html = Parser.parse(markdown);
  yield;
  this.innerHTML = html;

  // Mark the block as parsed
  this.setAttribute('parsed', '');
  this.parsed = true;
  this.parsing = false;
}



export class MarkdownBlock extends HTMLElement {
  constructor() {
    super();
    
    this.parsed = false; // Whether the source's content is already parsed.
    this.parsing = false; // Whether the source's content is currently being parsed.
    this.source = null; // ID of the source element whose content will be parsed.

    // MutationObserver that will observe text changes inside the source element.
    this.observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'characterData') {
          if (this.parsing) return;

          // Reset the block's state
          this.parsed = false;
          this.removeAttribute('parsed');

          this.parseContent();
        }
      }
    });
  }


  async parseContent(content) {
    await cancelableAsync(parseContent.bind(this))(content);
  }

  async updateContent(content) {
    this.parsed = false;
    this.removeAttribute('parsed');

    return this.parseContent(content);
  }


  /** Changes the source element. */
  observeSource() {
    this.observer.disconnect();
    if (this.source) {
      this.observer.observe(this.source, { characterData: true, subtree: true });
    }
  }


  connectedCallback() {
    this.observeSource();
    this.parseContent();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }


  static get observedAttributes() {
    return ['source'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'source': {
        this.updateContent();
      } break;
    }
  }
}

if (!customElements.get('markdown-block')) customElements.define('markdown-block', MarkdownBlock);