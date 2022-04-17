/*
If n = (p1^a1)(p2^a2)...(pt^at), a(n) = ((2*a1 + 1)(2*a2 + 1) ... (2*at + 1) + 1)/2
*/

const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const MAX = 1E12

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(1E6, true));

const allPrimes = primeHelper.allPrimes();
const maxPrime  = allPrimes[allPrimes.length-1];

function getExtras(max, value)
{
    const m = Math.floor(max / value);
    if (m > maxPrime)
    {
        let count = primeHelper.countPrimes(m) - allPrimes.length;
        count += 0;
        return count;
    }
    return 0;
}

function generateNumbers(max, callback)
{
    const factors = [];

    function innerGenerateNumbers(value, index, minPrime)
    {
        if (value > max)
            return;
    
        callback(value, factors, minPrime || 1);
    
        for(let i = index; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];
    
            let v = value * p;
            if (v > max)
                break;
    
            const idx = factors.length;
            factors.push(1);
            while (v <= max)
            {
                innerGenerateNumbers(v, i+1, minPrime || p);
    
                factors[idx]++;
                v *= p;
            }
            factors.pop();
        }
    }
    
    innerGenerateNumbers(1, 0);
}

function g(n, trace)
{
    const tracer = new Tracer(1E7, trace);
    let total = 0;
    let extra = 0n;
    let count = n;

    const add = v => {
        const t = total + v;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra += BigInt(total) + BigInt(v);
            total  = 0;
        }
        else
            total = t;
    };

    generateNumbers(n, (value, factors, minPrime) => 
    {
        count--;
        tracer.print(_ => `${minPrime} - ${count}`);

        let v = factors.reduce((a, f) => a * (f+f+1), 1);

        add((v + 1)/2);

        const morePrimes = getExtras(n, value);
        if (morePrimes)
        {
            add(morePrimes * ((v*3 + 1) / 2));
            count -= morePrimes;
        }
    });
    tracer.clear();
    return BigInt(total) + extra;
}

assert.equal(g(1E6), 37429395);
assert.equal(g(1E8), 6261116500);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => g(MAX, true));
console.log(`Answer is ${ answer }`);
