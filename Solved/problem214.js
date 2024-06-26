const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const MAX = 40000000;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX));

function checkChainLength(n, target)
{
    let count = 0;

    while(n > 1)
    {
        count++;
        if (count >= target)
            return false;

        n = primeHelper.PHI(n);
    }
    count++;

    return count === target;
}

function tests()
{
    const good = [5, 7, 8, 9, 10, 12, 14, 18];

    for (let i = 5; i < 20; i++)
    {
        assert.equal(checkChainLength(i, 4), good.includes(i));
    }
}

function solve()
{
    let total = 0;
    const maxPrime = primeHelper.maxPrime();
    const primes = primeHelper.allPrimes();

    let i = primes.indexOf(9548417);

    while (i < primes.length)
    {
        const p = primes[i++];
        // process.stdout.write(`\r${maxPrime - p}  `);
        if (checkChainLength(p, 25))
        {
            total += p;
        }        
    }

    return total;
}

tests();
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);