const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const linearRecurrence = require('tools/linearRecurrence');
const Matrix = require('tools/matrix');

const MAX    = 5000000;
const MODULO = 999999937;
const MODULO_N = BigInt(MODULO);

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

    return { recurrence: l, data: data.slice(0, l.factors.length) };
}

function getRecurrence(a)
{
    const aa = Math.sqrt(a);
    const b  = Math.ceil(aa);

    const r = linearRecurrence({ factors: [ a - b*b, b+b], divisor: 1 });

    return { recurrence: r, data: [2, b + b ], one: b === aa ? 0 : 1 };
}

function f(a, n)
{
    const { recurrence, data, one } = getRecurrence(a);

    const matrix = Matrix.fromRecurrence(recurrence.factors.map(a => BigInt(a)));
    const start  = new Matrix(2, 1);

    start.set(0, 0, BigInt(data[1]));
    start.set(1, 0, BigInt(data[0]));

    if (n === 1)
        return data[1];

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(start, MODULO);

    return Number(v.get(1, 0)) - one;
}

function G(n)
{
    let total = 0;

    const tracer = new Tracer(1000, true);
    for (let a = 1; a <= n; a++)
    {
        tracer.print(_ => n-a);
        total = (total + f(a, a * a)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.equal(f(5, 2), 27);
assert.equal(f(5, 5), 3935);
assert.equal(timeLogger.wrap('', _ => G(1000)), 163861845);

console.log("Tests passed");

const answer = timeLogger.wrap('', _ => G(MAX));
console.log(`Answer = ${answer}`);