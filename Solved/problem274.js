const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');

const MAX = 1E7

primeHelper.initialize(MAX, true);

function f(p)
{
    switch (p % 10)
    {
        case 1:
            return p - (p-1)/10;

        case 3:
            return p - (7*p - 1)/10;

        case 7:
            return p - (3*p - 1)/10;
        case 9:
            return p - (9*p - 1)/10;
    }
    throw "Not a prime";
}

function solve(max)
{
    let total = 0;

    for(const p of primeHelper.allPrimes())
    {
        if (p >= max)
            break;
        if (p === 2 || p === 5)
            continue;

        total += f(p);
    }
    return total;
}

assert.equal(f(113), 34);
assert.equal(solve(1000), 39517)

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));

console.log(`Answer is ${answer}`);