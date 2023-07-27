// For use with es-module-shims.js in Shim mode
// i.e. with window.esmsInitOptions.shimMode = true

export default class ModuleWorkerShim extends Worker {
  /**
   * Takes an ES module and turns it into a worker that supports import maps.
   * @param {string} url - The full URL of the ES module to execute in the worker.
   */
  constructor(url) {
    const workerScript = `
      importScripts('${import.meta.resolve('es-module-shims-wasm')}');
      importShim.addImportMap(${JSON.stringify(importShim.getImportMap())});
      importShim('${url}').catch(e => setTimeout(() => { throw e; }));
    `;
    const workerUrl = URL.createObjectURL(new Blob([workerScript], { type: 'application/javascript' }));
    super(workerUrl);
  }
}