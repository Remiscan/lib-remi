const template = document.createElement('template');
template.innerHTML = `
<button part="button">
  <span class="border" part="border" aria-hidden="true"></span>
  <span class="gradient-text" part="gradient-text" aria-hidden="true">
    <span class="text" part="text"></span>
  </span>
  <span class="hover-bg" part="hover-bg" aria-hidden="true"></span>
  <span class="hover-text text" part="hover-text text"></span>
  <span class="border-width-checker" aria-hidden="true"></span>
</button>
`;

export default template;