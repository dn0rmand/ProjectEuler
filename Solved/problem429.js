// Sum of squares of unitary divisors
// ----------------------------------
// Problem 429 
// -----------
// A unitary divisor d of a number n is a divisor of n that has the property gcd(d, n/d) = 1.
// The unitary divisors of 4! = 24 are 1, 3, 8 and 24.
// The sum of their squares is 12 + 32 + 82 + 242 = 650.

// Let S(n) represent the sum of the squares of the unitary divisors of n. Thus S(4!)=650.

// Find S(100000000!) modulo 1 000 000 009.

const assert = require('assert');
const bigInt = require('big-integer');
const primeHelper = require('tools/primeHelper')();
const MAX    = 100000000;
const MODULO = 1000000009;

primeHelper.initialize( MAX );

function unfactorize(max, callback)
{
    let usedPrimes = [];
    let allPrimes = primeHelper.allPrimes();
    let count = max;

    function inner(value, index)
    {
        if (value > max)
            return;
        if (count > 0)
        {
            if (value > 1)
            {
                let previous = 0, times = 0;

                for (let p of usedPrimes)
                {
                    if (p === previous)
                        times++;
                    else
                    {
                        if (times > 0)
                            callback(previous, times);
                        times = 1;
                        previous = p;
                    }
                }
                if (times > 0)
                    callback(previous, times);
            }
            count--;
        }
        if (count <= 0)
            return;

        for (let i = index; i < allPrimes.length; i++)
        {  
            if (count <= 0)
                break;
            let p = allPrimes[i];
            let v = value * p;
            if (v > max)
                break;
            usedPrimes.push(p);
            inner(v, i);
            usedPrimes.pop(p);
        }
    }

    inner(1, 0);

    if (count !== 0)
        throw "ERROR";
}

function solve(n)
{
    let factors = new Map();

    unfactorize(n, (p, count) => {
        if (count > 0)
        {
            let o = (factors.get(p) || 0) + count;
            factors.set(p, o);
        }
    });

    let result = 1;
    for (let p of factors.entries())
    {
        let prime = p[0];
        let power = p[1] * 2;
        let value = bigInt(prime).modPow(power, MODULO).valueOf() + 1;

        let r = result * value;
        if (r > Number.MAX_SAFE_INTEGER)
            result = bigInt(result).times(value).mod(MODULO).valueOf();
        else
            result = r % MODULO;
    }

    return result;
}

assert.equal(solve(4), 650);

console.time('429');
let answer = solve(MAX);
console.timeEnd('429');
console.log('Answer is', answer);