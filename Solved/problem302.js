const assert      = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer      = require('tools/tracer');
const timeLogger  = require('tools/timeLogger');

require('tools/numberHelper');

const POWER     = 18;
const MAX       = 10n ** BigInt(POWER);
const MAX_PRIME = 10  ** (POWER/3);

timeLogger.wrap('Loading Primes', _=> { primeHelper.initialize(MAX_PRIME, true); });

const allPrimes = timeLogger.wrap('Converting primes to BigInt', _ => primeHelper.allPrimes().map(v => BigInt(v)));

const $factorize = {};

function factorize(p1)
{
    p1 = Number(p1);

    if ($factorize[p1])
        return $factorize[p1];

    const factors = [];

    primeHelper.factorize(p1, (p, f) => {
        factors[p] = f;
    });

    $factorize[p1] = factors;
    return factors;
}

function mergeFactorization(p1, previous)
{
    let factors = { ...previous };
    p1 = factorize(p1);

    for (const p in p1)
        factors[p] = (factors[p] || 0) + p1[p];

    return factors;
}

function isAchilles(factors)
{
    let g = 0;

    for(let v of Object.values(factors))
    {
        if (v < 2)
            return false;
            
        if (g === 0) 
        {
            g = v;
        }
        else if (g !== 1)
        {
            g = g.gcd(v);
        }
    }

    return g === 1;
}

function solve(max, trace)
{
    max = BigInt(max);

    let total  = 0;

    function otherPrimes(maxPrime, value, factor, phiFactors)
    {
        if (value >= max)
            return;

        if (factor === 1 && isAchilles(phiFactors))
        {
            total++;
        }

        for(let p of allPrimes)
        {
            if (p >= maxPrime)
                break;

            let v = value * p * p;
            let f = 2;

            let factors = mergeFactorization(p-1n, phiFactors);
            factors[p] = (factors[p] || 0) + 1;

            if (v >= max)
                break;

            while (v < max)
            {
                otherPrimes(p, v, factor.gcd(f), factors);

                f++;
                v *= p;
                factors[p] += 1;
            }
        }
    }

    function firstPrime()
    {
        const tracer = new Tracer(10, trace);
        const maximus = allPrimes[allPrimes.length-1];
        for(let p of allPrimes)
        {
            let v = p*p*p;
            let f = 3;
    
            if (v >= max)
                break;

            tracer.print(_ => maximus - p);

            let phiFactors = {};

            phiFactors[p] = 2;
            phiFactors = mergeFactorization(p-1n, phiFactors);
            
            while (v < max)
            {
                otherPrimes(p, v, f, phiFactors);

                f += 1;
                v *= p;
                phiFactors[p] += 1;
            }
        }
    
        tracer.clear();    
    }

    firstPrime();

    return total;
}

assert.equal(solve(1E4), 7);
assert.equal(solve(1E8), 656);
console.log("Tests passed");

const answer = timeLogger.wrap('Solving', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
