const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const Matrix = require('tools/matrix-small');

require('tools/numberHelper');

const MODULO = 1000000007
const INV_4 = Number(4).modInv(MODULO);

function G0(N)
{
    N = BigInt(N);
    let total = 0n;

    const tracer = new Tracer(100, true);

    const middle = N/2n;
    for(let k = 0n; k <= middle; k++) {
        tracer.print(_ => middle - k);
        for(let n = k+1n; n <= N-k; n++) {
            const v = (k | n);
            total = (v + v + total);
        }
    }
    tracer.clear();

    if (N & 1n) {
        const a = (N*N - 1n) / 4n;
        total = (total + total + a);
    } else {
        const a = (N*(N+2n)) / 4n;
        total = (total + total + a);
    }

    return total;
}

function G(N)
{
    let total = 0;

    for(let k = 0; k <= N/2; k++) {
        for(let n = k+1; n <= N-k; n++) {
            const v = (k | n);
            total = (v + v + total) % MODULO;
        }
    }

    if (N & 1) {
        const a = (N.modMul(N, MODULO) + MODULO - 1).modMul(INV_4, MODULO);
        total = (total + total + a) % MODULO;
    } else {
        const a = N.modMul(N+2, MODULO).modMul(INV_4, MODULO);
        total = (total + total + a) % MODULO;
    }

    return total;
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

function sum(n) 
{
    n = BigInt(n);

    const under = { count: 1n, sum: 0n };
    const over  = { count: 0n, sum: 0n };

    for(let b = 1n; b <= n; b *= 2n) 
    {
        const v = G0(b);

        if(n & b) 
        {
            under.sum   += under.sum + v * under.count + over.sum;
            under.count += under.count + over.count;
            over.sum    += v * over.count;
        }
        else 
        {
            over.sum   += under.sum   + v * (under.count + over.count) + over.sum;
            over.count += under.count + over.count;
        }
    }

    console.log(n, under.sum, G0(n));
}

sum(Math.floor(Math.random() * 10000)+1);

assert.strictEqual(G(7), 308);
assert.strictEqual(G(10), 754);
assert.strictEqual(G(13), 1574);
assert.strictEqual(G(100), 583766);

console.log('Tests passed');

console.log('2**59 =>', solve(59));
console.log('2**60 =>', solve(60));
