cookie-consent-mini {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  opacity: 0;
  pointer-events: none;
}

cookie-consent-mini[open="true"] {
  opacity: 1;
  pointer-events: auto;
}

cookie-consent-mini>.cookie-consent-mini-question-container {
  grid-row: 1;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: auto auto auto 1fr;
}

cookie-consent-mini>.cookie-consent-mini-info {
  grid-row: 2;
  grid-column: 1 / -1;
}