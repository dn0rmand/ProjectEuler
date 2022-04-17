const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const divisors = require('@dn0rmand/project-euler-tools/src/divisors');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

const MODULO = 1000000007
const MAX = 1e14

require('@dn0rmand/project-euler-tools/src/numberHelper');

primeHelper.initialize(Math.floor(Math.sqrt(MAX))+1);

const squares = timeLogger.wrap('loading Squares', _ => {
    const squares = [];

    for(let i = 2; ; i++) {
        const i2 = i*i;
        if (i2 > MAX) break;
        squares.push(i2);
    }

    return squares;
});

function forDivisors(N, callback)
{
    const primes = [];
    const powers = [];

    primeHelper.factorize(Math.sqrt(N), (p, f) => {
        primes.push(p);
        powers.push(f);
    });
}

function solve(N, trace)
{
    let total = N % MODULO;

    const tracer = new Tracer(10000, trace);
    const values = new Map();

    for(let i = 0; i < squares.length; i++)
    {
        const s1 = squares[i];
        if (s1 > N)
            break;

        tracer.print(_ => N-s1);

        const count = Math.floor(N / s1);
        let value = s1-1;

        divisors(Math.sqrt(s1), primeHelper.isKnownPrime, d => {
            d *= d;
            if (d === 1 || d === s1) 
                return;

            if (values.has(d)) {
                value -= values.get(d);
            }
        });

        if (value < 0) throw "ERROR";

        values.set(s1, value);
        total = (total + count*value) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(solve(10), 24);
assert.strictEqual(solve(100), 767);
assert.strictEqual(solve(1E6), 725086120);

console.log('Tests passed');

console.log(timeLogger.wrap('', _ => solve(1E14, true)));