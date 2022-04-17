// Idempotents
// -----------
// Problem 407
// ----------- 
// If we calculate a^2 mod 6 for 0 ≤ a ≤ 5 we get: 0,1,4,3,4,1.

// The largest value of a such that a^2 ≡ a mod 6 is 4.
// Let's call M(n) the largest value of a < n such that a^2 ≡ a (mod n).
// So M(6) = 4.

// Find ∑M(n) for 1 ≤ n ≤ 10000000.

//
// (a^2 - a) % n = 0
// (a*(a-1)) % n = 0
// a % n = 0 || (a-1) % n = 0

const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const announce = require('@dn0rmand/project-euler-tools/src/announce');

const MAX = 10000000;

primeHelper.initialize(MAX);

function M(n) 
{
    if (primeHelper.isPrime(n))
        return 1;

    for (let a = n-1; a > 0; a--)
    {
        if (a*(a-1) % n === 0)
            return a;
    }

    return 0;
}

function solve(max, trace)
{
    let total = 0;
    let percent = '';

    for (let n = 2; n <= max; n++)
    {
        total += M(n);
        if (trace !== true)
            continue;

        let p = ((n * 100) / max).toFixed(0);
        if (p !== percent)
        {
            percent = p;
            console.log(p,'%');
        }
    }

    return total;
}


assert.equal(M(6), 4);

console.time("T1");
assert.equal(solve(1000), 314034);
console.timeEnd("T1");
console.time("T2");
assert.equal(solve(100000), 3717852515);
console.timeEnd("T2");

// console.time("T3");
let answer = solve(MAX, true);
// console.timeEnd("T3");

announce(407, "∑M(n) for 1 ≤ n ≤ " + MAX + " is " + answer);