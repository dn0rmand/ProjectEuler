// Problem 500!!!
// Problem 500 
// The number of divisors of 120 is 16.
// In fact 120 is the smallest number having 16 divisors.

// Find the smallest number with 2^500500 divisors.
// Give your answer modulo 500500507.

const assert = require('assert');
const $primes = require('tools/primes.js');

const MODULO = 500500507;

function buildPrimeStack(count)
{
    let primes = [];

    for(let p of $primes())
    {
        primes.push(p);
        count--;
        if (count <= 0)
            break;
    }

    return primes;
}

function solve(steps)
{
    let primes = buildPrimeStack(steps);
    let others = [];
    let pi = 0, oi = 0;

    function getNext()
    {
        if (oi < others.length)
        {
            if (primes[pi] < others[oi])
                return primes[pi++];
            else
                return others[oi++];
        }
        else
            return primes[pi++];
    }

    let value = 1;

    while (steps--)
    {
        let p = getNext();
        value = (value * p) % MODULO;
        others.push(p*p);
    }

    return value;
}

assert.equal(solve(4), 120);

let result = solve(500500);
console.log("The smallest number ( modulo 500500507 ) with 2^500500 divisors is "+result);