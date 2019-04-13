// Exploring the number of different ways a number can be expressed as a sum of powers of 2

// Problem 169
// Define f(0)=1 and f(n) to be the number of different ways n can be expressed as a sum of
// integer powers of 2 using each power no more than twice.

// For example, f(10)=5 since there are five different ways to express 10:

// 1 + 1 + 8
// 1 + 1 + 4 + 4
// 1 + 1 + 2 + 2 + 4
// 2 + 4 + 4
// 2 + 8

// What is f(10^25)?

// https://oeis.org/A002487
/*

a(2*n)   = a(n)
a(2*n+1) = a(n) + a(n+1)

*/

const assert = require('assert');

const $a = new Map();

function a(n)
{
    if (n === 0n)
        return 0;

    if (n === 1n)
        return 1;

    while ((n & 1n) == 0)
        n /= 2n;

    if ($a.has(n))
        return $a.get(n);

    let m = (n-1n)/2n;
    let v = a(m) + a(m+1n);

    $a.set(n, v);

    return v;
}

function f(n)
{
    return a(BigInt(n)+1n);
}

assert.equal(f(10), 5);
assert.equal(f(9980), 144);

const answer = f(10n ** 25n);
console.log('Answer is', answer);