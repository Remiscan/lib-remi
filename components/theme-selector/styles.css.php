theme-selector > button {
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  line-height: inherit;
  text-transform: none;
  -webkit-appearance: button;
  cursor: pointer;
  color-scheme: light dark;

  display: grid;
  width: 100%;
  height: 100%;
}

@layer theme-selector {

  theme-selector {
    display: grid;
    place-items: center;
    position: relative;
  }

  theme-selector svg {
    width: 100%;
    height: 100%;
    fill: var(--primary-color, var(--default-color));
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  theme-selector .ray > path {
    stroke: var(--secondary-color, var(--default-color));
  }

  theme-selector .sun-size,
  theme-selector .moon-hole {
    will-change: transform;
    transform-style: preserve-3d;
  }

  theme-selector .unusable {
    pointer-events: none !important;
  }



  /*************/
  /* ANIMATION */
  /*************/


  /*<?php ob_start();?>*/
  /************************************/
  /* Thème clair - on affiche la lune */
  /************************************/

  theme-selector {
    --default-color: black;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : la lune devient soleil */
  theme-selector .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  theme-selector .sun-size {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  theme-selector .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : le soleil s'agrandit */
  theme-selector[icon="reverse"] .sun-size {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  theme-selector[icon="reverse"] .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: calc(var(--n) * 30ms);
  }

  /* - Étape 3 : le soleil devient lune */
  theme-selector[icon="reverse"] .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }
  /*<?php $light = ob_get_clean();?>*/


  /*<?php ob_start();?>*/
  /***************************************/
  /* Thème sombre - on affiche le soleil */
  /***************************************/

  theme-selector {
    --default-color: white;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : le soleil s'agrandit */
  theme-selector .sun-size {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  theme-selector .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: calc(var(--n) * 30ms);
  }

  /* - Étape 3 : le soleil devient lune */
  theme-selector .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : la lune devient soleil */
  theme-selector[icon="reverse"] .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  theme-selector[icon="reverse"] .sun-size {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  theme-selector[icon="reverse"] .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }
  /*<?php $dark = ob_get_clean();?>*/


  /******************************************/
  /* DISTRIBUTION DES STYLES SELON LE THÈME */
  /* 🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽 */

  /********************/
  /* Thème par défaut */
  /*<?=$light?>*/

  /****************************************/
  /* @media (prefers-color-scheme: light) */
  @media (prefers-color-scheme: light) {
    /*<?=$light?>*/
  }

  /****************************************/
  /* @media (prefers-color-scheme: dark) */
  @media (prefers-color-scheme: dark) {
    /*<?=$dark?>*/
  }

  /*****************************/
  /* :root[data-theme="light"] */
  /*<?=str_replace('theme-selector', ':root[data-theme="light"] theme-selector', $light)?>*/

  /*****************************/
  /* :root[data-theme="dark"] */
  /*<?=str_replace('theme-selector', ':root[data-theme="dark"] theme-selector', $dark)?>*/

  /* 🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼🔼 */
  /******************************************/



  /**********/
  /* POP-UP */
  /**********/

  theme-selector > .selector {
    display: grid;
    grid-template-columns: auto 1fr auto;
    position: absolute;
    top: 100%;
    grid-row: 1;
    grid-column: 1;
    opacity: 0;
    pointer-events: none;
  }

  theme-selector[open="true"] > .selector {
    opacity: 1;
    pointer-events: auto;
  }

  theme-selector .selector-title,
  theme-selector .selector-cookie-notice {
    grid-column: 1 / -1;
  }

  theme-selector > .selector > input {
    grid-column: 1;
  }

  theme-selector > .selector > label {
    grid-column: 2;
  }

  theme-selector > .selector > label > span {
    grid-column: 2;
  }

  theme-selector[position="bottom"] > .selector {
    top: 100%;
  }
  theme-selector[position="top"] > .selector {
    top: unset;
    bottom: 100%;
  }
  theme-selector[position="left"] > .selector {
    top: unset;
    right: 100%;
  }
  theme-selector[position="right"] > .selector {
    top: unset;
    left: 100%;
  }

  theme-selector:not([cookie]) .theme-cookie-star,
  theme-selector:not([cookie]) .selector-cookie-notice {
    display: none;
  }


}