const assert     = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer     = require('@dn0rmand/project-euler-tools/src/tracer');

const linearRecurrence = require('@dn0rmand/project-euler-tools/src/linearRecurrence');

const MODULO    = 1117117717; // Prime #                  
const MAX       = 1000000000;

function g(value)
{
    while (value > 0n && (value % 7n) === 0n)
        value /= 7n;

    if (value <= 1n)
        return 0n;

    let d = value % 7n;
    let x = (value - d) / 7n;

    return 7n - d + g(x+1n);
}

// S(7n)=7S(n)+21n−6 
function S(n)
{
    let y = n % 7n;
    let x = (n - y) / 7n;

    let total = 0n;

    for(let i = (7n*x) + 1n; i <= n; i++)
        total += g(i);

    if (x > 0)
    {
        total += (7n * S(x)) + (21n * x) - 6n;
    }
    return total;
}

function H(k)
{
    const n = (7n**BigInt(k) - 1n)/11n;

    return S(n);
}

function solve()
{
    let values = [];

    for(let k = 10; k < 100; k += 10)
    {
        values.push(H(k));
    }

    const recurrence = linearRecurrence(values);

    values = values.slice(0, recurrence.factors.length).map(v => v % BigInt(MODULO));

    const tracer = new Tracer(5000, true);

    for(let k = 20; k <= MAX; k += 10)
    {
        tracer.print(_ => MAX - k);
        values = recurrence.next(values, MODULO);
    }
    tracer.clear();
    return values[0];
}

assert.equal(g(125n), 8);
assert.equal(g(1000n), 9);
assert.equal(g(10000n), 21);
assert.equal(timeLogger.wrap('', _ => H(10)), 690409338);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);
