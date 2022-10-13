// For use with es-module-shims.js in Shim mode
// i.e. with window.esmsInitOptions.shimMode = true

export default class ModuleWorkerShim {
  /**
   * Takes an ES module and turns it into a worker that supports import maps.
   * @param {string} url - The full URL of the ES module to execute in the worker.
   */
  constructor(url) {
    return new Worker(
      URL.createObjectURL(
        new Blob(
          [`
            importScripts('${import.meta.resolve('es-module-shims-wasm')}');
            importShim.addImportMap(${JSON.stringify(importShim.getImportMap())});
            importShim('${url}').catch(e => setTimeout(() => { throw e; }))
          `], {
            type: 'application/javascript'
          }
        )
      )
    );
  }
}