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

import * as markdown from 'markdown-wasm';



export class MarkdownBlock extends HTMLElement {
  constructor() {
    super();
    this.parsed = false;
    this.parsing = false;
  }


  async parseContent() {
    if (this.parsing) return;
    this.parsing = true;

    const markdownContent = this.innerHTML;
    await markdown.ready;
    const HTMLContent = markdown.parse(markdownContent);

    const template = document.createElement('template');
    template.innerHTML = HTMLContent;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));

    this.setAttribute('parsed', '');
    this.parsed = true;
  }


  connectedCallback() {
    if (this.parsed || this.parsing) return;
    this.parseContent();
  }
}

if (!customElements.get('markdown-block')) customElements.define('markdown-block', MarkdownBlock);