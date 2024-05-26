type AsyncFunction = (...args: any[]) => Promise<any>;

/**
 * Makes an async function queueable, such that every call to that function will be executed successively,
 * each waiting for the previous call to be done before being executed.
 * @params fn - The async function being made queuable.
 * @params delay - The delay between calls of the queueable function, in milliseconds.
 */
export function queueable(fn: AsyncFunction, delay = 0): AsyncFunction {
  const queue: Array< () => Promise<void> > = [];
  let timeout = Promise.resolve();

  return (...args: any[]) => {
    return new Promise(async (resolve, reject) => {
      queue.push(async () => {
        try {
          await timeout;
          const result = await fn(...args);
          timeout = delay <= 0 ? Promise.resolve() : new Promise(resolve => setTimeout(resolve, delay));
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          if (queue.length > 0) queue.shift();
          if (queue.length > 0) {
            await queue[0]();
          }
        }
      });
  
      if (queue.length === 1) {
        await queue[0]();
      }
    });
  };
}