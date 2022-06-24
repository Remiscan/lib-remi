const template = document.createElement('template');
template.innerHTML = `
<button part="button">
  <span class="text" part="text"></span>
</button>
<div class="dots-container" part="dots-container">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>
`;

export default template;