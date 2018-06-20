// Sum of squares of unitary divisors
// ----------------------------------
// Problem 429 
// -----------
// A unitary divisor d of a number n is a divisor of n that has the property gcd(d, n/d) = 1.
// The unitary divisors of 4! = 24 are 1, 3, 8 and 24.
// The sum of their squares is 12 + 32 + 82 + 242 = 650.

// Let S(n) represent the sum of the squares of the unitary divisors of n. Thus S(4!)=650.

// Find S(100000000!) modulo 1 000 000 009.

const bigInt = require('big-integer');

function factorial(n)
{
    let extra = bigInt(1);
    let t = 1;
    for (let i = 2; i <= n; i++)
    {
        let t2 = t * i;
        if (t2 > Number.MAX_SAFE_INTEGER)
        {
            extra = extra.times(t).times(i);
            t = 1;
        }
        else
            t = t2;
    }
    return t;
}

factorial(100000000);