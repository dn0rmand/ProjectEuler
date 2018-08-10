// Prime square remainders
// -----------------------
// Problem 123 
// -----------
// Let pn be the nth prime: 2, 3, 5, 7, 11, ..., and let r be the remainder when (pn−1)^n + (pn+1)^n is divided by pn^2.

// For example, when n = 3, p3 = 5, and 4^3 + 6^3 = 280 ≡ 5 mod 25.

// The least value of n for which the remainder first exceeds 10^9 is 7037.

// Find the least value of n for which the remainder first exceeds 10^10.

const bigInt = require('big-integer');
const primeHelper = require('../tools/primeHelper')();
const assert = require('assert');

const TEST_MAX = 1000000000;
const MAX = 10000000000;

primeHelper.initialize(300000);

function solve(maxRemainder)
{
    let primes = primeHelper.allPrimes();

    function isGreater(n)
    {
        let p = primes[n-1];

        let v1 = bigInt(p-1).pow(n);
        let v2 = bigInt(p+1).pow(n);
        let m  = bigInt(p).square();

        let remainder = v1.plus(v2).mod(m);

        return (remainder.greater(maxRemainder));
    }

    let min = 1;
    let max = primes.length;
    if ((max & 1) === 0)
        max--;

    while (true)
    {
        let middle = Math.floor((max+min)/2);
        if ((middle & 1) === 0)
            middle++;
        
        if (middle === max)
        {
            if (min === middle-2)
            {
                if (isGreater(middle))
                    return middle;
                else
                    throw "Not enough primes";
            }
            else
                middle -= 2;
        }
        
        if (isGreater(middle))
        {
            max = middle;
        }
        else
        {
            min = middle;
        }

        if (max < min)
            return middle;
    }
}

assert.equal(solve(TEST_MAX), 7037);

let answer = solve(MAX);

console.log('Answer to problem 123 is', answer);