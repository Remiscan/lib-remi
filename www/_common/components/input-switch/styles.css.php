:host {
  aspect-ratio: 1 / 2;
  --width: 4rem;
  width: var(--width);
  height: calc(.5 * var(--width));

  display: inline-block;
  position: relative;
  contain: content;

  --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing: var(--easing-standard);
  --duration: .2s;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

/*<?php ob_start();?>*/
:root[data-theme="light"] :host {
  --off-bg-color: hsl(231, 0%, 50%);
  --on-bg-color: hsl(231, 40%, 50%);
  --handle-color: white;
  --off-text-color: var(--handle-color);
  --on-text-color: var(--handle-color);
}

:root[data-theme="dark"] :host {
  --off-bg-color: hsl(217, 0%, 55%);
  --on-bg-color: hsl(217, 89%, 75%);
  --handle-color: rgb(48, 48, 48);
  --off-text-color: var(--handle-color);
  --on-text-color: var(--handle-color);
}
/*<?php $body = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
echo buildThemesStylesheet($body); ?>*/

[role="switch"] {
  border: none;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  font: inherit;
  color: inherit;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  width: 100%;
  height: 100%;
  border-radius: calc(.5 * var(--width));
  background-color: var(--off-bg-color);
  overflow: hidden;

  --trans-ratio: 0;
}

[role="switch"]::before {
	content: '';
	display: block;
	grid-row: 1 / -1;
  grid-column: 1 / -1;
  width: 100%;
  height: 100%;
	background-color: var(--on-bg-color);
	opacity: calc(1 - var(--trans-ratio));
  transition: opacity var(--duration) var(--easing);
  will-change: opacity;
  z-index: 1;
}

.input-switch-hints {
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  width: 150%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100%;
  place-items: center;
  transition: transform var(--duration) var(--easing);
  z-index: 2;
  transform: translateX(calc(-100% * var(--trans-ratio) / 3));
  will-change: transform;
}

.input-switch-hints>span[data-state] {
  display: grid;
  --side-margin: calc(.1 * var(--width) / 3);
  font-family: var(--font-family);
  font-size: calc(var(--width) / 4);
  font-weight: var(--font-weight, 700);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.input-switch-hints>span[data-state]>svg {
  width: 100%;
  height: 100%;
}

.input-switch-hints>span[data-state="on"] {
  place-items: start;
}
.input-switch-hints>span[data-state="off"] {
  place-items: end;
}

.input-switch-hints>span[data-state="on"]>* {
  padding-left: var(--side-margin);
}
.input-switch-hints>span[data-state="off"]>* {
  padding-right: var(--side-margin);
}

.input-switch-hints svg.default-icon {
  stroke-width: var(--stroke-width, 3);
}

.input-switch-hints>[data-state="on"] {
  grid-row: 1;
  grid-column: 1;
  color: var(--on-text-color);
  stroke: var(--on-text-color);
}

.input-switch-hints>[data-state="off"] {
  grid-row: 1;
  grid-column: 3;
  color: var(--off-text-color);
  stroke: var(--off-text-color);
}

.input-switch-handle {
	grid-row: 1;
  grid-column: 2;
  width: 100%;
  height: 100%;
  z-index: 3;
  fill: var(--handle-color);
}

[role="switch"][aria-checked="false"] {
  --trans-ratio: 1;
}
[role="switch"][aria-checked="true"] {
  --trans-ratio: 0;
}

@media (prefers-reduced-motion: reduce) {
  :host {
    --duration: 0;
  }
}