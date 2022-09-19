/* Use with this import map :
<script type="importmap">
{
  "imports": {
    "markdown-wasm": "/_common/components/markdown-block/markdown-wasm/markdown.es.js",
    "markdown-block": "/_common/components/markdown-block/markdown-block.js"
  }
}
</script>
*/

import * as Parser from 'markdown-wasm';



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


  /** Gets the content of the source element and converts it from Markdown to HTML. */
  async parseContent() {
    if (this.parsed || this.parsing) return;
    this.parsing = true;

    // Get the content of the source element
    const sourceID = this.getAttribute('source');
    const source = document.getElementById(sourceID) || this;
    if (this.source !== source) {
      this.source = source;
      if (this.source !== this) this.observeSource();
    }

    // Parse the source's content and inset it into the block
    const markdown = this.source.innerHTML;
    await Parser.ready;
    const html = Parser.parse(markdown);
    this.innerHTML = html;
    console.log('content parsed', this.source, Date.now());

    // Mark the block as parsed
    this.setAttribute('parsed', '');
    this.parsed = true;
    this.parsing = false;
  }


  /** Changes the source element. */
  observeSource() {
    this.observer.observe(this.source, { characterData: true, subtree: true });
    console.log('observed:', this.source);
  }


  connectedCallback() {
    // If a source element is already defined, observe it.
    if (this.source && this.source !== this) this.observeSource();

    // If no source element is defined, markdown-block is its own source element. Parse its content.
    else this.parseContent();
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
        // Reset the block's state
        this.parsed = false;
        this.removeAttribute('parsed');

        this.parseContent();
      } break;
    }
  }
}

if (!customElements.get('markdown-block')) customElements.define('markdown-block', MarkdownBlock);