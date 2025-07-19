// Ordered fractions
// Problem 71
// Consider the fraction, n/d, where n and d are positive integers. If n<d and HCF(n,d)=1, it is called a reduced proper fraction.

// If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:

// 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8

// It can be seen that 2/5 is the fraction immediately to the left of 3/7.

// By listing the set of reduced proper fractions for d ≤ 1,000,000 in ascending order of size, find the numerator of the fraction immediately to the left of 3/7.

const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function solve(max) {
    let target = 3 / 7;

    let current = 0;
    let numerator = 0;
    let divisor = 1;

    for (let d = 2; d <= max; d++) {
        let start = Math.floor((d / divisor) * numerator);
        if (start < 1) start = 1;

        for (let n = start; n < d; n++) {
            let value = n / d;
            if (value >= target) break;

            if (value > current) {
                divisor = d;
                numerator = n;
                current = value;
            }
        }
    }

    let x = divisor.gcd(numerator);

    divisor /= x;
    numerator /= x;

    return numerator + '/' + divisor;
}

assert.equal(solve(8), '2/5');

let result = TimeLogger.wrap('', () => solve(1000000));
console.log(`Answer is ${result.split('/')[0]}`);
