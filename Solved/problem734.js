const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MAX_PRIME = 1E6;
const MAX_K = 999983;
const MODULO = 1000000007;

primeHelper.initialize(MAX_PRIME);

const primeMap = (function() {
    const map = new Uint8Array(MAX_PRIME+1);
    for(let p of primeHelper.allPrimes())
        map[p] = 1;

    return map;
})();

let $f = [];
let $pow = [];

function pow(primes, k)
{
    if ($pow[primes] < 0)
        $pow[primes] = primes.modPow(k, MODULO) + MODULO;

    return $pow[primes];
}

function f(value, k)
{
    let subtract = 0;
    let primes = primeMap[value] ? 1 : 0;

    for(let bits = (value & (value-1)); bits !== 0; bits = (value & (bits-1)))
    {
        if (primeMap[bits])
            primes++;

        subtract += $f[bits];
    }

    subtract %= MODULO;

    const total = (pow(primes, k) - subtract) % MODULO;

    $f[value] = total;

    return total;
}

function T(n, k, trace)
{
    // clear memoization because k might be different

    $pow = new Int32Array(MAX_PRIME);
    $pow.fill(-1);

    $f = new Int32Array(MAX_PRIME);
    $f[2] = 1;

    //

    const tracer = new Tracer(3000, trace);

    let total = $f[2];

    for(let p = 3; p <= n; p += 2)
    {
        tracer.print(_ => n - p);

        const t = f(p, k);
        if (primeMap[p])
        {
            total = (total + t);
        }
    }

    tracer.clear();
    return total % MODULO;
}

assert.strictEqual(T(5, 2), 5);
assert.strictEqual(T(100, 3), 3355);
assert.strictEqual(T(1000, 10), 2071632);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => T(MAX_PRIME, MAX_K, true));
console.log(`Answer is ${answer}`);
