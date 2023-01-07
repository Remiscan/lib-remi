/**
 * Makes an async function queueable, such that every call to that function will be executed successively,
 * each waiting for the previous call to be done before being executed.
 */
export function queueable(fn) {
    const queue = [];
    return (...args) => {
        queue.push(async () => {
            await fn(...args);
            if (queue.length > 0)
                queue.shift();
            if (queue.length > 0)
                queue[0]();
        });
        if (queue.length === 1)
            queue[0]();
    };
}
