/*<?php ob_start();?>*/
:root[data-theme="light"] tab-label {
  --on-bg-color: hsl(231, 40%, 50%);
  --hover-bg-color: hsl(231, 40%, 50%, .3);
  --active-bg-color: hsl(231, 40%, 50%, .6);
  --off-text-color: black;
  --on-text-color: white;
}

:root[data-theme="dark"] tab-label {
  --on-bg-color: hsl(217, 89%, 75%);
  --hover-bg-color: hsl(217, 89%, 75%, .3);
  --active-bg-color: hsl(217, 89%, 75%, .6);
  --off-text-color: white;
  --on-text-color: rgb(48, 48, 48);
}
/*<?php $body = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
echo buildThemesStylesheet($body); ?>*/

[role="tablist"] {
  display: flex;
  margin: 0;
  padding: 0;
  border: none;
  gap: .6rem;
}

[role="tablist"]>legend {
  font-size: 0;
  padding: 0;
}

input[type=radio][role="tab"] {
  height: 0;
  width: 0;
  position: absolute;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

input[type=radio][role="tab"] + label {
  padding: .3rem .6rem;
  border: 1px solid var(--on-bg-color);
  color: var(--off-text-color);
}

input[type=radio][role="tab"] + label:hover {
  background: var(--hover-bg-color)
}

input[type=radio][role="tab"] + label:active {
  background: var(--active-bg-color)
}

input[type=radio][role="tab"]:focus + label {
  outline: 2px solid var(--off-text-color);
}

input[type=radio][role="tab"]:focus:not(:focus-visible) + label {
  outline: none;
}

input[type=radio][role="tab"]:checked + label {
  background: var(--on-bg-color);
  color: var(--on-text-color);
}

[hidden] {
  display: none !important;
}