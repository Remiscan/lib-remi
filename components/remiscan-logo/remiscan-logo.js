/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "remiscan-logo": "/_common/components/remiscan-logo/remiscan-logo.js",
    "remiscan-logo-svg": "/_common/components/remiscan-logo/logo.svg"
  }
}
</script>
*/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <a href="https://remiscan.fr" part="link">
    <span>remiscan</span>
    <div class="rainbow-bg" aria-hidden="true" part="text"></div>
  </a>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @keyframes rainbow-text-animation {
    0% { background-position: 0 0; }
    100% { background-position: calc(100% * var(--main-gradient-bands, 1)) 0; }
  }

  :host {
    aspect-ratio: 2 / 1;
    --width: 5rem;
    width: var(--width);
    height: calc(.5 * var(--width));

    display: inline-block;
    position: relative;

    --main-gradient-bands: 6;
    --main-gradient: repeating-linear-gradient(to right,
    hsl(262.38, 49.25%, 65.39%) 0%,
    hsl(277.6, 42.76%, 62.44%) 2.8571428571429%,
    hsl(295.08, 35.4%, 59.13%) 5.7142857142857%,
    hsl(313.7, 39.14%, 59.23%) 8.5714285714286%,
    hsl(327.89, 45.46%, 60.32%) 11.428571428571%,
    hsl(339.84, 50.19%, 61.22%) 14.285714285714%,
    hsl(339.84, 50.19%, 61.22%) 17.142857142857%,
    hsl(351.07, 53.01%, 61.96%) 20%,
    hsl(2.62, 54.75%, 61.63%) 22.857142857143%,
    hsl(12.71, 57.82%, 57.77%) 25.714285714286%,
    hsl(21.31, 58.71%, 53.42%) 28.571428571429%,
    hsl(29.14, 61.28%, 48.59%) 31.428571428571%,
    hsl(29.14, 61.28%, 48.59%) 34.285714285714%,
    hsl(36.53, 72.92%, 43.38%) 37.142857142857%,
    hsl(43.51, 84.14%, 38.4%) 40%,
    hsl(49.97, 81.84%, 36%) 42.857142857143%,
    hsl(58.51, 64.88%, 35.98%) 45.714285714286%,
    hsl(72.16, 50.34%, 40.23%) 48.571428571429%,
    hsl(72.16, 50.34%, 40.23%) 51.428571428571%,
    hsl(91.32, 38.81%, 45%) 54.285714285714%,
    hsl(120.3, 29.35%, 49.52%) 57.142857142857%,
    hsl(147.44, 46.63%, 44.45%) 60%,
    hsl(164.73, 88.18%, 34.97%) 62.857142857143%,
    hsl(172.15, 100%, 32.97%) 65.714285714286%,
    hsl(172.15, 100%, 32.97%) 68.571428571429%,
    hsl(178.67, 100%, 32.78%) 71.428571428571%,
    hsl(184.82, 100%, 35.17%) 74.285714285714%,
    hsl(189.85, 100%, 37.91%) 77.142857142857%,
    hsl(193.97, 100%, 40.19%) 80%,
    hsl(202.43, 66.72%, 51.51%) 82.857142857143%,
    hsl(202.43, 66.72%, 51.51%) 85.714285714286%,
    hsl(211.13, 66.63%, 58.51%) 88.571428571429%,
    hsl(220.77, 64.73%, 63.6%) 91.428571428571%,
    hsl(232.49, 59.69%, 67.39%) 94.285714285714%,
    hsl(247.56, 54.1%, 67.88%) 97.142857142857%,
    hsl(262.38, 49.25%, 65.39%) 100%
    );
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --main-gradient: repeating-linear-gradient(to right,
      hsl(294.66, 100%, 92.87%) 0%,
      hsl(300, 100%, 91.8%) 2.8571428571429%,
      hsl(300, 100%, 90.89%) 5.7142857142857%,
      hsl(300, 100%, 90.17%) 8.5714285714286%,
      hsl(301.24, 100%, 89.68%) 11.428571428571%,
      hsl(322.52, 100%, 89.46%) 14.285714285714%,
      hsl(322.52, 100%, 89.46%) 17.142857142857%,
      hsl(344.66, 100%, 89.53%) 20%,
      hsl(7.74, 100%, 88.4%) 22.857142857143%,
      hsl(22.81, 100%, 84.77%) 25.714285714286%,
      hsl(32.43, 100%, 81.48%) 28.571428571429%,
      hsl(39.24, 100%, 78.72%) 31.428571428571%,
      hsl(39.24, 100%, 78.72%) 34.285714285714%,
      hsl(44.39, 100%, 76.71%) 37.142857142857%,
      hsl(48.48, 100%, 75.7%) 40%,
      hsl(51.93, 100%, 75.82%) 42.857142857143%,
      hsl(59.25, 86.76%, 75.46%) 45.714285714286%,
      hsl(74.45, 93.98%, 78.68%) 48.571428571429%,
      hsl(74.45, 93.98%, 78.68%) 51.428571428571%,
      hsl(92.53, 100%, 82.3%) 54.285714285714%,
      hsl(118.68, 100%, 85.78%) 57.142857142857%,
      hsl(145.66, 100%, 81.78%) 60%,
      hsl(162.49, 100%, 77.72%) 62.857142857143%,
      hsl(173.93, 100%, 74.32%) 65.714285714286%,
      hsl(173.93, 100%, 74.32%) 68.571428571429%,
      hsl(180, 100%, 72.16%) 71.428571428571%,
      hsl(180, 100%, 71.8%) 74.285714285714%,
      hsl(180, 100%, 73.29%) 77.142857142857%,
      hsl(180, 100%, 76.2%) 80%,
      hsl(182.79, 100%, 79.9%) 82.857142857143%,
      hsl(182.79, 100%, 79.9%) 85.714285714286%,
      hsl(187.96, 100%, 83.94%) 88.571428571429%,
      hsl(197.06, 100%, 88.05%) 91.428571428571%,
      hsl(215.39, 100%, 92.06%) 94.285714285714%,
      hsl(258.14, 100%, 94.06%) 97.142857142857%,
      hsl(294.66, 100%, 92.87%) 100% 
      );
    }
  }

  a {
    width: 100%;
    height: 100%;
    display: inline-block;
    background: var(--background, transparent);
    --text-gradient: var(--main-gradient);
  }

  .rainbow-bg {
    background-image: var(--text-gradient, var(--main-gradient));
    background-position: 0 0;
    background-repeat: repeat;

    mask: var(--mask);
    mask-size: 100% 100%;
    -webkit-mask-image: var(--mask);
    -webkit-mask-size: 100% 100%;
    --mask: url("${import.meta.resolve('remiscan-logo-svg')}");

    display: none;
    width: 100%;
    height: 100%;
  }

  :host([animate]) .rainbow-bg {
    background-size: calc(var(--main-gradient-bands) * 50%) 100%;
    animation: rainbow-text-animation 40s linear infinite;
  }

  :host([text-color]) .rainbow-bg {
    background: var(--text-color);
    animation: none;
  }

  @supports (mask: url('')) or (-webkit-mask-image: url('')) {
    .rainbow-bg {
      display: block;
    }

    span {
      font-size: 0;
      position: absolute;
    }
  }
`);



class RemiscanLogo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }

  static get observedAttributes() {
    return ['text-color', 'text-gradient', 'background', 'animate'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'animate': break;
      default: {
        const link = this.shadow.querySelector('a');
        if (newValue) link.style.setProperty(`--${attr}`, newValue);
        else          link.style.removeProperty(`--${attr}`);
      }
    }
  }
}

if (!customElements.get('remiscan-logo')) customElements.define('remiscan-logo', RemiscanLogo);