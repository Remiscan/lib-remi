if ('paintWorklet' in CSS) document.querySelector('.fallback').remove();

const mainSettingsTemplate = document.createElement('template');
mainSettingsTemplate.innerHTML = /*html*/`
  <p class="settings-always">
    <label for="effect-selection">Type:</label>
    <select id="effect-selection">
      <option value="diamonds">Diamonds</option>
      <option value="bigdots">Big dots</option>
      <option value="starfield">Star field</option>
      <option value="labyrinth">Labyrinth</option>
      <option value="rainfall">Rainfall (animated)</option>
    </select>

    <button type="button" id="request-update">Randomize</button>

    <button type="button" id="settings-toggle">Settings</button>
  </p>
`;

const settingsDialogTemplate = document.createElement('template');
settingsDialogTemplate.innerHTML = /*html*/ `
  <dialog class="settings">
    <div class="settings-content">
      <p>Grab the bottom right corner to resize the block. Only the visible part of the background is generated.</p>

      <fieldset data-type="common">
        <legend>Common settings</legend>

        <p>
          <label for="common-cell-size">Cell size:</label>
          <input type="range" id="common-cell-size" min="20" max="200" step="1" value="40">
          <span class="common-cell-size-value">40</span>px
        </p>

        <p>
          <label for="common-frequency">Frequency:</label>
          <input type="range" id="common-frequency" min="0" max="100" step="1" value="100">
          <span class="common-frequency-value">100</span>%
        </p>

        <p>
          <label for="common-base-hue">Hue:</label>
          <input type="range" id="common-base-hue" min="0" max="360" step="1" value="260">
          <span class="common-base-hue-value">260</span>°
        </p>

        <p>
          <label for="common-max-hue-spread">Max hue spread:</label>
          <input type="range" id="common-max-hue-spread" min="0" max="180" step="1" value="30">
          <span class="common-max-hue-spread-value">30</span>°
        </p>
      </fieldset>

      <fieldset data-type="diamonds">
        <legend>Diamonds settings</legend>

        <p>
          <label for="diamonds-max-offset">Max offset:</label>
          <input type="range" id="diamonds-max-offset" min="0" max="100" step="1" value="50">
          <span class="diamonds-max-offset-value">50</span>%
        </p>

        <p>
          <label for="diamonds-min-scale">Min scale:</label>
          <input type="range" id="diamonds-min-scale" min="1" max="100" step="1" value="10">
          <span class="diamonds-min-scale-value">10</span>%
        </p>

        <p>
          <label for="diamonds-max-scale">Max scale:</label>
          <input type="range" id="diamonds-max-scale" min="1" max="100" step="1" value="60">
          <span class="diamonds-max-scale-value">60</span>%
        </p>
      </fieldset>

      <fieldset data-type="bigdots">
        <legend>Big dots settings</legend>

        <p>
          <label for="bigdots-max-saturation-spread">Max saturation spread:</label>
          <input type="range" id="bigdots-max-saturation-spread" min="0" max="100" step="1" value="40">
          <span class="bigdots-max-saturation-spread-value">40</span>
        </p>

        <p>
          <label for="bigdots-max-lightness-spread">Max lightness spread:</label>
          <input type="range" id="bigdots-max-lightness-spread" min="0" max="100" step="1" value="15">
          <span class="bigdots-max-lightness-spread-value">15</span>
        </p>
      </fieldset>

      <fieldset data-type="starfield">
        <legend>Star field settings</legend>

        <p>
          <label for="starfield-max-offset">Max offset:</label>
          <input type="range" id="starfield-max-offset" min="0" max="100" step="1" value="50">
          <span class="starfield-max-offset-value">50</span>%
        </p>

        <p>
          <label for="starfield-min-scale">Min scale:</label>
          <input type="range" id="starfield-min-scale" min="1" max="100" step="1" value="2">
          <span class="starfield-min-scale-value">2</span>%
        </p>

        <p>
          <label for="starfield-max-scale">Max scale:</label>
          <input type="range" id="starfield-max-scale" min="1" max="100" step="1" value="8">
          <span class="starfield-max-scale-value">8</span>%
        </p>
      </fieldset>

      <fieldset data-type="rainfall">
        <legend>Rainfall settings</legend>

        <p>
          <label for="rainfall-fall-speed">Fall speed:</label>
          <input type="range" id="rainfall-fall-speed" min="100" max="2000" step="100" value="800">
          <span class="rainfall-fall-speed-value">800</span>px/s
        </p>

        <p>
          <label for="rainfall-wave-duration">Wave duration:</label>
          <input type="range" id="rainfall-wave-duration" min="100" max="1000" step="100" value="500">
          <span class="rainfall-wave-duration-value">500</span>ms
        </p>

        <p>
          <label for="rainfall-drop-height-ratio">Raindrop height ratio:</label>
          <input type="range" id="rainfall-drop-height-ratio" min="1" max="20" step="1" value="2">
          <span class="rainfall-drop-height-ratio-value">2</span>
        </p>

        <p>
          <label for="rainfall-min-depth-scale">Min depth scale:</label>
          <input type="range" id="rainfall-min-depth-scale" min="1" max="100" step="1" value="50">
          <span class="rainfall-min-depth-scale-value">50</span>%
        </p>

        <p>
          <label for="rainfall-min-depth-opacity">Min depth opacity:</label>
          <input type="range" id="rainfall-min-depth-opacity" min="1" max="100" step="1" value="50">
          <span class="rainfall-min-depth-opacity-value">50</span>%
        </p>
      </fieldset>

      <p>
        <a href="/_common/components/artsy-css/">Older &lt;div&gt;s version</a>
      </p>

      <p>
        <button type="button" id="close-settings">Close</button>
      </p>
    </div>
  </dialog>
`;



const element = document.querySelector('.element');
element.parentElement.insertBefore(mainSettingsTemplate.content.cloneNode(true), element);
element.parentElement.insertBefore(settingsDialogTemplate.content.cloneNode(true), element);

const blocks = document.querySelectorAll('artsy-block');

const startType = blocks[0].getAttribute('type');
document.body.dataset.type = startType;

// For performance reasons
const rainfallCellSizeCoeff = 2.2; // size of rainfall cells compared to other types of cells

// Listen to settings changes

// Type of effect
const select = document.getElementById('effect-selection');
select.value = startType; // take initial value from the element itself
select.addEventListener('input', () => {
  const previousType = document.body.dataset.type;
  const previousProps = [...document.querySelectorAll(`fieldset[data-type="${previousType}"] input`)]
    .map(input => input.id.replace(`${previousType}-`, ''));

  for (const block of blocks) {
    // Store previous type settings
    let previousPropsString = '';
    for (const prop of previousProps) {
      const previousPropValue = block.style.getPropertyValue(`--${prop}`);
      if (previousPropValue) previousPropsString += `--${prop}:${previousPropValue};`;
      block.style.removeProperty(`--${prop}`);
    }
    block.dataset[previousType] = previousPropsString;

    // Adjust cell-size if needed
    let previousCellSize = block.style.getPropertyValue('--cell-size');
    if (previousCellSize) {
      if (previousType === 'rainfall') previousCellSize = previousCellSize / rainfallCellSizeCoeff;
      else if (select.value === 'rainfall') previousCellSize = previousCellSize * rainfallCellSizeCoeff;
    }
    block.style.setProperty('--cell-size', previousCellSize ?? '');

    // Switch to new type
    block.setAttribute('type', select.value);

    // Restore new type settings if they're stored
    const storedStyles = block.dataset[select.value]?.split(';') ?? [];
    for (const storedProp of storedStyles) {
      const [prop, value] = storedProp.split(':');
      if (prop) block.style.setProperty(prop, value ?? '');
    }
  }

  document.body.dataset.type = select.value;

  // Update code view
  const code = document.querySelector('code');
  code.innerHTML = window.Prism?.highlight(`<artsy-block type="${select.value}"></artsy-block>`, Prism.languages.html, 'html') ?? '';
});

// Seed update request button
const seedUpdateButton = document.querySelector('#request-update');
seedUpdateButton.addEventListener('click', event => {
  for (const block of blocks) {
    block.dispatchEvent(new Event('updaterequest'));
  }
});

// Settings toggle button
const dialog = document.querySelector('dialog');
const settingsToggleButton = document.querySelector('#settings-toggle');
const settingsCloseButton = document.querySelector('#close-settings');
settingsToggleButton.addEventListener('click', event => {
  if (!dialog.getAttribute('open')) dialog.showModal();
  else dialog.close();
});
dialog.addEventListener('click', event => {
  if (!(event.composedPath().includes(dialog.querySelector('.settings-content')))) {
    dialog.close();
  }
});
settingsCloseButton.addEventListener('click', event => {
  dialog.close();
});

// All common and specific settings
const inputs = document.querySelectorAll('.settings input');
for (const input of inputs) {
  input.addEventListener('input', () => {
    const type = input.closest('fieldset').dataset.type;
    const prop = input.id.replace(`${type}-`, '');
    const value = input.value;
    for (const block of blocks) {
      if (prop === 'cell-size' && document.body.dataset.type === 'rainfall') {
        block.style.setProperty(`--${prop}`, rainfallCellSizeCoeff * value);
      } else {
        block.style.setProperty(`--${prop}`, value);
      }
    }
    document.querySelector(`.${input.id}-value`).innerHTML = value;
  });
}

// Update body hue with --base-hue
document.querySelector('input#common-base-hue').addEventListener('input', event => {
  document.body.style.setProperty('--hue', event.currentTarget.value);
});