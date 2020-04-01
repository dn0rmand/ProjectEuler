const assert      = require('assert');
const timeLogger  = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();
const BigSet      = require('tools/BigSet');

require('tools/numberHelper');

const MAX       = 5 * 1e15;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX)); // 1e9; //   

timeLogger.wrap('Loading Primes', _ => primeHelper.initialize(MAX_PRIME));

function bruteForce(max)
{
    const values = [];

    max = BigInt(max);

    for(let x = 2n; x < max; x++)
    for(let y = 1n; y < x; y++)
    {
        const top = x**4n - y**4n;
        const bottom = x**3n + y**3n;

        if (top % bottom === 0n)
        {
            const v = Number(top / bottom);
            if (primeHelper.isKnownPrime(v))
                values.push(v);
        }
    }

    console.log(values.join(', '));
}

// bruteForce(10000);

// A027862 - Primes of the form n^2 + (n+1)^2.
function solve(max)
{
    let traceCount = 0;
    let total = 0;

    const MAX_N = Math.ceil(Math.sqrt(Math.ceil(max/2)));

    for(let n = 1; n <= MAX_N; n++)
    {
        const p = (n**2) + ((n+1)**2);
        if (p >= max)
            break;

        if (traceCount === 0)
            process.stdout.write(`\r${MAX_N-n}   `);
        if (++traceCount >= 10000)
            traceCount = 0;
            
        if (primeHelper.likelyPrime(p))
            total++;
    }

    return total;
}

const answer  = timeLogger.wrap('', _ => solve(MAX));

console.log(`Answer is ${answer}`);