const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10 ** 8;
const MODULO = 123456789;
const FIRST = 54;
const CYCLE = 33705;
const BIGCYCLE = 134820;

const $S = TimeLogger.wrap('Building S', () => {
    const s = [0, 1];
    const modulo = MODULO * CYCLE;
    if (modulo > Number.MAX_SAFE_INTEGER) {
        throw new Error('Modulo is too big');
    }
    let current = 1;

    for (let i = 2; i < FIRST + BIGCYCLE; i++) {
        current = ((current - 1).modPow(3, modulo) + 2) % modulo;
        s.push(current);
    }

    return s;
});

function s(n) {
    if (n >= FIRST) {
        n = ((n + BIGCYCLE - FIRST) % BIGCYCLE) + FIRST;
        return $S[n];
    }
    return $S[n];
}

function ss(n) {
    let m = s(n);
    if (m > FIRST) {
        m = ((m + BIGCYCLE - FIRST) % BIGCYCLE) + FIRST;
    }
    return s(m) % MODULO;
}

const $sums = [];
const $totients = TimeLogger.wrap('Computing Totients', () => {
    let phi = Array.from({ length: MAX + 1 }, (_, i) => i);
    for (let i = 2; i <= MAX; i++) {
        if (phi[i] === i) {
            // i is a prime
            for (let j = i; j <= MAX; j += i) {
                phi[j] = (phi[j] * (i - 1)) / i;
            }
        }
    }
    return phi;
});

function countPairsWithGCD(k, N) {
    let limit = Math.floor(N / k);
    if (limit === 0) {
        return 1;
    }
    let count = $sums[limit];
    if (count === undefined) {
        count = 0;
        for (let i = 1; i <= limit; i++) {
            count = (count + $totients[i]) % MODULO;
            $sums[i] = count;
        }
        $sums[limit] = count;
    }
    return count;
}

function T(N, trace) {
    let total = 0;

    const tracer = new Tracer(trace);

    for (let a = 1; a <= N; a++) {
        tracer.print(() => N - a);
        const count = 2 * countPairsWithGCD(a, N) - 1;

        total = (total + count.modMul(ss(a), MODULO)) % MODULO;
    }

    tracer.clear();

    return total;
}

assert.strictEqual(s(1), 1);
assert.strictEqual(s(2), 2);
assert.strictEqual(s(3), 3);
assert.strictEqual(s(4), 10);

assert.strictEqual(T(3), 12);
assert.strictEqual(T(4), 24881925);
assert.strictEqual(T(100), 14416749);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => T(MAX, true));
console.log(`Answer is ${answer}`);
