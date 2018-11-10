const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLog = require('tools/timeLogger');

require('tools/bigintHelper');

const MAX       = 1E6;
const MAX_PRIME = MAX;//Math.floor(Math.sqrt(MAX));
const MODULO    = 1000000007;
const MODULO_N  = BigInt(MODULO);
const memoize   = new Uint32Array(MAX+1);

function initialize()
{
    primeHelper.initialize(MAX_PRIME, true);
    allPrimes = primeHelper.allPrimes();

    for (let prime of allPrimes)
    {
        memoize[prime] = prime;
    }
}

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

function *triangular()
{
    let current = 0;
    let l = 1;
    while (true)
    {
        current = current+l;
        l = l+1;
        yield current;
    }
}

let max = 17526 * 1E9;
let count = 0;
for(let t of triangular())
{
    if (t > max)
        break;
    if (t === max)
        console.log(max,'is a triangular number');
    count++;
}
console.log(count, "triangle numbers less than", max);

process.exit(0);

timeLog("Initializing", initialize);

assert.equal(F(1, 2),  2);
assert.equal(F(1, 4),  2);
assert.equal(F(1, 18), 6);
assert.equal(F(2, 18),36);

assert.equal(S(1, 10), 41);
assert.equal(S(1, 100), 3512);
assert.equal(S(2, 100), 208090);
assert.equal(S(1, 10000), 35252550);

//console.log("S(1, 1E8) =", S(1, 1E8));
//console.log("S(3, 1E8) =", S(3, 1E8));

//assert.equal(SumS(50, 1E7), 496093261);
//assert.equal(SumS(3, 1E8), 338787512);

console.log('Test passed');

assert.equal(S1(10), S(1, 10));
assert.equal(S1(12), S(1, 12));
assert.equal(S1(100),S(1, 100));

//SumS(50, 1E8);

/*

F(k, n) = F(1, n) ^ k

S(k, n) = F(k, 1) + ... + F(k, n)
Z(k, n) = (F(1, 1) + ... + F(1, n)) + (F(2, 1) + ... + F(2, n)) + ... + (F(k, 1) + ... + F(k, n))
        = (F(1, 1) + F(2, 1) + ... F(k, 1)) + .... ( (F(1, n) + ... F(k, n))
        = (F(1) + F(1)^2 + ... + F(1)^k) + ... + (F(n) + F(n)^2 + ... + F(n)^k)


S = 1+F+...+F^(k-1)
F*S = F+F^2+...+F^k
S = (F^k - 1) / (F - 1)

F*S = (F^k+1 - F) / (F - 1)


1+3+6+8+13+19+26+28+31+41


10 -> 1,2,3,4,5,6,7,8,9,10 = 10*11/2 = 55

4 -> 2 ( 4 & 8)
  -> -2 * 2 -> 55 - 4 = 51
8 -> 1
  -> -4 * 1 -> 51 - 4 = 47
9 -> 1
  -> -6     -> 41


p^n - p => 3^2 - 3 => 9-3 = 6


12 = 2*2*3 => F(12) = 6 so needs to remove 6
12 multiple of 4 so already 2 removeed
need to remove 4 more or add 2 back
*/