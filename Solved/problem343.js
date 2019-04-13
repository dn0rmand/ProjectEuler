// Fractional Sequences

// Problem 343
// For any positive integer k, a finite sequence ai of fractions xi/yi is defined by:
// a1 = 1/k and
// ai = (xi-1+1)/(yi-1-1) reduced to lowest terms for i>1.
// When ai reaches some integer n, the sequence stops. (That is, when yi=1.)
// Define f(k) = n.
// For example, for k = 20:

// 1/20 → 2/19 → 3/18 = 1/6 → 2/5 → 3/4 → 4/3 → 5/2 → 6/1 = 6

// So f(20) = 6.

// Also f(1) = 1, f(2) = 2, f(3) = 1 and Σf(k^3) = 118937 for 1 ≤ k ≤ 100.

// Find Σf(k^3) for 1 ≤ k ≤ 2×10^6.

const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const prettyTime= require("pretty-hrtime");

const MAX = 2000000;
const MAX_PRIME = Math.ceil(Math.sqrt(3999998000001));

console.log('Loading primes ...');
primeHelper.initialize(MAX_PRIME);
console.log('Primes loaded');

function bruteF(k)
{
    let x = 1n;
    let y = k;

    while (y > 1n)
    {
        x++;
        y--;

        if (x < y)
        {
            if (y % x === 0n)
            {
                y /= x;
                x  = 1n;
            }
        }
        else if (x > y)
        {
            if (x % y === 0n)
                return x / y;
        }
        else
            return 1n;
    }

    return x;
}

function f(k)
{
    let max ;
    primeHelper.factorize(k+1, (p) => {
        max = p-1;
    });

    return max;
}

function f3(k)
{
    // x^3​+1=(x+1)(x^2−x+1)
    let v1 = k+1;
    let v2 = k*k - k + 1;

    let max;

    primeHelper.factorize(v1, (p) => {
        max = p-1;
    });

    if (v2 < 2 || v1 === v2)
        return max;

    let max2;
    primeHelper.factorize(v2, (p) => {
        max2 = p-1;
    });

    if (max2 > max)
        max = max2;

    return max;
}

function solve(n, trace)
{
    let total = 0;
    let extra = 0n;
    let count = 0;

    for (let k = n; k > 0; k--)
    {
        if (trace)
        {
            if (count === 0)
            {
                process.stdout.write(`\r${k} `);
            }
            if (++count === 1000)
                count = 0;
        }
        let t = f3(k);
        let tt = total + t;
        if (Number.isSafeInteger(tt))
            total = tt;
        else
        {
            extra += BigInt(total) + BigInt(t);
            total  = 0;
        }
    }

    if (trace)
        process.stdout.write(`\r          \r`);

    return extra + BigInt(total);
}

assert.equal(f(1), 1);
assert.equal(f(2), 2);
assert.equal(f(3), 1);

assert.equal(solve(100), 118937);

console.log('Tests passed');

let timer = process.hrtime();
const answer = solve(2000000, true);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
