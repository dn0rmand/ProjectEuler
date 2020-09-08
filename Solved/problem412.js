const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO = 76543217;

function forXY(m, n, callback)
{
    for(let y = 0; y < m; y++)
    {
        const MAX = y < n ? m-n : m;
        for(let x = 0; x < MAX; x++)
        {
            callback(x, y);
        }
    }
}

function factorial(n, trace)
{
    let value = 1;

    const tracer = new Tracer(5000, trace, 'Calculate Numerator')
    for(let i = 2; i <= n; i++)
    {
        tracer.print(_ => n-i);
        value = value.modMul(i, MODULO);
    }
    tracer.clear();
    return value;
}

function LC(m, n, trace)
{
    let divisor = 1;

    const counts = [];

    const tracer1 = new Tracer(500, trace, 'Calculate Divisor');

    forXY(m, n, (x, y) => {
        tracer1.print(_ => m - y);

        let maxX = y < n ? m-n   : m;
        let minY = x < (m-n) ? 0 : n;
        let top = y+1-minY;
        let right = maxX-x;

        const items = top+right-1;

        counts[items] = (counts[items] || 0)+1;
        divisor = divisor.modMul(items, MODULO);
    });
    tracer1.clear();

    const numbers = (m*m)-(n*n);
    const numerator = factorial(numbers, trace);

    return numerator.modDiv(divisor, MODULO);
}

assert.equal(LC(3, 0), 42);
assert.equal(LC(5, 3), 250250);
assert.equal(LC(6, 3), 406029023400n % BigInt(MODULO));
assert.equal(LC(10, 5), 61251715);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => LC(10000, 5000, true));

console.log(`Answer is ${answer}`);