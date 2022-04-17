// Divisor Square Sum
// ------------------
// Problem 211 
// -----------
// For a positive integer n, let σ2(n) be the sum of the squares of its divisors. For example,

// σ2(10) = 1 + 4 + 25 + 100 = 130.
// Find the sum of all n, 0 < n < 64,000,000 such that σ2(n) is a perfect square.

const MAX = 64000000;

const assert = require('assert');
const divisors = require('@dn0rmand/project-euler-tools/src/divisors');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

primeHelper.initialize(MAX);

function σ2(value) {
    let total = 0;
    for (let divisor of divisors(value, primeHelper.isPrime)) {
        let d = (divisor * divisor);
        if (d > Number.MAX_SAFE_INTEGER)
            throw "Need bigint";
        total += d;
        if (total > Number.MAX_SAFE_INTEGER)
            throw "Need bigint";
    }
    return total;
}

function solve() {
    let total = 0;
    for (let n = MAX - 1; n > 0; n--) {
        let v = σ2(n);
        let r = Math.sqrt(v);
        if (r === Math.floor(r))
            total += n;
    }
    return total;
}

assert.equal(σ2(10), 130);

let answer = solve();
console.log(answer, 'is the sum of all n, 0 < n < ', MAX, 'such that σ2(n) is a perfect square')