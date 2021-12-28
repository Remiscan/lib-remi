const template = document.createElement('template');
template.innerHTML = `
<button>
  <span class="border"></span>
  <span class="gradient-text">
    <span class="text"></span>
  </span>
  <span class="hover-text" aria-hidden="true">
    <span class="text"></span>
  </span>
</button>
`;

export default template;