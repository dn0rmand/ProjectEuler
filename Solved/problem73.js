// Counting fractions in a range
// Problem 73
// Consider the fraction, n/d, where n and d are positive integers. If n<d and HCF(n,d)=1, it is called a reduced proper
// fraction.

// If we list the set of reduced proper fractions for d ≤ 8 in ascending order of size, we get:

// 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8

// It can be seen that there are 3 fractions between 1/3 and 1/2.

// How many fractions lie between 1/3 and 1/2 in the sorted set of reduced proper fractions for d ≤ 12,000?

const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

function solve(max) {
    let values = new Map();
    let count = 0;
    let minTarget = 1 / 3;
    let maxTarget = 1 / 2;

    for (let d = 2; d <= max; d++) {
        let start = Math.floor(d / 3);
        if (start < 1) start = 1;

        for (let n = start; n < d; n++) {
            let value = n / d;
            if (value >= maxTarget) break;

            if (value > minTarget) {
                let x = d.gcd(n);

                divisor = d / x;
                numerator = n / x;

                let sub = values.get(divisor);
                if (sub === undefined) {
                    sub = new Map();
                    values.set(divisor, sub);
                }
                if (!sub.has(numerator)) {
                    sub.set(numerator, 1);
                    count++;
                }
            }
        }
    }

    return count;
}

assert.equal(solve(8), 3);

let result = TimeLogger.wrap('', () => solve(12000));
console.log(result + ' fractions lie between 1/3 and 1/2 when for d ≤ 12,000');
