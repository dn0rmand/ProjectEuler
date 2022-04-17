const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO    = 1000000007;
const MAX       = 1E12;
const MAX_PRIME = 1E6;

require('@dn0rmand/project-euler-tools/src/numberHelper');

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME, true));

const allPrimes = primeHelper.allPrimes();

function S(N, trace)
{
    let total  = 0;

    for(const p of allPrimes)
    {
        if (p > N)
            break;

        let counts = [];
        let P = p;
        let f = 1;
        while (P*p <= N)
        {
            P *= p;
            f += 1;
        }
        let rest = N;
        while(f > 0)
        {
            let c = Math.floor(N / P);
            for(let i = f+1; i < counts.length; i++)
                c -= counts[i];
            counts[f] = c;
            rest -= c;
            P /= p;
            f--;
        }
        counts[0] = rest;
        
        for(let i = 0; i < counts.length; i++)
        for(let j = i+1; j < counts.length; j++)
        {
            const v = Number(j-i).modMul(counts[i], MODULO).modMul(counts[j], MODULO);

            total = (total + v) % MODULO;
        }
    }

    if (N > MAX_PRIME)
    {
        const max = allPrimes[allPrimes.length-1];

        const tracer = new Tracer(10000, true);

        let top = N;
        let topCount = primeHelper.countPrimes(top);

        for(let i = 1; ; i++)
        {
            const bottom = Math.floor(N / (i+1));
            if (top <= max)
            {
                break;
            }

            tracer.print(_ => top - max);

            if (bottom < max)
                bottom = max;

            const bottomCount = primeHelper.countPrimes(bottom);
            const count = topCount - bottomCount;

            top      = bottom;
            topCount = bottomCount;

            const extra  = i.modMul(N-i, MODULO).modMul(count, MODULO);
            total = (total + extra) % MODULO;
        }
        tracer.clear();
    }

    total = (total + total) % MODULO; 

    return total;
}

assert.equal(S(10), 210);
assert.equal(S(100), 37018);
assert.equal(S(1000), 4654406);
assert.equal(S(10000), 529398010);
assert.equal(S(1000000), 855149579);

console.log('Test passed');

console.log(timeLogger.wrap('', _ => S(MAX, true)));
