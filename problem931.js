const assert = require('assert');
const { divisors: getDivisors, primeHelper, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX = 1e12;
const MAX_PRIME = 1e7;
const MODULO = 715827883;

primeHelper.initialize(MAX_PRIME);

// const memoize_t = [];

function t(n) {
    const divisors = getDivisors(n).sort((a, b) => a - b);

    let total = 0;

    function getSubTotal(i, b) {
        const phiB = primeHelper.PHI(b);
        let subTotal = 0;
        for (let j = i + 1; j < divisors.length; j++) {
            const a = divisors[j];
            if (a % b === 0 && primeHelper.isPrime(a / b)) {
                subTotal += primeHelper.PHI(a) - phiB;
            }
        }
        return subTotal;
    }

    const values = [];

    for (let i = 0; i < divisors.length - 1; i++) {
        const b = divisors[i];
        const v = getSubTotal(i, b);
        values[b] = v;
        total += v;
    }
    return total;
}

function T(n) {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total = (total + t(i)) % MODULO;
    }
    return total;
}

console.log(7, t(7));
console.log(5, t(5));
console.log(35, t(35));

assert.strictEqual(t(45), 52);
assert.strictEqual(T(10), 26);
assert.strictEqual(T(100), 5282);

console.log('Tests passed');

console.log(TimeLogger.wrap('', () => T(1000000)));
// const answer = TimeLogger.wrap('', () => T(MAX));
// console.log(`Answer is ${answer}`);
