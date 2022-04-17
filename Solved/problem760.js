const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const Matrix = require('@dn0rmand/project-euler-tools/src/matrix-small');

require('@dn0rmand/project-euler-tools/src/numberHelper');
require('@dn0rmand/project-euler-tools/src/bigintHelper');

const MODULO = 1000000007
const MAX = 10n ** 18n;
const MODULO_N = 1000000007n

function memoize(f)
{
    const $f = new Map();

    function ff(n)
    {
        let r = $f.get(n);
        if (r !== undefined)
            return r;

        r = f(n);
        $f.set(n, r);
        return r;
    }

    return ff;
}

const fand = memoize(function(n)
{
    if (n === 0n || n === 1n) return 0n;
    if (n & 1n) {
        const k = (n-1n) / 2n;
        return (4n * fand(k)) % MODULO_N;
    } else {
        const k = n / 2n;
        return (2n * fand(k - 1n) + 2n * fand(k) + k) % MODULO_N;
    }
});

const Gand = memoize(function(N)
{
    if (N === 0n || N === 1n) 
        return 0n;

    if (N & 1n) {
        const k = (N-1n) / 2n;
        return (8n * Gand(k-1n) + 6n * fand(k) + (k*(k+1n))/2n) % MODULO_N;
    } else {
        const k = N / 2n;
        return (8n * Gand(k-1n) + 2n * fand(k) + (k*(k+1n))/2n) % MODULO_N;
    }
});

const fxor = memoize(function(n)
{
    if (n === 0n)
        return 0n;
    if (n === 2n)
        return 2n;

    if (n & 1n) {
        const k = (n-1n) / 2n;
        return (4n * fxor(k) + k + 1n) % MODULO_N;
    }
    else {
        const k = n / 2n;
        return (2n * fxor(k) + 2n * fxor(k-1n)) % MODULO_N;
    }
});

const Gxor = memoize(function(N)
{
    if (N === 0n)
        return 0n;
    if (N === 1n)
        return 2n;

    if (N & 1n) {
        const k = (N-1n) / 2n;
        return (12n * fxor(k) + 8n * Gxor(k-1n) +  (k+2n)*(k+1n)) % MODULO_N;    
    } else {
        const k = N / 2n;
        return (4n * fxor(k) + 8n * Gxor(k-1n) + k * (k+1n)) % MODULO_N;
    }
});

function G(N)
{
    N = BigInt(N);
    let total = Gand(N) + Gxor(N);
    return Number((2n * total) % MODULO_N);
}

function solve(n)
{
    let m = Matrix.fromRecurrence([-128, 176, -84, 16]);
    const id = new Matrix(4, 1);
    id.set(0, 0, G(2**3))
    id.set(1, 0, G(2**2))
    id.set(2, 0, G(2**1))
    id.set(3, 0, G(2**0))

    m = m.pow(n, MODULO);
    const v = m.multiply(id, MODULO)

    return v.get(m.rows-1, 0);
}

assert.strictEqual(G(7), 308);
assert.strictEqual(G(10), 754);
assert.strictEqual(G(13), 1574);
assert.strictEqual(G(100), 583766);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(MAX));
console.log(`Answer is ${answer}`);