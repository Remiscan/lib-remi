type AsyncFunction = (...args: any[]) => Promise<any>;

/**
 * Makes an async function queueable, such that every call to that function will be executed successively,
 * each waiting for the previous call to be done before being executed.
 */
export function queueable(fn: AsyncFunction): AsyncFunction {
  const queue: Array< () => Promise<void> > = [];
  return (...args: any[]) => {
    return new Promise(async (resolve, reject) => {
      queue.push(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          if (queue.length > 0) queue.shift();
          if (queue.length > 0) await queue[0]();
        }
      });
  
      if (queue.length === 1) await queue[0]();
    });
  };
}