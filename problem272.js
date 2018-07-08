// Modular Cubes, part 2
// ---------------------
// Problem 272
// -----------

const assert = require('assert');
const bigInt = require('big-integer');
const primeHelper = require('./tools/primeHelper')();

const MAX_PRIME = 207300;
const MAX_TEST = 300000000;
const MAX_REAL = 100000000000;

let MAX = MAX_REAL;

primeHelper.initialize(MAX_PRIME); // Max Allowed Prime

function buildAllowedPrimes()
{
    function isAllowed(p)
    {
        return (p % 3 === 1);
    }

    const allowedPrimes = [9];

    for (let p of primeHelper.primes())
    {
        if (isAllowed(p))
            allowedPrimes.push(p);
    }

    return allowedPrimes;
}

function seed(primes, todo)
{
    if (todo === undefined)
        todo = (value) => {};

    function inner(value, index, count)
    {
        if (value > MAX)
            return;

        if (count === 5)
        {
            todo(value);
            return;
        }

        for (let i = index; i < primes.length; i++)
        {
            let v = value*primes[i];
            if (v > MAX)
                break;
            inner(value*primes[i], i+1, count+1);
        }
    }

    inner(1, 0, 0);
}

function solve()
{
    function mapPrimes(primes)
    {
        const map = new Set();
        for (let p of primes)
            map.add(p);
        return map;
    }

    const   primes = buildAllowedPrimes();    
    const   allPrimes = primeHelper.allPrimes();

    let     extra   = bigInt.zero;
    let     total   = 0;

    const visited = new Set();

    function moreSeed(value, index)
    {
        if (value > MAX)
            return;

        if (visited.has(value))
            return;

        visited.add(value);
        let t = total + value;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra = extra.plus(total).plus(value);
            total = 0;
        }
        else   
            total = t;

        for (let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];

            let v = value * p;
            while (v <= MAX)
            {
                moreSeed(v, i+1);
                v *= p;
            }
        }
    }

    seed(primes, (value) => {
        moreSeed(value, 0);
    });

    return extra.plus(total).toString();
}

MAX = MAX_TEST;
let test = +solve();
console.log(test, 19543219365706);

MAX = MAX_REAL;
// let answer = solve();
// console.log('Answer is', answer);
// 8495585919506151122
console.log('Done');
