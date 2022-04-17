const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const linearRecurrence = require('@dn0rmand/project-euler-tools/src/linearRecurrence');
const Matrix = require('@dn0rmand/project-euler-tools/src/matrix');

const BIG = a => BigInt(a);

const MAX    = 5000000;
const MODULO = 999999937;

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

    const matrix = Matrix.fromRecurrence(recurrence.factors);
    const start  = new Matrix(2, 1);

    start.set(0, 0, BIG(data[1]));
    start.set(1, 0, BIG(data[0]));
    if (n === 1)
        return data[1];

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(start, MODULO);

    return Number(v.get(1, 0)) - one;
}

function G(n)
{
    let total = 0;

    const tracer = new Tracer(5000, true);
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

`
let b=⌈√a⌉, x1=b+√a and x2=b−√a then f(a,n)=⌊x1^n⌋ 

To find it, notice that the sequence tn = x1^n + x2^n is always an integer and 0 < x2^n < 1, so f(a, n) = tn − 1
`