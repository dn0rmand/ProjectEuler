const primes = require('../tools/primes.js')();
const assert = require('assert');

const allPrimes2 = new Map();
const allPrimes3 = [];
const allPrimes4 = [];

const MILLION = 1000000;
const MAX     = 50*MILLION;

function getAllPrimes()
{
    var m = Math.sqrt(MAX);
    m = Math.floor(m);

    for(var p of primes)
    {
        var p2 = p*p;
        if (p2 < MAX)
        {
            allPrimes2.set(p2, 1);

            var p3 = p2*p;
            if (p3 < MAX)
            {
                allPrimes3.push(p3);
                var p4 = p3*p;
                if (p4 < MAX)
                    allPrimes4.push(p4);
            }
        }
        else
            break;
    }    
}

/// Need to be a included in allPrimes2 (square primes)
function isOK2(value)
{
    return allPrimes2.has(value);
}

let memoize3 = [];

// Use memoize to speed up
function isOK3(value)
{
    let result = memoize3[value];
    if (result !== undefined)
        return result;

    for (let p of allPrimes3)
    {
        if (p > value)
            break; // No point trying more
        if (isOK2(value-p))
        {
            memoize3[value] = true;
            return true;
        }
    }
    memoize3[value] = false;
    return false;
}

// No speed up ... 
function isOK(value)
{
    for (let p of allPrimes4)
    {
        if (p > value)
            break; // No point trying more
        if (isOK3(value-p))
            return true;
    }
    return false;
}

getAllPrimes();

let count = 0;

for (let i = 28; i < MAX; i++)
{
    if (isOK(i))
        count++;
}

console.log(count + ' numbers below fifty million can be expressed as the sum of a prime square, prime cube, and prime fourth power');
