const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/bigintHelper');

const MAX_PRIME = 1000;

const MODULO = 1000000007n;
const TWO = 2n;

const primeHelper = require('tools/primeHelper')(MAX_PRIME);
const allPrimes = primeHelper.allPrimes();
const primes = allPrimes.map(p => BigInt(p) ** 5n); 

// extended euclidean algorithm for 2^a-1, 2^b-1
function extendedEuclidean(a, b)
{
    let r = { a: BigInt(a), b: BigInt(b) };
    let s = { a: 1n, b: 0n };
    let t = { a: 0n, b: 1n };

    let cycles = 0n;

    while (r.b != 0n) {
        const q = {
            a: TWO.modPow(r.a, MODULO),
            b: TWO.modPow(r.a % r.b, MODULO),
            c: ((TWO.modPow(r.b, MODULO) + MODULO - 1n) %  MODULO),
        };

        const factor = (q.a - q.b + MODULO).modDiv(q.c, MODULO);

        [r.a, r.b] = [r.b, r.a % r.b];
        [s.a, s.b] = [s.b, (s.a - factor.modMul(s.b, MODULO) + MODULO) % MODULO];
        [t.a, t.b] = [t.b, (t.a - factor.modMul(t.b, MODULO) + MODULO) % MODULO];

        cycles++;
    }

    return { a: s.a, b: t.a, cycles };
}

function P(a, b)
{    
    a = BigInt(a);
    b = BigInt(b);

    const x = (a + 1n).modDiv(a, a+b);
    const y = (b + 1n).modDiv(b, a+b);

    let steps;
    let choice;

    if (x < y) {
        steps = (x * 2n - 4n) % MODULO;
        choice = 'A';
    } else {
        steps = (y * 2n - 4n) % MODULO;
        choice = 'B';
    }

    return { steps: steps, choice };
}

function solve()
{
    let total = 0n;

    const tracer = new Tracer(1, true);
    for(let i = 0; i < primes.length; i++)
    {
        tracer.print(_ => primes.length - i);
        for(let j = i+1; j < primes.length; j++) 
        {
            const p = primes[i];
            const q = primes[j];

            const { a, b, cycles } = extendedEuclidean(p, q);
            const factor = ((cycles % 2n) ? b-a-1n+MODULO : a-b-1n+MODULO) % MODULO;
            total = (total + TWO.modMul(factor, MODULO)) % MODULO;
        }
    }

    tracer.clear();
    return total;
}

assert.strictEqual(P(3n, 5n).steps, 4n);
assert.strictEqual(P(7n, 31n).steps, 20n);
assert.strictEqual(P(1234n, 4321n).steps, 2780n);
assert.strictEqual(P(7n, 127n).steps, 36n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
