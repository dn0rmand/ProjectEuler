const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO    = 1000000007;
const MAX       = 1E12;
const MAX_PRIME = 1E6;

require('tools/numberHelper');

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX_PRIME, true));

const allPrimes = primeHelper.allPrimes();

function S(N, trace)
{
    let total  = 0;

    const tracer = new Tracer(1000, trace);
    
    for(let p of allPrimes)
    {
        if (p > N)
            break;

        tracer.print(_ => p);

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
            let v = Number(j-i).modMul(counts[i], MODULO).modMul(counts[j], MODULO);

            total = (total + v) % MODULO;
        }
    }

    if (N > MAX_PRIME)
    {
        // let previous = primeHelper.countPrimes(N);
        // let done = false;
        // for(let i = 2; !done ; i++)
        // {
        //     let max  = Math.floor(N / i);
        //     let primeCount;
        //     if (max < N)
        //     {
        //         done = true;
        //         primeCount = allPrimes.length;
        //     }
        //     else
        //         primeCount = primeHelper.countPrimes(max);

        //     let primes = previous - primeCount;
        //     previous = primeCount;

        //     assert.equal((max+1) * i > N, true);

        //     let extra = primes.modMul(N-1, MODULO).modMul(i-1, MODULO);
        //     total = (total + extra) % MODULO;
        // }

        // primeHelper.countPrimes(N);

        let previous = allPrimes.length;
        let prime    = allPrimes[allPrimes.length-1];

        primeHelper.getPrimeGroups(MAX_PRIME, (value, count) => {
            if (value > N)
                return false; // Tell caller to stop loop

            if (count !== previous)
            {
                [count, previous] = [count - previous, count];

                assert.equal(count, 1);

                let divisable = Math.floor(N / prime);
                let extra     = divisable.modMul(N-1, MODULO);
                total = (total + extra) % MODULO;
            }

            prime = value+1;
            assert.equal(prime & 1, 1);
        });
    }

    total = (total + total) % MODULO; 

    tracer.clear();

    return total;
}

assert.equal(S(1000000), 855149579);

assert.equal(S(10), 210);
assert.equal(S(100), 37018);
assert.equal(S(1000), 4654406);
assert.equal(S(10000), 529398010);

console.log('Test passed');

console.log(timeLogger.wrap('', _ => S(MAX, true)));
