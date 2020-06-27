const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const linearRecurrence = require('tools/linearRecurrence');
const Matrix = require('tools/matrix');

const MAX    = 5000000n;
const MODULO = 999999937n;

function calculateRecurrence(a)
{
    const data = [];
    const aa   = Math.sqrt(a);
    const b    = Math.ceil(aa);
    const x1   = b + aa;
    const x2   = b - aa;

    for(let n = 0; n <= 10; n++)
    {
        const t = Math.round(Math.pow(x1, n) + Math.pow(x2, n));
        if (t >= Number.MAX_SAFE_INTEGER)
            break;
        data.push(BigInt(t));
    }

    const l = linearRecurrence(data);

    assert.notEqual(l, undefined);
    assert.equal(l.divisor, 1);
    assert.equal(data[0], 2n);
    assert.equal(data[1], b+b);

    assert.equal(l.factors.length, 2);
    assert.equal(l.factors[0], a - (b*b));
    assert.equal(l.factors[1], b+b);

    return { recurrence: l, data: data.slice(0, l.factors.length) }; // Matrix.fromRecurrence(l.factors);
}

function getRecurrence(a)
{
    const aa = Math.sqrt(Number(a));
    const b  = BigInt(Math.ceil(aa));

    const b1 = (b-1n) ** 2n;
    const b2 = b*b;

    if (b2 < a || b1 > a)
        throw "ERROR";
    
    const r = linearRecurrence({ factors: [ a - b*b, b+b], divisor: 1n });

    return {recurrence: r, data: [2n, b + b ]};
}

function f(a, n)
{
    const { recurrence, data } = getRecurrence(a);

    const matrix = Matrix.fromRecurrence(recurrence.factors);
    const start  = new Matrix(2, 1);

    start.set(0, 0, data[1]);
    start.set(1, 0, data[0]);

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(start, MODULO);

    return v.get(1, 0) - 1n;
}

function G(n)
{
    let total = 0n;

    const tracer = new Tracer(100, true);
    for (let a = 1n; a <= n; a++)
    {
        tracer.print(_ => n-a);
        total = (total + f(a, a * a)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.equal(f(5n, 2n), 27n);
assert.equal(f(5n, 5n), 3935n);
// assert.equal(timeLogger.wrap('', _ => G(1000n, true)), 163861845n);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => G(MAX, true));
console.log(`Answer = ${answer}`);