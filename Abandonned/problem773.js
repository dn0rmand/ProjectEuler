const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const MODULO = 1000000007;

const MAX_PRIME = 1E4;
primeHelper.initialize(MAX_PRIME);

function S(k)
{
    const primes = [2, 5];

    for(const p of primeHelper.allPrimes()) {
        if ((p % 10) === 7) {
            primes.push(p);
            k--;
            if (k === 0) {
                break;
            }
        }
    }
    if (k !== 0) { 
        throw "Not enough primes";
    }
    return primes;
}

function N(primes)
{
    let n = 1;

    for(let p of primes) {
        n *= p;
    }

    if (n > Number.MAX_SAFE_INTEGER) {
        throw "Too Big";
    }
    return n;
}

function F(k, max, callback)
{
    const primes = S(k);

    max = max || N(primes); 
    callback = callback || (value => value);

    let total = 0;

    const tracer = new Tracer(1, true);

    for(let current = 27; current <= max; current += 10) {
        tracer.print(_ => max - current);
        if (!primes.some(p => current % p === 0)) {
            callback(current);
            total = (total + current) % MODULO;
        }
    }
    tracer.clear();

    return total;
}

assert.strictEqual(F(3), 76101452);
console.log('Test passed');

const values = [];
const answer = F(97, 1E5, value => {
    values.push((value-7)/10);
});
const l = require('tools/linearRecurrence');
l(values, true);
// const answer = timeLogger.wrap('', _ => F(97, 1E7));
console.log(`Answer is ${answer}`);