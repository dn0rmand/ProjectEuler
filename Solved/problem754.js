const MAX = 1E8;
const MODULO = 1000000007;

require('tools/numberHelper');

const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const primeHelper = require('tools/primeHelper')(MAX);

function divisorsAndMobius(n, callback)
{
    const primes = [];
    primeHelper.factorize(n, (p) => primes.push(p));

    function inner(d, μ, index) 
    {
        callback(d, μ);

        for(let i = index; i < primes.length; i++) {
            const p = primes[i];
            const v = p * d;
            if (v > n) break;

            inner(v, -μ, i+1);
        }
    }

    inner(1, 1, 0);
}

function c(N, n)
{
    let total = 0;

    divisorsAndMobius(n, (d, μ) => {
        const nd = Math.floor((N - n)/d);
        total += (μ * nd) ;
    });

    if (total > Number.MAX_SAFE_INTEGER) {
        throw "TOO BIG";
    }
    return total;
}

function G(n, trace)
{
    const tracer = new Tracer(10000, trace);

    let total = 1;

    for(let i = 2; i <= n; i++) {
        tracer.print(_ => n-i);
        const C = c(n, i);
        if (C) {
            total = total.modMul(i.modPow(C, MODULO), MODULO);
        }
    }
    tracer.clear();

    return total;
}

assert.strictEqual(G(10), 331358692);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => G(MAX, true));
console.log(`Answer is ${answer}`);
