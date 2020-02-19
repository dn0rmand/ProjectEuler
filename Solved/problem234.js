const MAX = 999966663333;
const MAX_PRIME = 1000005;

const assert = require('assert');
const primeHelper = require('tools/primeHelper')(MAX_PRIME);
const timerLogger = require('tools/timeLogger');

function sum(min, max, ceiling)
{
    let MIN = min*min;
    let MAX = max*max;

    let total = 0;
    let start = MIN+min;

    for(let m = start; m < MAX && m <= ceiling; m += min)
    {
        total += m;
    }

    for(let m = MAX-max; m > MIN; m -= max)
    {
        if (m <= ceiling)
        {
            if (m % min === 0)
                total -= m;
            else
                total += m;
        }
    }

    return total;
}

function solve(max)
{
    let root = Math.floor(Math.sqrt(max))+1;
    let allPrimes = primeHelper.allPrimes();

    let p0 = 2;
    let total = 0n;

    for(let i = 1; i < allPrimes.length && p0 <= root; i++)
    {
        let p1 = allPrimes[i];
        const subTotal = sum(p0, p1, max);
        total += BigInt(subTotal);

        p0 = p1;
    }
    return total;
}

assert.equal(solve(15), 30);
assert.equal(solve(1000), 34825);

console.log('Tests passed');

const answer = timerLogger.wrap('', () => solve(MAX));

console.log(`Answer is ${answer}`)