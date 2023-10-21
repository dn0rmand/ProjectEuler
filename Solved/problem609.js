const assert = require('assert');
const {
    TimeLogger,
    Tracer,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const MAX = 1E8;
const MODULO = 1000000007;

const primeCounts = TimeLogger.wrap('', _ => {
    primeHelper.initialize(MAX);

    const allPrimes = primeHelper.allPrimes();

    const counts = new Uint32Array(MAX + 1);

    let previous = 0;
    let count = 0;

    for (const p of allPrimes) {
        for (let i = previous; i < p; i++) {
            counts[i] = count;
        }
        counts[p] = ++count;
        previous = p + 1;
    }

    for (let i = previous; i <= MAX; i++) {
        counts[i] = count;
    }

    return counts;
});

function P(n, trace) {
    const C = new Uint32Array(20); // 20 is enough

    function c(u) {
        let k = primeHelper.isKnownPrime(u) ? 0 : 1;
        u = primeCounts[u];
        if (!u) {
            return;
        }

        while (u) {
            if (!primeHelper.isKnownPrime(u)) {
                k++;
            }
            C[k]++

            u = primeCounts[u];
        }
    }

    const tracer = new Tracer(trace);
    for (let i = 1; i <= n; i++) {
        tracer.print(_ => n - i);
        c(i);
    }
    tracer.clear();
    const total = C.reduce((a, v) => v ? a.modMul(v, MODULO) : a, 1);
    return total;
}

assert.strictEqual(P(10), 648);
assert.strictEqual(P(100), 31038676032 % MODULO);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => P(MAX, true));
console.log(`Answer is ${answer}`);