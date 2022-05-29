const assert = require('assert');
const {
    TimeLogger,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const MAX_PRIME = 2E7;

primeHelper.initialize(MAX_PRIME);
const allPrimes = primeHelper.allPrimes();

const log = Math.log10;
const zero = 1E-15;
const equals = (v1, v2) => Math.abs(v1 - v2) < zero;

function solve(n, m) {

    n = m * log(n);

    let maxIndex = allPrimes.length - 1;

    function compare(p, q) {
        const v = q * log(p) + p * log(q);

        if (equals(v, n)) {
            return 0;
        }

        if (v > n) {
            return -1;
        }

        if (v < n) {
            return 1;
        }

        return 0;
    }

    function inner(index) {
        const p = allPrimes[index];

        let max = maxIndex;
        let min = index + 1;

        while (min < max) {
            const j = Math.floor((min + max) / 2);
            const q = allPrimes[j];

            const c = compare(p, q);
            if (c < 0) {
                max = j - 1;
            } else if (c > 0) {
                min = j + 1;
            } else {
                min = max = j;
            }
        }

        maxIndex = min = Math.min(min, max);
        if (min <= index) {
            return 0;
        }
        let c = compare(p, allPrimes[min]);
        if (c < 0) {
            min--;
            maxIndex--;
        }
        if (min <= index) {
            return 0;
        }
        let count = min - index;

        return Math.max(0, count);
    }

    let total = 0n;

    for (let index = 0; index < maxIndex; index++) {
        const count = inner(index);
        if (count === 0) {
            break;
        }
        total += BigInt(count);
    }

    return total;
}

assert.strictEqual(solve(800, 1), 2n);
assert.strictEqual(solve(800, 800), 10790n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve(800800, 800800, true));
console.log(`Answer is ${answer}`);