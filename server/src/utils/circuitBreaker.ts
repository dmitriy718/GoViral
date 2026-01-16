type State = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitOptions {
    failureThreshold: number;
    resetMs: number;
}

const circuits = new Map<string, { state: State; failures: number; openedAt: number }>();

export const withCircuit = async <T>(key: string, fn: () => Promise<T>, options: CircuitOptions): Promise<T> => {
    const now = Date.now();
    const current = circuits.get(key) || { state: 'CLOSED' as State, failures: 0, openedAt: 0 };

    if (current.state === 'OPEN') {
        if (now - current.openedAt < options.resetMs) {
            throw new Error(`Circuit ${key} is open`);
        }
        current.state = 'HALF_OPEN';
    }

    try {
        const result = await fn();
        current.failures = 0;
        current.state = 'CLOSED';
        circuits.set(key, current);
        return result;
    } catch (error) {
        current.failures += 1;
        if (current.failures >= options.failureThreshold) {
            current.state = 'OPEN';
            current.openedAt = now;
        }
        circuits.set(key, current);
        throw error;
    }
};
