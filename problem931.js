const assert = require('assert');
const { divisors: getDivisors, primeHelper } = require('@dn0rmand/project-euler-tools');

const MAX = 1e12;
const MAX_PRIME = 1e7;
const MODULO = 715827883;

primeHelper.initialize(MAX_PRIME);

const memoize_t = [];

function t(n) {
    if (memoize_t[n] !== undefined) {
        return memoize_t[n];
    }
    const divisors = getDivisors(n).sort((a, b) => a - b);

    let total = 0;

    for (let i = 0; i < divisors.length; i++) {
        const b = divisors[i];
        for (let j = i + 1; j < divisors.length; j++) {
            const a = divisors[j];
            if (a % b === 0 && primeHelper.isPrime(a / b)) {
                total += primeHelper.PHI(a) - primeHelper.PHI(b);
            }
        }
    }
    memoize_t[n] = total;
    return total;
}

function T(n) {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total = (total + t(i)) % MODULO;
    }
    return total;
}

assert.strictEqual(t(45), 52);
assert.strictEqual(T(10), 26);
assert.strictEqual(T(100), 5282);

console.log('Tests passed');

// const answer = TimeLogger.wrap('', () => solve(MAX));
// console.log(`Answer is ${answer}`);
