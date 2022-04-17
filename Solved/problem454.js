const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MAX = 1E12;
const MAX_PRIME = 1E6;

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes();

// Calculated pairs a,b such that gcd(a,b) = 1.Then for each pair ans+=L/(a+b)

function generateCoprime(max, callback, trace)
{
    const usedPrimes = [];

    function innerB(A, B, index)
    {
        if (B >= A)
            return;

        callback(A, B);

        for(let i = index; i < allPrimes.length; i++)
        {
            if (usedPrimes[i])
                continue;

            const p = allPrimes[i];
            let b = B * p;
            if (b >= A)
                break;

            while (b < A)
            {
                innerB(A, b, i+1);
                b *= p;
            }
        }
    }

    function innerA(A, index)
    {
        if (A > max)
            return;

        innerB(A, 1, 0);

        const tracer = new Tracer(1, trace);

        for(let i = index; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];

            let a = A * p;
            if (a > max)
                break;

            usedPrimes[i] = 1;
            let f = 1;
            while (a <= max)
            {
                tracer.print(_ => f > 1 ? `${p}^${f}` : p);

                innerA(a, i+1);
                a *= p;
                f++;
            }
            usedPrimes[i] = 0;
        }

        tracer.clear();
    }

    innerA(1, 0);
}

function F(L, trace)
{
    let total = 0;
    const maxb = Math.floor(Math.sqrt(L));

    generateCoprime(maxb, (b, a) => {
        const v = Math.floor(L / ((a+b)*b));
        total += v;
    }, trace);
    return total;
}

assert.equal(F(1000), 1069);
assert.equal(F(15), 4);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => F(MAX, true));
console.log(`Answer is ${answer} ( 5435004633092 )`);
