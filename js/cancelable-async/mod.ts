/**
 * To make an async function f cancelable when another instance is executed:
 * - make that function a generator, yield instead of await: function* f {}
 * - f = cancelableAsync(f)
 * - now, f will stop when it reaches a yield and a newer instance of f has already been called
 */

export class CanceledAsyncWarning extends Error {
  constructor(...args: any[]) {
    super('Function canceled ; a more recent iteration started', ...args);
    this.name = 'CanceledAsyncWarning';
  }
}

export function cancelableAsync(generator: GeneratorFunction) {
  let check;
  return async function(...args: any[]) {
    const localCheck = check = new Object();
    const iterator = generator(...args);
    let lastValue;
    for(;;) {
      const next: any = iterator.next(lastValue);
      if (next.done) return next.value;
      lastValue = await next.value;
      if (localCheck !== check) throw new CanceledAsyncWarning();
    }
  }
}