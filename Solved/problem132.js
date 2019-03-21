const primeHelper = require('tools/primeHelper')();
const assert = require('assert');

require('tools/numberHelper');

primeHelper.initialize(1E7);

function solve(value, count)
{
    let total = 0;
    let TEN = 10;

    for (let prime of primeHelper.primes())
    {
        if (prime === 3) // Exception
            continue;

        let p9 = prime * 9;

        if (TEN.modPow(value, p9) === 1)
        {
            total += prime;
            if (--count === 0)
            {
                return total;
            }
        }
    }
    throw "didn't load enough primes :(";
}

assert.equal(solve(10, 4), 9414);

let answer = solve(1E9, 40);
console.log('Answer is', answer);