// Modular Cubes, part 2
// ---------------------
// Problem 272
// -----------

const assert = require('assert');
const bigInt = require('big-integer');
const primeHelper = require('./tools/primeHelper')();

const MAX_PRIME = 6426323;
const MAX_TEST = 300000000;
const MAX_REAL = 100000000000;

primeHelper.initialize(MAX_PRIME); // Max Allowed Prime

function solve(MAX)
{
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

        let usedPrimes = [];

        function inner(value, index, count)
        {
            if (value > MAX)
                return;

            if (count === 5)
            {
                todo(value, usedPrimes);
                return;
            }

            for (let i = index; i < primes.length; i++)
            {
                let p = primes[i];
                let v = value * p;
                if (v > MAX)
                    break;
                usedPrimes.push(p);
                inner(v, i+1, count+1);
                usedPrimes.pop(p);
            }
        }

        inner(1, 0, 0);
    }

    function mapPrimes(primes)
    {
        let map = new Set();

        for (let p of primes)
        {
            map.add(p);
        }
        return map;
    }

    const   allowedPrimes = buildAllowedPrimes();    
    const   allPrimes = primeHelper.allPrimes();
    const   specialPrimes = mapPrimes(allowedPrimes);

    let     extra   = bigInt.zero;
    let     total   = 0;

    function moreSeed(value, index, usedPrimes)
    {
        if (value > MAX)
            return;

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
            if (v > MAX)
                break;

            let multiple = true;

            if (p === 3 && ! usedPrimes.includes(9))
            {
                moreSeed(v, i+1, usedPrimes);
                continue;
            }

            if (specialPrimes.has(p) && ! usedPrimes.includes(p))
                continue; // That would cause it to become bad
            
            while (v <= MAX)
            {
                moreSeed(v, i+1, usedPrimes);
                v *= p;
            }
        }
    }

    seed(allowedPrimes, (value, usedPrimes) => {        
        moreSeed(value, 0, usedPrimes);
    });

    return extra.plus(total).toString();
}

let test = solve(MAX_TEST);
assert.equal(test, "19543219365706");

let answer = solve(MAX_REAL);
console.log('Answer is', answer);
console.log('Done');
