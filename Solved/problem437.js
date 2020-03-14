const assert      = require('assert');
const primeHelper = require('tools/primeHelper')();
const fibonacci   = require('tools/fibonacci');
const divisors    = require('tools/divisors');
const time        = require('tools/timeLogger');

const MAX = 100000000;
    
const allPrimes = time.wrap('Loading primes', () => 
{
    primeHelper.initialize(MAX, true);
    return primeHelper.allPrimes().reduce((a, p) => 
    {
        if (p % 10 === 1 || p % 10 === 9)
            a.push(p);
        return a;
    }, []);
});

function solve(max, trace) 
{
    let total = max > 5 ? 5 : 0;
    const primes = allPrimes.slice().reverse().filter(p => p < max);
    let traceCount = 0;
    for (const p of primes) 
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${p} `);
            if (traceCount++ >= 10000)
                traceCount = 0;
        }

        const { f0, f1 } = fibonacci(p - 1, p);
        if (f0 === 0 && f1 === 1)
        {
            total += p;

            for(const d of divisors(p-1, primeHelper.isPrime))
            {
                if (d === 1 || d === p-1)
                    continue;

                const { f0, f1 } = fibonacci(d, p);
                if (f0 === 0 && f1 === 1)
                {
                    total -= p;
                    break;
                }
            }
        }
    }

    if (trace)
        process.stdout.write('\r             \r');
    return total;
}

assert.equal(time.wrap('', () => solve(10000)), 1480491);
console.log('Test passed');

const answer = time.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);