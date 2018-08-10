// (prime-k) factorial
// -------------------
// Problem 381 
// -----------
// For a prime p let S(p) = (∑(p-k)!) mod(p) for 1 ≤ k ≤ 5.

// For example, if p=7,
// (7-1)! + (7-2)! + (7-3)! + (7-4)! + (7-5)! = 6! + 5! + 4! + 3! + 2! = 720+120+24+6+2 = 872.
// As 872 mod(7) = 4, S(7) = 4.

// It can be verified that ∑S(p) = 480 for 5 ≤ p < 100.

// Find ∑S(p) for 5 ≤ p < 10^8.

/*

a ≡ b (mod n) means a − b is divisible by n

(n-1)! = -1 (mod n)

((n-1)! + 1) % n = 0
(n-1)! % n = n-1

(p-1)! => p-1
(p-2)! => (p-1)!/(p-1) => (p-1)/(p-1) => 1

(p-3)! => (p-2)! * (p-2)^-1 => (p-2)^-1 => (p-2)^(p-2)
(p-4)! => (p-3)!/(p-3) => (p-2)^(p-2) * (p-3)^(p-2)
(p-5)! => (p-4)!/(p-4)

a^(p-2) EQ a^-1 mod p
(-a^(p-2) + a^-1) % p = 0
a^-1 EQ = a^(p-2) mod p2

*/

const MAX = 100000000;

const assert = require('assert');
const announce = require('../tools/announce');
const bigInt = require('big-integer');
const primeHelper = require('../tools/primeHelper')();

primeHelper.initialize(MAX);

function powMod(n, power, modulo)
{
    return bigInt(n).modPow(power, modulo);
}

function S(p)
{
    // let pp1 = p-1;
    // let pp2 = 1;
    let pp3 = bigInt(p-2).modPow(p-2, p);
    let pp4 = pp3.times(bigInt(p-3).modPow(p-2, p)).mod(p);
    let pp5 = pp4.times(bigInt(p-4).modPow(p-2, p)).mod(p);

    let total = pp5.plus(pp4).plus(pp3)/*.plus(pp2).plus(pp1)*/.mod(p);
    return total.valueOf();
}

function solve(max, trace)
{
    let total   = 0;
    let percent = -1;

    for(let p of primeHelper.primes())
    {
        if (p < 5)
            continue;

        if (p >= max)
            break;

        if (trace !== false)
        {
            let pc = Math.floor(p * 100 / max);
            if (pc > percent)
            {
                percent = pc;
                console.log(percent + "%");
            }
        }
        total += S(p);
    }

    return total;
}

assert.equal(S(7), 4);
assert.equal(solve(100, false), 480);

let answer = solve(MAX, false);

announce(381, '∑S(p) for 5 ≤ p < ' + MAX + ' is ' + answer);
