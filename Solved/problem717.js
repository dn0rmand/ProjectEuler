const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/bigintHelper');

const MAX = 1E7;

primeHelper.initialize(MAX);

const primes = primeHelper.allPrimes().reduce((a, p) => {
    if (p !== 2)
        a.push(BigInt(p));
    return a;
}, []);

const TWO = 2n;

function f(p)
{
    const pow     = TWO ** p;
    const pow_1   = (TWO ** (p-1n));
    const divisor = pow_1 - ((pow_1 - 1n)/p);
    const minus   = TWO.modPow(TWO.modPow(p, p-1n), p); 
    const result  = ((pow - minus) * divisor) % pow;

    return result;
}

function g(p)
{
    const pp     = p * p;
    const pow    = TWO.modPow(p, pp);
    const minus  = TWO.modPow(TWO.modPow(p, p-1n), p);
    const k      = (minus & 1n) ? (minus+p)/TWO : minus/TWO;
    const result = ((k * pow) % pp - minus) / p;

    return Number(result % p);
}

function G(n, trace)
{
    n = BigInt(n);

    let total = 0;
    
    const tracer = new Tracer(10000, trace);
    for(const prime of primes)
    {
        if (prime > n)
            break;
        
        tracer.print(_ => n-prime);
        total += g(prime);
    }
    tracer.clear();
    return total;
}

assert.equal(f(3n), 5);
assert.equal(g(31n), 17);

assert.equal(G(100),  474);
assert.equal(G(1E4), 2819236);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(MAX, true));
console.log(`Answer is ${answer}`);