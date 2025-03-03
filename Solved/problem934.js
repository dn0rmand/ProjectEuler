const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e17;
const MAX_PRIME = 100;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes().map((p) => BigInt(p));

function U(max) {
    max = BigInt(max);

    let total = max;
    let remainder = max / 2n;
    let modulo = 2n;
    let values = BigInt64Array.from([0n]);

    const range = new Set();
    range.add(0n);

    let nextRange = 7n;

    const invalid = new BigInt64Array(2000000);

    for (const p of allPrimes) {
        while (nextRange < p) {
            range.add(nextRange);
            nextRange += 7n;
        }

        const nextModulo = modulo * p;
        const extra = max % nextModulo;
        const factor = max / nextModulo;

        let count = 0n;

        const end = nextModulo <= max ? nextModulo : max + 1n;
        let index = 0;

        for (const start of values) {
            for (let candidate = start; candidate < end; candidate += modulo) {
                if (range.has(candidate % p)) {
                    invalid[index++] = candidate;
                } else {
                    if (candidate <= extra) {
                        count++;
                    }
                    count += factor;
                }
            }
        }

        modulo = nextModulo;
        values = invalid.slice(0, index);

        total += p * count;
        remainder -= count;
        if (remainder <= 0n) {
            break;
        }
    }

    return total;
}

assert.strictEqual(U(1e8), 292137790n);
assert.strictEqual(U(1470), 4293n);
assert.strictEqual(U(1e7), 29213782n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => U(MAX));
console.log(`Answer is ${answer}`);
