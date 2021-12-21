const template = document.createElement('template');
template.innerHTML = `
<button type="button" role="switch" aria-checked="false">
  <span class="input-switch-hints" aria-hidden="true">
    <span data-state="on"></span>
    <svg class="input-switch-handle" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.6" stroke-width="0"/>
    </svg>
    <span data-state="off"></span>
  </span>
</button>
`;

export default template;