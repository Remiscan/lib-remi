/* HOW TO USE :

  import InlineWorker from 'inline-worker';

  async function f(...args) {
    // do stuff here
    return result;
  }

  const inlineWorker = new InlineWorker(f);

  // For example, run the function in the worker on a button click
  const button = document.querySelector('button');
  button.addEventListener('click', async event => {
    const result = await inlineWorker.run(...args);
    console.log(result);
  });

*/

export default class InlineWorker {
  /**
   * Makes a Worker by calling new InlineWorker().
   * @param {function} asyncFunc - An async function that will be ran in the worker.
   */
  constructor(asyncFunc, options) {
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

  /**
   * Messages the worker and gets a value back from it.
   * @param  {...any} args - The arguments passed to the function ran in the worker.
   * @returns The value returned by the function ran in the worker.
   */
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

      this.worker.addEventListener('messageerror', event => {
        reject(event.data);
      });

      this.worker.postMessage(JSON.stringify(args));
    });
  }
}