/**
 * Makes an async function queueable, such that every call to that function will be executed successively,
 * each waiting for the previous call to be done before being executed.
 */
export function queueable(fn) {
    const queue = [];
    return (...args) => {
        return new Promise(async (resolve) => {
            queue.push(async () => {
                const result = await fn(...args);
                resolve(result);
                if (queue.length > 0)
                    queue.shift();
                if (queue.length > 0)
                    await queue[0]();
            });
            if (queue.length === 1)
                await queue[0]();
        });
    };
}