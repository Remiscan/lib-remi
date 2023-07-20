if ('paintWorklet' in CSS) document.querySelector('.fallback').remove();

const optionsTemplate = /*html*/`
  <p>
    <button type="button" id="request-update">Change seed</button>
  </p>

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
      <label for="rainfall-fall-duration">Fall duration:</label>
      <input type="range" id="rainfall-fall-duration" min="100" max="5000" step="100" value="1500">
      <span class="rainfall-fall-duration-value">1500</span>ms
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
`;