/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "remiscan-logo": "/_common/components/remiscan-logo/remiscan-logo.js",
    "remiscan-logo-styles": "/_common/components/remiscan-logo/styles.css.php",
    "remiscan-logo-template": "/_common/components/remiscan-logo/template.js"
  }
}
</script>
*/

import sheet from 'remiscan-logo-styles' assert { type: 'css' };
import template from 'remiscan-logo-template';



class RemiscanLogo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }

  static get observedAttributes() {
    return ['text-color', 'text-gradient', 'background'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    const link = this.shadow.querySelector('a');
    if (newValue) link.style.setProperty(`--${attr}`, newValue);
    else          link.style.removeProperty(`--${attr}`);
  }
}

if (!customElements.get('remiscan-logo')) customElements.define('remiscan-logo', RemiscanLogo);