const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer = require('tools/tracer');

primeHelper.initialize(1E8);

function f(k, n)
{
    let value = 0;

    primeHelper.factorize(n, (p, alpha) => {
        value = (alpha - 1) / (p ** k);
        return false;
    });

    return value;
}

function solve()
{
    let P = 1
    let ans = 0
    const primes = primeHelper.allPrimes();
    const maxP = primes[primes.length-1];

    const tracer = new Tracer(1, true);

    for(const p of primes) 
    {
        tracer.print(_ => maxP - p);
        ans += P / (p * (p-1) * (p-1));
        P   *= (p - 1) / p;
    }

    tracer.clear()
    return ans.toFixed(12);
}

console.log(solve());
