export const withRetries = async <T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> => {
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            return await fn();
        } catch (error) {
            attempt += 1;
            if (attempt > retries) {
                throw error;
            }
            const backoff = delayMs * Math.pow(2, attempt - 1);
            const jitter = Math.floor(Math.random() * 100);
            await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
        }
    }
};
