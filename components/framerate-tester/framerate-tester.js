const template = document.createElement('template');
template.innerHTML = `
<button type="button">Start</button>
<span class="rate">...</span>
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
    while (!this.stopped) {
      const rate = await FramerateTester.averageRate();
      span.innerHTML = `${rate} FPS`;
      console.log('Rate updated');
    }
  }

  async stop() {
    this.stopped = true;
    this.shadow.querySelector('button').innerHTML = 'Start';
  }


  connectedCallback() {
    this.shadow.querySelector('button').addEventListener('click', this.handler = event => {
      if (this.stopped) this.start();
      else              this.stop();
    });
  }


  // Automatically called for every set attribute before connectedCallback
  // (no need to check this.ready)
  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {

    }
  }
}

if (!customElements.get('framerate-tester')) customElements.define('framerate-tester', FramerateTester);