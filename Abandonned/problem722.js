const assert = require('assert');
const {
    divisors,
    polynomial,
} = require('@dn0rmand/project-euler-tools');

function σ(k, n) {
    k = BigInt(k);

    let total = 0n;
    for (let d of divisors(n)) {
        let x = BigInt(d) ** k;
        total += x;
    }
    return total;
}

function analyze(k) {
    let p = polynomial.findPolynomial(1, 1, n => σ(k, n));
}

analyze(1);
analyze(3);
analyze(7);

// (1-1/x) = (x-1)/x