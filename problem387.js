const assert = require('assert');
const $isPrime= require('./tools/isPrime.js');

function memoizeIt(fn)
{
    let cache = new Map();

    let fn2 = function(value)
    {
        let v = cache.get(value);
        if (v === undefined)
        {
            v = fn(value);
            cache.set(value, v);
            return v;
        }
        else
            return v;
    }

    return fn2;
}

let isPrime = memoizeIt($isPrime);

function *getStrongRightTruncatableHarshad(max)
{
    function *inner(prefix, digitSum)
    {
        if (prefix >= max)
            return;

        for (let digit = 0; digit < 10; digit++)
        {
            let value = (prefix * 10)+digit;
            let sum   = digitSum + digit;

            if ((value % sum) === 0)
            {
                // check if strong
                let p = value / sum;
                if (isPrime(p))
                {
                    // It's strong. Find prime by adding a digit
                    for (let d = 1; d < 10; d += 2) // Cannot be even since we're looking for prime #
                    {
                        let p = (value * 10)+d;
                        if (p < max && isPrime(p))
                            yield p;
                    }
                }
                yield *inner(value, sum);
            }
        }
    }

    for (let digit = 1; digit < 10; digit++)
    {
        // yield digit; // None of the single digit are good
        yield *inner(digit, digit);
    }
}

function solve(max)
{
    let sum = 0;
    for (let p of getStrongRightTruncatableHarshad(max))
    {
        sum += p;
    }
    return sum;
}

assert.equal(solve(10000), 90619);

const MAXI = Math.pow(10, 14);

let result = solve(MAXI);

console.log("DONE - Answer is " + result);