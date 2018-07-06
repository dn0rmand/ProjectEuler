// Modular Cubes, part 2
// ---------------------
// Problem 272
// -----------

const assert = require('assert');
const bigInt = require('big-integer');
const primeHelper = require('./tools/primeHelper')();

const MAX = 100000000000;
const memoizeSolve = new Map();

primeHelper.initialize(100000000);

// 2 , 3 , 5 , 7 , 11 , 13 , 17 , 19 , 23 , 29 , 31 , 37 , 41 , 43

function S(max, expected)
{
    let primes = [];

    let v = max;
    for (let p of primeHelper.primes())
    {
        if (p >= v)
        {
            primes.push(v);
            break;
        }
        if (v % p === 0)
        {
            primes.push(p);
            while (v % p === 0)
                v /= p;
            if (v === 1)
                break;
            if (primeHelper.isPrime(v))
            {
                primes.push(v);
                break;
            }
        }        
    }

    const MAX_I = 208063;

    function solve(p, max)
    {
        let count = memoizeSolve.get(p);
        if (count !== undefined)
            return count;
        
        count = 1;

        for (let i = 2; i < p; i++)
        {
            let i3;
            if (i <= MAX_I)
                i3 = (i*i*i) % p;
            else
                i3 = bigInt(i3).modPow(3, p).valueOf();

            if (i3 === 1)
            {
                count++;
                if (count > max)
                    break;
            }
        }

        memoizeSolve.set(p, count);
        return count;
    }

    let total = ++expected;

    for (let p of primes)
    {
        let count = solve(p, expected);
        total /= count;
        if (total !== Math.floor(total))
            return false;
    }

    return total === 1;
}

function solve(max)
{
    let total = 0;
    for (let n = max; n > 1; n--)
    {
        if (S(n, 242))
            total++;
    }
    return total;
}

// assert.equal(S(91, 8), true);

let answer = solve(MAX);

//console.log('answer is (4617456485273129588)', answer);
console.log('Done');
