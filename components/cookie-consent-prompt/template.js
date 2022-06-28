const template = document.createElement('template');
template.innerHTML = `
<div class="cookie-consent-prompt-question-container">
  <span class="cookie-consent-prompt-question">Should this choice be remembered? (Uses a cookie)</span>
  <button type="button" class="cookie-consent-prompt-button-yes">Yes</button>
  <button type="button" class="cookie-consent-prompt-button-no">No</button>
</div>
<span class="cookie-consent-prompt-info">Cookie data: name = "{{name}}", value = "{{content}}".</span>
`;

export default template;