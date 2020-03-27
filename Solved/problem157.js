const assert  = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX = 9;

const allPrimes = timeLogger.wrap('Loading primes', _ => 
{
    const primeHelper = require('tools/primeHelper')();
    const MAX_PRIME   = 10**MAX;
    
    primeHelper.initialize(MAX_PRIME, true);
    return primeHelper.allPrimes().map(a => BigInt(a));    
});
console.log(`${allPrimes.length} primes loaded`);

function getDivisors(value, callback)
{
    const max = SQRT(value);
    const factors = [];

    for(let p of allPrimes)
    {
        if (p > max || p > value)
            break;

        if (value % p === 0n)
        {
            let f = 1n;
            value /= p;
            while (value % p === 0n)
            {
                f++;
                value /= p;
            }
            factors.push({ prime: p, power: f });
        }
    }

    if (value > 1n)
        factors.push({ prime: value, power: 1n });

    function inner(index)
    {
        callback(factors.reduce((a, v) => a * (v.prime ** v.power), 1n));

        for(let i = index; i < factors.length; i++)
        {
            let v = factors[i];
            let f = v.power;

            for(let p = v.power; p > 0n; p--)
            {
                v.power = p-1n;
                inner(i+1);
            }
            v.power = f;
        }
    }

    inner(0);
}

function SQRT(value)
{
    let max = BigInt(Math.floor(Math.sqrt(Number(value))))+1n;

    while (max*max <= value)
        max++;

    return max;
}

function forEachDivisors(value, callback)
{
    callback(1n);
    if (value > 1n)
        callback(value);

    if (value <= 2n)
        return;

    let max   = SQRT(value);
    let start = 2n;
    let steps = 1n;
    if ((value & 1n) !== 0n)
    {
        start = 3n;
        steps = 2n;
    }

    for(let i = start; i < max; i+=steps)
    {
        if ((value % i) === 0n)
        {
            let res = value / i;
            if (res > i)
                callback(res);

            callback(i);

            if (res < max)
                max = res;
        }
    }
}

function solve(N)
{
    let total = 0;
    for(let n = 1n; n <= N; n++)
    {
        let C = 10n**n;
        let C2= 10n**(n+n);

        getDivisors(C2, (d) =>
        {
            let a = (d + C);
            let b = (C2 / d) + C;

            if (a > b)
                return;

            getDivisors(b, (p) => {
                if ((a % p) === 0n)
                    total++;
            });
        });
    }
    return total;
}

assert.equal(solve(1), 20);
console.log("Test passed");

console.log('solve(4) =', timeLogger.wrap('', _ => solve(4)) );
console.log('solve(5) =', timeLogger.wrap('', _ => solve(6)) );

console.log('Answer is', timeLogger.wrap('', _ => solve(MAX)) );
