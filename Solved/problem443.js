const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e15;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX)) + 1;

primeHelper.initialize(MAX_PRIME);

function G(max) {
    let m = 13;

    for (let n = 5; n <= max; n++) {
        const m0 = m;
        const g = n.gcd(m0);
        m = m0 + g;
        if (m / n === 3) {
            let k = undefined;
            primeHelper.factorize(n + n - 1, (p) => {
                if (p > 2 && (p - 3) % 2 === 0) {
                    k = (p - 3) / 2;
                    return false;
                }
            });
            if (k !== undefined) {
                const next = n + k + 1;
                if (next <= max) {
                    m = 2 * next;
                    n = next - 1;
                } else {
                    m = 3 * n + (max - n);
                    n = next;
                }
            }
        }
    }
    return m;
}

assert.strictEqual(G(10), 28);
assert.strictEqual(G(20), 60);
assert.strictEqual(G(1000), 2524);
assert.strictEqual(G(1000000), 2624152);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => G(MAX));
console.log(`Answer is ${answer}`);
