const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1E11;
const MAX_PRIME = Math.floor(Math.sqrt(MAX))+1;

primeHelper.initialize(MAX_PRIME);

function C(max, trace)
{  
    let total = 0;

    const MAX_DEEP  = 5;

    const allPrimes = primeHelper.allPrimes();
    const lastPrime = allPrimes[allPrimes.length-1];

    function inner(value, index, maxPower, deep)
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

        // const tracer = new Tracer(1, trace && deep <= MAX_DEEP);
        for(let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p;
            let power = 1;

            if (v > max)
                break;

            while (power <= maxPower && v <= max)
            {
                // tracer.print(_ => `${p}^${power}`);
                inner(v, i+1, power, deep+1);
                power++;
                v *= p;
            }
        }
        // tracer.clear();
    }

    inner(1, 0, Number.MAX_SAFE_INTEGER, 0);

    return total; 
}

assert.equal(C(100), 94);
assert.equal(timeLogger.wrap('', _ => C(1E6)) , 922052);
console.log('Tests passed');

const answer = timeLogger.wrap(`C(1E13)`, _ => C(MAX, true));
console.log(`Answer is ${answer}`);