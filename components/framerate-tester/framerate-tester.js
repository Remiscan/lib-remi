const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" part="button">Start</button>
  <span part="rate"></span>
  <span part="loading">...</span>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @keyframes rotate {
    0% { rotate: 0deg; }
    100% { rotate: 360deg; }
  }

  [part="loading"] {
    display: inline-block;
  }

  .anim {
    animation: rotate 2s linear infinite;
  }
`);



export class FramerateTester extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.stopped = true;
    this.handler = event => {
      if (this.stopped) this.start();
      else              this.stop();
    };
  }


  static async singleFrameDuration() {
    return new Promise(resolve =>
      requestAnimationFrame(t1 =>
        requestAnimationFrame(t2 => resolve(t2 - t1))
      )
    );
  }

  static async currentRate(precision = 1) {
    const singleDuration = await FramerateTester.singleFrameDuration();
    const frameRate = 1000 / singleDuration;
    return Math.round(frameRate * precision) / precision;
  }

  static async averageRate(duration = 1000, precision = 1) {
    const durations = [];
    const startTime = performance.now();
    while (performance.now() <= startTime + duration) {
      const singleDuration = await FramerateTester.singleFrameDuration();
      durations.push(singleDuration);
    }

    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const frameRate = 1000 / averageDuration;
    return Math.round(frameRate * precision) / precision;
  }

  async start() {
    this.stopped = false;
    this.shadowRoot.querySelector('button').innerHTML = 'Stop';

    const span = this.shadowRoot.querySelector('[part="rate"]');
    const loading = this.shadowRoot.querySelector('[part="loading"]');
    loading.style.removeProperty('display');
    loading.innerHTML = '😵‍💫';
    loading.classList.add('anim');

    while (!this.stopped) {
      const rate = await FramerateTester.averageRate(100);
      span.innerHTML = `${rate} FPS`;
    }
  }

  async stop() {
    this.stopped = true;
    this.shadowRoot.querySelector('button').innerHTML = 'Start';
    this.shadowRoot.querySelector('[part="loading"]').style.setProperty('display', 'none');
  }


  connectedCallback() {
    this.shadowRoot.querySelector('button').addEventListener('click', this.handler);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('button').removeEventListener('click', this.handler);
  }
}

if (!customElements.get('framerate-tester')) customElements.define('framerate-tester', FramerateTester);