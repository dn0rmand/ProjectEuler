// Tribonacci non-divisors
// Problem 225 
// The sequence 1, 1, 1, 3, 5, 9, 17, 31, 57, 105, 193, 355, 653, 1201 ...
// is defined by T1 = T2 = T3 = 1 and Tn = Tn-1 + Tn-2 + Tn-3.

// It can be shown that 27 does not divide any terms of this sequence.
// In fact, 27 is the first odd number with this property.

// Find the 124th odd number that does not divide any terms of the above sequence.

const assert = require('assert');
const bigInt = require('big-integer');

const MAX_COUNT = 23000; // 20 thousand

function *tribonacci()
{
    // Don't care about the early numbers
    let t1 = bigInt(1);
    let t2 = bigInt(1);
    let t3 = bigInt(1);

    while (true)
    {
        let t4 = t1.plus(t2).plus(t3);
        yield t4;
        t1 = t2;
        t2 = t3;
        t3 = t4;
    }    
}

function buildCache()
{
    let cache = [];

    for(let p of tribonacci())
    {
        cache.push(p);

        if (cache.length === MAX_COUNT)
            break;
    }
    return cache;
}

function isDivisor(cache, n)
{
    for(let i = cache.length; i > 0 ; i--)
    {
        let p = cache[i-1];
        if (p.lt(n))
            break;
        if (p.mod(n).isZero())
            return true;
    }

    return false;
}

function solve()
{
    let cache = buildCache();

    let count = 1;
    
    for (let i = 29; ; i += 2)
    {
        if (! isDivisor(cache, i))
        {
            if (++count === 124)
                return i;
        }
    }
}

console.log("The 124th odd number that does not divide any terms of the Tribonacci sequence might be " + solve());