const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const linearRecurrence = require('tools/linearRecurrence');
const Matrix = require('tools/matrix-small');

const MAX = 10n**18n;
const MODULO = 7**9;

function M(n)
{
    const bowls = new Uint32Array(n);

    bowls.fill(1);

    let steps = 0;
    let currentBowl = 0;

    do {
        steps++;
        const beans = bowls[currentBowl];
        bowls[currentBowl] = 0;
        for(let b = 1; b <= beans; b++) {
            currentBowl = (currentBowl+1) % bowls.length;
            bowls[currentBowl] += 1;
        }
    } while(! bowls.every(v => v === 1));

    return steps;
}

function solve(max)
{
    let total = 0;
    const values = [];
    for(let k = 0; k < 10; k++) {
        const v = (2**k) + 1;
        total += M(v);
        values.push(total);
    }

    const l = linearRecurrence(values);
    assert.strictEqual(l.divisor, 1n);

    let m = Matrix.fromRecurrence(l.factors);    
    let i = new Matrix(m.rows, 1);

    for(let r = 0; r < m.rows; r++) {
        i.set(r, 0, values[m.rows-(r+1)]);
    }

    m = m.pow(max, MODULO);
    i = m.multiply(i, MODULO);

    return i.get(i.rows-1, 0);
}

assert.strictEqual(M(5), 15);
assert.strictEqual(M(100), 10920);
assert.strictEqual(solve(10), 1313622);
assert.strictEqual(solve(15), 38240837);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);