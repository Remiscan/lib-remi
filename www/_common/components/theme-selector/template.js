const template = document.createElement('template');
template.innerHTML = `
  <button type="button" data-label="theme-button">
    <svg viewBox="0 0 120 120">
      <defs>
        <mask id="sun-mask">
          <rect x="0" y="0" width="120" height="120" fill="black"/>
          <circle class="sun-size" cx="60" cy="60" r="50" fill="white" transform-origin="60 60"/>
          <circle class="moon-hole" cx="90" cy="30" r="40" fill="black" transform-origin="120 0"/>
        </mask>
      </defs>

      <g class="sun-rays" transform-origin="50% 50%">
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 1">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 3">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(90 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 5">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(180 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 7">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(270 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 2; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(45 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 4; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(135 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 6; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(225 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 8; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(315 60 60)"/>
        </g>
      </g>
      <rect class="sun" x="0" y="0" width="120" height="120" transform-origin="50% 50%" mask="url(#sun-mask)"/>
    </svg>
  </button>

  <div class="selector">
    <span class="selector-title" data-string="selector-title"></span>

    <input type="radio" name="theme" id="theme-auto" value="auto" checked>
    <label for="theme-auto">
      <span class="theme-name" data-string="theme-auto"></span>
    </label>

    <input type="radio" name="theme" id="theme-light" value="light">
    <label for="theme-light">
      <span class="theme-name" data-string="theme-light"></span>
      <span class="theme-cookie-star">*</span>
    </label>

    <input type="radio" name="theme" id="theme-dark" value="dark">
    <label for="theme-dark">
      <span class="theme-name" data-string="theme-dark"></span>
      <span class="theme-cookie-star">*</span>
    </label>

    <span class="selector-cookie-notice" data-string="cookie-notice"></span>
  </div>
`;

export default template;