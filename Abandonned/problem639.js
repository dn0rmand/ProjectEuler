const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLog = require('tools/timeLogger');
const polynomial = require('tools/polynomial');

require('tools/bigintHelper');

const MAX       = 1E6;
const MAX_PRIME = MAX;//Math.floor(Math.sqrt(MAX));
const MODULO    = 1000000007;
const MODULO_N  = BigInt(MODULO);
const memoize   = new Uint32Array(MAX+1);

timeLog.wrap('Initializing', _ => {
    primeHelper.initialize(MAX_PRIME, true);
    allPrimes = primeHelper.allPrimes();

    for (let prime of allPrimes)
    {
        memoize[prime] = prime;
    }
});

function F1(n)
{
    let result = memoize[n];
    if (result !== 0)
        return result;

    result = n; // default in case n is prime
    let value  = n;

    for (let p of allPrimes)
    {
        if (p > value)
            break;
        if (value % p === 0)
        {
            do
            {
                value /= p;
            }
            while (value % p === 0);

            if (value > 1)
                result = p * F1(value);
            else
                result = p;
            break;
        }
    }

    memoize[n] = result;

    return result;
}

function F(k, n)
{
    let result = F1(n);

    if (k > 1)
        result = Number(BigInt(result).modPow(k, MODULO_N));
    return result;
}

function triangle(n)
{
    if (typeof(n) !== 'number')
        n = Number(n);

    if ((n & 1) === 1)
    {
        let v1 = BigInt(n);
        let v2 = BigInt((n+1) >> 1);
        return v1 * v2;
    }
    else
    {
        let v1 = BigInt(n >> 1);
        let v2 = BigInt(n+1);
        return v1 * v2;
    }
}

function S1(n)
{
    console.log('S( 1,',n,')')
    let total = triangle(n);
    n = BigInt(n);

    function inner(value, P, index)
    {
        for (let i = index; i < allPrimes.length; i++)
        {
            let prime    = BigInt(allPrimes[i]);
            let previous = P * prime;
            let current  = prime * value;

            if (current > n)
                break;

            while (current <= n)
            {
                let count = (n - (n % current)) / current;

                if (current == 12)
                    console.log('Removing', count, '*', (current - previous), '( multiples of', current,')');
                total -= (count * (current - previous));

                inner(current, previous, i+1);

                previous = current * prime;
                current  = current * prime;
            }
        }
    }

    for (let i = 0; i < allPrimes.length; i++)
    {
        let prime = BigInt(allPrimes[i]);
        let current = prime*prime;
        if (current > n)
            break;
        let count = (n - (n % current)) / current;

        console.log('Removing', count, '*', (current - prime), '( multiples of', current,')');
        total -= (count * (current - prime));
        inner(current, prime, 0);
    }
    return total;
}

function S(k, n)
{
    let result = 1;

    for (let i = 2; i <= n; i++)
    {
        result = (result + F(k, i)) % MODULO;
    }

    return result;
}

function SumS(K, N)
{
    return timeLog("Calculating SumS("+K+","+N+") ..", () =>
    {
        let result  = K;

        for (let n = 2; n <= N; n++)
        {
            let F  = F1(n);
            let FF = BigInt(F);
            let f  = 1;

            for (let k = 1; k <= K; k++)
            {
                let ff = (f * F);
                if (ff > Number.MAX_SAFE_INTEGER)
                    f = Number( ( BigInt(f) * FF ) % MODULO_N );
                else
                    f = ff % MODULO;
                result = (result + f) % MODULO;
            }
        }
        console.log("SumS("+K+","+N+") =", result);
        return result;
    });
}

function analyze(k)
{
    const p = polynomial.findPolynomial(1, 1, x => S(k, x));
    console.log(p);
}

analyze(2);
analyze(3);
analyze(4);
process.exit(0);

assert.equal(F(1, 2),  2);
assert.equal(F(1, 4),  2);
assert.equal(F(1, 18), 6);
assert.equal(F(2, 18),36);

assert.equal(S(1, 10), 41);
assert.equal(S(1, 100), 3512);
assert.equal(S(2, 100), 208090);
assert.equal(S(1, 10000), 35252550);

console.log('Test passed');

const answer = SumS(50, MAX);
console.log(`Answer is ${answer}`);
