const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

const MAX       = 1E14;
const MAX_PRIME = 1E7;

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes();

// A061142: http://oeis.org/A061142
function f(n)
{
    let total = 1;

    primeHelper.factorize(n, (p, f) => {
        total *= (2**f);
    });

    return total;
}

// A069205: http://oeis.org/A069205
function S1(n, trace)
{
    let total = 0;
    let traceCount = 0;

    for(let i = 1; i <= n; i++)
    {
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${n-i}   `);
            if (++traceCount > 1000)
                traceCount = 0;
        }

        total += f(i);
    }
    return total;
}

function S(n, trace)
{
    const MAX_DEEP = 4;

    let total    = 0n;
    let root     = Math.ceil(Math.sqrt(n));
    let maxPrime = allPrimes[allPrimes.length-1];
    let traceMessage = "\r";

    function inner(value, index, power, deep)
    {  
        if (value <= n)
        {
            let v = BigInt(2 ** power);
            total += v;
            let m = Math.floor(n / value);  
            if (m > maxPrime)
            {
                let c = primeHelper.countPrimes(m, true) - allPrimes.length;                
                total += BigInt(c) * (v*2n);
                if (trace)
                    process.stdout.write(traceMessage+'          ');
            }
        }

        let t;
        
        if (deep < MAX_DEEP)
            t = traceMessage;

        for(let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p;
            let f = 1;

            if (v > n)
                break;

            while (v <= n)
            {
                if (trace && deep < MAX_DEEP && p <= root)
                {
                    traceMessage = t + ` ${p}^${f}`;
                    process.stdout.write(traceMessage+'          ');
                }
                
                inner(v, i+1, power+f, deep+1);
                v *= p;
                f++;
            }
        }

        if (deep < MAX_DEEP)
            traceMessage = t;
    }

    inner(1, 0, 0, 0);

    if (trace)
        process.stdout.write('\r                                   \r');

    return total;
}

assert.equal(f(90), 16);

// assert.equal(timeLogger.wrap('', _ => S1(1E8, true)), 9613563919);
assert.equal(timeLogger.wrap('', _ => S(1E8, true)), 9613563919);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);
if (answer > Number.MAX_SAFE_INTEGER)
    console.log('Answer is too big');