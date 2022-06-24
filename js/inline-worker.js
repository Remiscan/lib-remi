export default class InlineWorker {
  constructor(asyncFunc) {
    const workerScript = `f=${asyncFunc}; onmessage=${async e => {
      let result;
      try {
        result = await f.apply(f, JSON.parse(e.data));
        postMessage(JSON.stringify(result));
      } catch (error) {
        console.error(error);
      }
    }};`;
    const workerUrl = URL.createObjectURL(new Blob([workerScript]));
    this.worker = new Worker(workerUrl);
  }

  async run(...args) {
    let handler;
    return await new Promise((resolve, reject) => {
      this.worker.addEventListener('message', handler = event => {
        try {
          const result = JSON.parse(event.data);
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {
          this.worker.removeEventListener('message', handler);
        }
      });

      this.worker.postMessage(JSON.stringify(args));
    });
  }
}