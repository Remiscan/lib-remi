<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1">

  <link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Raleway:wght@400;600&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:wght@400;600&display=swap" media="print" onload="this.media='all'">
</head>

<style>
  :root {
    --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
    --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
    --easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  }
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  html, body {
    height: 100%;
    margin: 0;
    font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif;
  }
  body {
    background-color: hsl(300, 20%, 10%);
    background-size: 64px 64px;
    background-position: 0 0, 32px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: min(1rem, 1.5vw);
  }
  p {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }



  .rainbow-text,
  strong {
    font-weight: 600;
    color: hsl(300, 25%, 85%);
  }

  @supports (background-clip: text) or (-webkit-background-clip: text) {
    .rainbow-text,
    strong {
      --band-number: 6;
      --gradient: repeating-linear-gradient(to right,
        hsl(0, 100%, 90%) 0,
        hsl(39, 100%, 90%) calc(1 * 100% / var(--band-number)),
        hsl(60, 100%, 90%) calc(2 * 100% / var(--band-number)),
        hsl(120, 100%, 90%) calc(3 * 100% / var(--band-number)),
        hsl(240, 100%, 90%) calc(4 * 100% / var(--band-number)),
        hsl(300, 100%, 90%) calc(5 * 100% / var(--band-number)),
        hsl(0, 100%, 90%) calc(6 * 100% / var(--band-number))
      );

      background-image: var(--gradient);
      background-size: calc(var(--band-number) * 50%) 100%;
      background-position: 0 0;
      background-repeat: repeat;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: rainbow-text-animation 40s linear infinite;
    }
  }

  @keyframes rainbow-text-animation {
    0% { background-position: 0 0; }
    100% { background-position: calc(100% * var(--band-number)) 0; }
  }

  

  .nav-link {
    --color: red;
    --background-color: hsl(300, 100%, 100%);
    --inactive-background-color:  hsl(300, 25%, 70%, .5);
    --underline-width: max(3px, .2em);
    --animation-duration: .2s;
    --animation-easing: var(--easing-standard);
    --padding-top: max(calc(1.5 * var(--underline-width)), .3em);
    --padding-left: max(calc(2 * var(--underline-width)), .4em);
    --border-radius: max(calc(.5 * var(--underline-width)), .1em);

    font-weight: 600;
    text-decoration: none;
    color: white;
    position: relative;
    overflow-y: hidden;
    overflow-x: visible;
    padding: var(--padding-top) var(--padding-left);
    border-radius: var(--border-radius);
  }

  @supports (background-clip: text) or (-webkit-background-clip: text) {
    .nav-link {
      color: transparent;
      background: linear-gradient(to bottom,
        var(--background-color) 0 calc(50% - var(--underline-width)),
        var(--color) calc(50% - var(--underline-width)) 100%
      );
      background-size: 100% 200%;
      background-position: 0 0;
      -webkit-background-clip: text;
      background-clip: text;
      transition: background-position var(--animation-duration) var(--animation-easing);
    }
  }

  .nav-link::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--inactive-background-color);
    z-index: 0;
    pointer-events: none;
    transform: translateY(calc(100% - var(--underline-width)));
    transition: transform var(--animation-duration) var(--animation-easing),
                background-color calc(0.5 * var(--animation-duration)) var(--easing-decelerate) calc(0.5 * var(--animation-duration));
    z-index: -1;
    border-radius: var(--border-radius);
  }

  .nav-link:hover,
  .nav-link:focus,
  .nav-link.selected {
    background-position: 0 100%;
  }

  .nav-link:hover::before,
  .nav-link:focus::before,
  .nav-link.selected::before {
    background-color: var(--background-color);
    transform: translateY(0);
    opacity: 1;
    transition: transform var(--animation-duration) var(--animation-easing);
  }

  .nav-link.invert-colors,
  .nav-link.no-color {
    background: none;
    transition: none;
    color: white;
    font-weight: 400;
  }

  .nav-link.invert-colors:hover::before,
  .nav-link.invert-colors:focus::before {
    background-color: var(--color);
  }

  .nav-link.no-color:hover::before,
  .nav-link.no-color:focus::before {
    background-color: var(--inactive-background-color);
  }

  @supports (mask: var(--mask)) or (-webkit-mask: var(--mask)) {
    .nav-link.no-color {
      --gap: .25ch;
      --arrow-width: 1.5ch;
      --arrow-color: white;

      display: inline-grid;
      grid-template-columns: auto var(--arrow-width);
      gap: var(--gap);
      position: relative;
    }

    .nav-link.no-color::after {
      --top: 5%;
      --mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M 9 3 L 15 12 L 9 21' stroke='white' stroke-linecap='round' stroke-width='4' fill='transparent'/%3E%3C/svg%3E");

      content: '';
      display: block;
      width: 100%;
      height: calc(100% - 2 * var(--padding-top) - 2 * var(--top));
      grid-column: -2;
      background: var(--arrow-color);
      mask: var(--mask);
      mask-size: auto 100%;
      mask-position: center;
      -webkit-mask: var(--mask);
      -webkit-mask-size: auto 100%;
      -webkit-mask-position: center;
      position: absolute;
      top: calc(var(--padding-top) + var(--top));
      right: 0;
      transition: transform .2s var(--easing-standard);
    }

    .nav-link.no-color:hover::after,
    .nav-link.no-color:focus::after {
      --band-number: 6;
      --gradient: repeating-linear-gradient(to right,
        hsl(0, 100%, 80%) 0,
        hsl(39, 100%, 80%) calc(1 * 100% / var(--band-number)),
        hsl(60, 100%, 80%) calc(2 * 100% / var(--band-number)),
        hsl(120, 100%, 80%) calc(3 * 100% / var(--band-number)),
        hsl(240, 100%, 80%) calc(4 * 100% / var(--band-number)),
        hsl(300, 100%, 80%) calc(5 * 100% / var(--band-number)),
        hsl(0, 100%, 80%) calc(6 * 100% / var(--band-number))
      );
      --step: 2px;

      background-image: var(--gradient);
      background-size: calc(var(--band-number) * 200%) 100%;
      background-position: 0 0;
      background-repeat: repeat;
      animation: rainbow-text-animation 80s linear infinite,
                 back-and-forth 2s linear infinite;
    }
  }

  @keyframes back-and-forth {
    0% { transform: translateX(0); }
    25% { transform: translateX(calc(-1 * var(--step))); }
    50% { transform: translateX(0); }
    75% { transform: translateX(calc(-1 * var(--step))); }
    100% { transform: translateX(0); }
  }

  .nav-link.invert-colors {
    display: inline-grid;
    grid-template-columns: 2ch auto;
    gap: .75ch;
  }

  .no-underline {
    --underline-width: -1px;
  }



  a:not(.nav-link) {
    --background-color:  hsl(300, 25%, 70%, .5);
    --color:  hsl(300, 50%, 80%);
    --underline-width: max(4px, .2em);
    --animation-duration: .2s;
    --animation-easing: var(--easing-standard);

    color: var(--color);
    text-decoration: none;
    box-shadow: 0 calc(.5 * var(--underline-width)) 0 0 var(--background-color);
    padding: 0 .1em;
    transition: box-shadow var(--animation-duration) var(--animation-easing),
                background-position var(--animation-duration) var(--animation-easing);

    background-image: linear-gradient(to bottom, transparent 0 50%, hsl(300, 25%, 70%, .25) 50% 100%);
    background-size: 100% 200%;
    background-position: 0 0;
  }

  a:not(.nav-link):hover,
  a:not(.nav-link):focus {
    --color: hsl(300, 75%, 90%);
    --background-color:  hsl(300, 25%, 70%, .25);

    /*box-shadow: none;*/
    background-position: 0 100%;
    border-radius: calc(.5 * var(--underline-width));
  }
</style>

<?php include __DIR__.'/../../../mon-portfolio/images/social.svg' ?>

<p style="display: block; margin: 0 auto; font-size: 3.5em; /*font-family: Raleway;*/ font-weight: 400; color: hsl(300, 25%, 70%); max-width: 25ch; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;">

<span>Je suis <strong>Rémi</strong>,</span><br>
<span><strong>développeur web</strong> autodidacte et amateur de minimalisme.</span>

<p style="gap: 1em; font-size: 2em;">

<a class="nav-link" href="#" style="--color: hsl(250, 100%, 40%);">Moi</a>
<a class="nav-link no-underline" href="#" style="--color: hsl(170, 100%, 25%);">Projets</a>
<a class="nav-link" href="#" style="--color: hsl(25, 100%, 35%);">Articles</a>
<a class="nav-link" href="#" style="--color: hsl(0, 0%, 35%);">Contact</a>

<p style="gap: 1em; font-size: 1.5em;">

<a class="nav-link no-color" href="#">En apprendre + sur moi</a>

<p style="gap: 1em; font-size: 1em;">

<a class="nav-link with-icon invert-colors" href="#" style="--color: #6e5494;">
  <svg viewBox="0 0 16 16"><use href="#github" /></svg>
  GitHub
</a>
<a class="nav-link with-icon invert-colors" href="#" style="--color: hsl(275, 70%, 40%);">
  <svg viewBox="20 20 80 80"><use href="#codepen" /></svg>
  CodePen
</a>
<a class="nav-link with-icon invert-colors" href="#" style="--color: #0077B5;">
  <svg viewBox="-1 -1 30 30"><use href="#linkedin" /></svg>
  LinkedIn
</a>
<a class="nav-link with-icon invert-colors" href="#" style="--color: hsl(205, 99%, 55%);">
  <svg viewBox="60 60 280 280"><use href="#twitter" /></svg>
  Twitter
</a>

<p style="gap: 1em; font-size: 1em; line-height: 1.6em; max-width: 95%; display: block; color: hsl(300, 30%, 90%);;">

Test de texte avec un <a class="with-icon" href="#">lien normal très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long</a> en plein milieu.

<p>

<svg viewBox="0 0 24 24" style="width: 48px; height: 48px;">
  <g id="link-arrow">
    <path d="M 9 3 L 15 12 L 9 21" stroke="white" stroke-linecap="round" stroke-width="4" fill="transparent"/>
  </g>
</svg>

<svg viewBox="6 3 18 21" style="width: 48px; height: 48px;">
  <g>
    <path d="M 9 6 L 15 12 L 9 18" stroke="white" stroke-linecap="round" stroke-width="4" fill="transparent"/>
  </g>
</svg>

<svg viewBox="0 0 10 10" style="width: 48px; height: 48px; overflow: hidden;">
  <g>
    <circle cx="5" cy="5" r="5" stroke="transparent" fill="white"/>
    <circle cx="5" cy="5" r="4" stroke="transparent" fill="red"/>
    <circle cx="5" cy="5" r="3" stroke="transparent" fill="white"/>
  </g>
</svg>

<script>
  function prepareRainbowText(conteneur, step = 0) {
    const random = Math.round(40 * Math.random());
    let i = 0;
    for (const text of Array.from(conteneur.querySelectorAll('strong'))) {
      text.style.animationDelay = `-${random + i * step}s`;
      i++;
    }
  }
  
  prepareRainbowText(document);
</script>