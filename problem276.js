// Primitive Triangles
// -------------------
// Problem 276
// -----------
// Consider the triangles with integer sides a, b and c with a ≤ b ≤ c.
// An integer sided triangle (a,b,c) is called primitive if gcd(a,b,c)=1.
// How many primitive integer sided triangles exist with a perimeter not exceeding 10 000 000?

const primeHelper = require('tools/primeHelper')();
const bigInt = require('big-integer');

const MAX = 10000000;

const MAXA = Math.floor(MAX / 3);

primeHelper.initialize(MAX);

const allPrimes = primeHelper.allPrimes();
const usedPrimes = [];

function factorize(n)
{
    if (n === 1)
        return [];

    if (primeHelper.isPrime(n))
        return [n];

    let primes = [];

    for (let p of allPrimes)
    {
        if (p > n)
            break;
        if (n % p === 0)
        {
            primes.push(p);
            while (n % p === 0)
                n /= p;
            if (n === 1)
                break;
            if (primeHelper.isPrime(n))
                break;
        }
    }

    if (n !== 1)
        primes.push(n);

    return primes;
}

function *generate(min, max)
{
    function *inner(value, index)
    {
        if (value >= min && value <= max)
            yield value;

        for (let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p;
            if (v > max)
                break;

            if (usedPrimes[p] < 2)
            {
                usedPrimes[p]++;

                try
                {
                    while (v <= max)
                    {
                        yield *inner(v, i+1);
                        v *= p
                    }
                }
                finally
                {
                    usedPrimes[p]--;
                }
            }
        }
    }

    yield *inner(1, 0);
}

function solve()
{
    let total = 0;
    let extra = bigInt.zero;

    for (let p of allPrimes)
        usedPrimes[p] = 0;

    for (let c = MAX-2; c > 0; c--)
    {
        process.stdout.write('\r'+c);
        process.stdout.write(' ');

        let primes = factorize(c);

        for (let p of primes)
            usedPrimes[p] = 1;

        let maxA = Math.min(MAXA, Math.floor((MAX-c)/2));

        for (let a of generate(1, maxA))
        {
            let maxB = MAX-c-a;
            for (let b of generate(a, maxB))
            {
                let t = total+1;
                if (t > Number.MAX_SAFE_INTEGER)
                {
                    extra = extra.plus(total).plus(1);
                    total = 0;
                }
                else
                    total = t;
            }
        }

        for (let p of primes)
            usedPrimes[p] = 0;
    }

    console.log('');
    return extra.plus(total).toString();
}

let answer = solve();
console.log("Answer is", answer);