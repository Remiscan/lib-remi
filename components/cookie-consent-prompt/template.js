const template = document.createElement('template');
template.innerHTML = `
<div class="cookie-consent-prompt-question-container">
  <span class="cookie-consent-prompt-question" data-string="consent-question"></span>
  <button type="button" class="cookie-consent-prompt-button-yes" data-string="consent-yes"></button>
  <button type="button" class="cookie-consent-prompt-button-no" data-string="consent-no"></button>
</div>
<span class="cookie-consent-prompt-info" data-string="cookie-data"></span>
`;

export default template;