const assert = require('assert');

const {
    primeHelper,
    TimeLogger: timeLogger
} = require('@dn0rmand/project-euler-tools');

const MAX_N = 12345678;
const MAX_M = 12345;

primeHelper.initialize(MAX_N);

function E(f, n, m, sampleCount) {
    const S = (n * (n + 1)) / 2;

    let T = new Uint32Array(n);
    for (let i = 0; i < n; i++) {
        T[i] = i + 1;
    }

    let sum = sampleCount * S;

    for (let i = 0; i < sampleCount; i++) {
        const t = new Uint8Array(T);
        const X = new Uint8Array(m + 1);
        for (let j = 0; j < m; j++) {
            const q = Math.floor(Math.random() * (n - j));
            X[j + 1] = t[q];
            t[q] = t[n - j - 1];
        }
        X.sort((a, b) => a - b);

        for (let j = 1; j <= m; j++) {
            sum -= (X[j] - X[j - 1]) * f(X[j]);
        }
    }

    return (sum / sampleCount).toFixed(6);
}

assert.strictEqual(timeLogger.wrap('', _ => E(k => k, 100, 50, 1E6)), (2525 / 1326).toFixed(6));

console.log('Tests passed');