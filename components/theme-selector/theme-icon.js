const template = document.createElement('template');
template.innerHTML = /*html*/`
  <svg viewBox="0 0 120 120">
    <defs>
      <mask id="sun-mask">
        <rect x="0" y="0" width="120" height="120" fill="black"/>
        <circle class="sun-size" cx="60" cy="60" r="50" fill="white" transform-origin="60 60"/>
        <circle class="moon-hole" cx="90" cy="30" r="40" fill="black" transform-origin="120 0"/>
      </mask>
    </defs>

    <g class="sun-rays" transform-origin="50% 50%">
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 1">
        <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 3">
        <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(90 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 5">
        <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(180 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 7">
        <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(270 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 2; --m: 1;">
        <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(45 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 4; --m: 1;">
        <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(135 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 6; --m: 1;">
        <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(225 60 60)"/>
      </g>
      <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 8; --m: 1;">
        <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(315 60 60)"/>
      </g>
    </g>
    <rect class="sun" x="0" y="0" width="120" height="120" transform-origin="50% 50%" mask="url(#sun-mask)"/>
  </svg>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    fill: var(--primary-color, var(--default-color));
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  .ray > path {
    stroke: var(--secondary-color, var(--default-color));
  }

  .sun-size,
  .moon-hole {
    will-change: transform;
    transform-style: preserve-3d;
  }



  /*************/
  /* ANIMATION */
  /*************/


  /************************************/
  /* Thème clair - on affiche la lune */
  /************************************/

  :host([color-scheme="light"]) {
    --default-color: black;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : la lune devient soleil */
  :host([color-scheme="light"]) .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  :host([color-scheme="light"]) .sun {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  :host([color-scheme="light"]) .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : le soleil s'agrandit */
  :host([color-scheme="light"][icon="reverse"]) .sun {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  :host([color-scheme="light"][icon="reverse"]) .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: 0s;
  }

  /* - Étape 3 : le soleil devient lune */
  :host([color-scheme="light"][icon="reverse"]) .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }


  /***************************************/
  /* Thème sombre - on affiche le soleil */
  /***************************************/

  :host([color-scheme="dark"]) {
    --default-color: white;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : le soleil s'agrandit */
  :host([color-scheme="dark"]) .sun {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  :host([color-scheme="dark"]) .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: 0s;
  }

  /* - Étape 3 : le soleil devient lune */
  :host([color-scheme="dark"]) .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : la lune devient soleil */
  :host([color-scheme="dark"][icon="reverse"]) .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  :host([color-scheme="dark"][icon="reverse"]) .sun {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  :host([color-scheme="dark"][icon="reverse"]) .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }
`);



export class ThemeIcon extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }
}

if (!customElements.get('theme-icon')) customElements.define('theme-icon', ThemeIcon);