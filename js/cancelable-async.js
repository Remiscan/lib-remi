const warning = 'Function canceled ; a more recent iteration started';

export function cancelableAsync(generator) {
  let check;
  return async function(...args) {
    const localCheck = check = new Object();
    const iterator = generator(...args);
    let lastValue;
    for(;;) {
      const next = iterator.next(lastValue);
      if (next.done) return next.value;
      lastValue = await next.value;
      if (localCheck !== check) return warning;
    }
  }
}