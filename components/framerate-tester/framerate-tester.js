const template = document.createElement('template');
template.innerHTML = `
<button type="button">Start</button>
<span class="rate"></span>
<span class="loading">...</span>
`;



export class FramerateTester extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));

    this.stopped = true;
    this.handler = () => {};
  }


  static async singleFrameDuration() {
    return new Promise(resolve =>
      requestAnimationFrame(t1 =>
        requestAnimationFrame(t2 => resolve(t2 - t1))
      )
    );
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
    this.shadow.querySelector('button').innerHTML = 'Stop';

    const span = this.shadow.querySelector('.rate');
    const loading = this.shadow.querySelector('.loading');
    loading.style.display = 'inline';
    loading.innerHTML = '...';

    let i = 0;
    while (!this.stopped) {
      const rate = await FramerateTester.averageRate();
      loading.innerHTML = `${i === 1 ? '·' : '.'}${i === 2 ? '·' : '.'}${i === 3 ? '·' : '.'}`;
      span.innerHTML = `${rate} FPS`;
      console.log('Rate updated');
      i = (i + 1) % 4;
    }
  }

  async stop() {
    this.stopped = true;
    this.shadow.querySelector('button').innerHTML = 'Start';
    this.shadow.querySelector('.loading').style.display = 'none';
  }


  connectedCallback() {
    this.shadow.querySelector('button').addEventListener('click', this.handler = event => {
      if (this.stopped) this.start();
      else              this.stop();
    });
  }
}

if (!customElements.get('framerate-tester')) customElements.define('framerate-tester', FramerateTester);