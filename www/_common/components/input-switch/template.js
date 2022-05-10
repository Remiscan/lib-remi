const template = document.createElement('template');
template.innerHTML = `
<button type="button" role="switch" aria-checked="false" part="button">
  <span class="input-switch-bg" aria-hidden="true">
    <span class="input-switch-hints" aria-hidden="true" part="hints">
      <span data-state="on" part="hint-on"></span>
      <svg class="input-switch-handle" viewBox="0 0 24 24" part="handle">
        <circle cx="12" cy="12" r="9.6" stroke-width="0"/>
        <circle class="focus-dot" cx="12" cy="12" r="2.4" stroke-width="0"/>
      </svg>
      <span data-state="off" part="hint-off"></span>
    </span>
  </span>
</button>
`;

export default template;