// Semiprimes
// Problem 187 
// A composite is a number containing at least two prime factors. For example, 15 = 3 × 5; 9 = 3 × 3; 12 = 2 × 2 × 3.
//
// There are ten composites below thirty containing precisely two, not necessarily distinct, 
// prime factors: 4, 6, 9, 10, 14, 15, 21, 22, 25, 26.
//
// How many composite integers, n < 10^8, have precisely two, not necessarily distinct, prime factors?

const assert = require('assert');
const $primes = require('@dn0rmand/project-euler-tools/src/primes.js');
const isPrime= require('@dn0rmand/project-euler-tools/src/isPrime.js');

const primeEnumerator = $primes();
const primeCache      = [];

function *primes()
{
    for (let p of primeCache)
    {
        yield p;
    }

    while (true)
    {
        p = primeEnumerator.next().value;
        primeCache.push(p);
        yield p;
    }
}

function *factors(value)
{
    if (value < 2)
        return;

    if (isPrime(value))
    {
        yield value;
        return;
    }

    for (let p of primes())
    {
        let old = value;
        while (value >= p && value % p === 0)
        {
            yield p;
            value /= p;
        }

        if (old !== value)
        {
            if (value < 2)
                return;

            if (isPrime(value))
            {
                yield value;
                return;
            }
        }
    }
}

function solve(max)
{
    let total = 0;
    for(let value = 2; value < max; value++)
    {
        let count = 0;
        for (let factor of factors(value))
        {
            count++;
            if (count > 2)
                break;
        }
        if (count === 2)
            total++;
    }

    return total;
}

assert.equal(solve(30), 10);

console.log("10^8 => " + solve(100000000));
console.log('Done');