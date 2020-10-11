const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const LR = require('tools/polynomial');

const MAX = 1E13;
const MAX_PRIME = Math.floor(Math.sqrt(MAX))+1;

primeHelper.initialize(MAX_PRIME);

function validate(value)
{
    let lastPower = Number.MAX_SAFE_INTEGER;
    let ok = true;
    primeHelper.factorize(value, (p, f) => {
        if (f > lastPower)
        {
            ok = false;
            return false;
        }
        lastPower = f;
    });

    return ok;
}

function C(max)
{  
    let total = 0;

    const allPrimes = primeHelper.allPrimes();
    const lastPrime = allPrimes[allPrimes.length-1];

    function inner(value, index, maxPower)
    {
        if (value > max)
            return;

        total++;

        let maxPrime = Math.floor(max / value);
        if (maxPrime > lastPrime)
        {
            let count = primeHelper.countPrimes(maxPrime);
            count -= allPrimes.length;
            total += count;
        }

        for(let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p;
            let power = 1;

            if (v > max)
                break;

            while (power <= maxPower && v <= max)
            {
                inner(v, i+1, power);
                power++;
                v *= p;
            }
        }
    }

    inner(1, 0, Number.MAX_SAFE_INTEGER);

    return total; 
}

function C1(max)
{  
    let total = 0;

    const allPrimes = primeHelper.allPrimes();
    const lastPrime = allPrimes[allPrimes.length-1];

    let A, B; // 2 used primes

    function inner(value, index)
    {
        if (value > max)
            return;

        if (validate(value))
        {
            console.log(`${value} is valid!!!`);
        }
        total++;

        let maxPrime = Math.floor(max / value);
        if (maxPrime > lastPrime)
        {
            let count = primeHelper.countPrimes(maxPrime);
            count -= allPrimes.length;
            total += count;
        }

        for(let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            if (p === A || p === B)
                continue;

            let v = value * p;

            if (v > max)
                break;

            while (v <= max)
            {
                inner(v, i+1);
                v *= p;
            }
        }
    }

    for(A of allPrimes)
    {
        if (A === 2)
            continue; // Skip first prime

        let powerA = 2;
        let valueA = A*A;

        if (valueA > max)
            break;

        while (valueA <= max)
        {
            for(B of allPrimes)
            {
                if (B >= A)
                    break;

                let powerB = 1;
                let valueB = valueA * B;

                if (valueB > max)
                    break;

                while (powerB < powerA && valueB <= max)
                {
                    inner(valueB, 0);

                    valueB *= B;
                    powerB++;
                }
            }

            powerA++;
            valueA *= A;
        }
    }

    return max - total; 
}

assert.strictEqual(timeLogger.wrap('C(100)', _ => C(100)), 94);
assert.strictEqual(timeLogger.wrap('', _ => C(1E6)) , 922052);

console.log('Tests passed');

const answer = timeLogger.wrap(`C(1E13)`, _ => C(MAX, true));
console.log(`Answer is ${answer}`);