const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Matrix = require('tools/matrix');

const linearRecurrence = require('tools/linearRecurrence');

const MODULO = 1307674368000n;
const MAX    = 1E15;

if (MAX > Number.MAX_SAFE_INTEGER)
    throw "ERROR";

const fibs = (function()
{    
    let f0 = 0n, f1 = 1n;
    let values = [];

    while (values.length < 200)
    {
        values.push(f0);
        [f0, f1] = [f1, (f0+f1)];
    }
    return values;
})();

function F(n, x, modulo)
{
    x = BigInt(x);
    let v = 0n;
    for(let p = 1n; p <= n; p++)
    {
        let xx = x ** p;
        v += fibs[p] * xx;
        if (modulo)
            v %= modulo;
    }

    return v;
}

function S(n)
{
    let total = 0n;

    for(let x = 0; x < 100; x++)
        total += F(n, x);

    return total;
}

function solve()
{
    function fibSum(n)
    {
        let FIBMATRIX = new Matrix(2, 2);
        FIBMATRIX.set(0, 0, 1n);
        FIBMATRIX.set(0, 1, 1n);
        FIBMATRIX.set(1, 0, 1n);
        FIBMATRIX = FIBMATRIX.pow(n+2, MODULO);

        let zero = new Matrix(2, 1);
        zero.set(0, 0, 1n)
        zero.set(1, 0, 0n);

        zero = FIBMATRIX.multiply(zero, MODULO);

        let v = zero.get(1, 0)-1n;
        if (v < 0)
            v += MODULO;
        return v;
    } 

    let total = fibSum(MAX);

    for(let x = 2; x <= 100; x++)
    {
        const values = [];

        for(n = 1; n < 100; n++)
            values.push(F(n, x));
    
        const l = linearRecurrence(values);

        if (! l.factors || l.divisor !== 1n)
            throw "ERROR";

        let m = Matrix.fromRecurrence(l.factors);
        const id = new Matrix(m.rows, 1);
        id.set(0, 0, values[2]);
        id.set(1, 0, values[1]);
        id.set(2, 0, values[0]);
        
        m = m.pow(MAX-1, MODULO);
        const v = m.multiply(id, MODULO).get(m.rows-1, 0);

        total = (total+v) % MODULO;
    }

    return total;
}

assert.equal(F(7, 11), 268357683);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);