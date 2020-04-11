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

function factorize(value, callback)
{
    if (value <= Number.MAX_SAFE_INTEGER)
    {
        primeHelper.factorize(Number(value), callback);
        return;
    }

    let max = BigInt(Math.floor(Math.sqrt(Number(value)))+1);

    for(let p of allPrimes)
    {
        if (p > value || p > max)
            break;

        if (value % p === 0n)
        {
            let f = 1;
            value /= p;
            while (value % p === 0n)
            {
                f++;
                value /= p;
            }
            callback(p, f);
            if (value === 1)
                break;
            if (value <= Number.MAX_SAFE_INTEGER && primeHelper.isKnownPrime(Number(value)))
                break;
        }
    }
    if (value !== 1n)
        callback(value, 1);
}

function isAchilles(value)
{
    let gcdFactors = 1;
    let count      = 0;
    let good       = true;

    factorize(value, (_, f) => {
        if (f < 2)
        {
            good = false;
            return false;
        }

        if (count === 0)
            gcdFactors = f;
        else
            gcdFactors = gcdFactors.gcd(f);

        count++;
    });

    good = good && count > 1 && gcdFactors === 1;

    return good;
}

function solve(max, trace)
{
    max = BigInt(max);

    let total  = 0;

    function otherPrimes(maxPrime, value, factor, phi)
    {
        if (value >= max)
            return;

        if (factor === 1 && isAchilles(phi))
        {
            total++;
        }

        for(let p of allPrimes)
        {
            if (p >= maxPrime)
                break;

            let v = value * p * p;
            let f = 2;
            let phi2 = phi * (p-1n) * p;
            if (v >= max)
                break;

            while (v < max)
            {
                otherPrimes(p, v, factor.gcd(f), phi2);

                f++;
                v *= p;
                phi2 *= p;
            }
        }
    }

    function firstPrime()
    {
        const tracer = new Tracer(100, trace);
        const maximus = allPrimes[allPrimes.length-1];
        for(let p of allPrimes)
        {
            let v = p*p*p;
            let f = 3;
    
            if (v >= max)
                break;

            tracer.print(_ => maximus - p);

            let phi = (p-1n)*p*p;

            while (v < max)
            {
                otherPrimes(p, v, f, phi);

                f += 1;
                v *= p;
                phi *= p;
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
