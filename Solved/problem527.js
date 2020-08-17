const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/bigintHelper');

const MAX = 1E10;

function R(n)
{
    let h = 0;
    for(let i = 1; i <= n; i++)
    {
        h = h + (1/i);
    }

    return -3 + (2*(1+n)*h) / n;
}

function B(max)
{
    let offset = 2;
    let count  = 2;
    let start  = 1;
    let n      = 1;

    let c = count;
    while(n < max)
    {
        if ((n + count) <= max)
        {
            start += offset * count;
            n     += count;

            offset++;
            count *= 2;
            c = count;
        }
        else
        {
            // finish up

            let o = max-n;
            start += offset*o;
            n += o;
            c -= o;
        }
    }

    return start / max;
}

assert.equal(B(6).toFixed(8), '2.33333333');
assert.equal(R(6).toFixed(8), '2.71666667');

console.log('Tests passed');

const b = timeLogger.wrap('', _ => B(MAX));
const r = timeLogger.wrap('', _ => R(MAX));
const answer = r - b;
console.log(`Answer is ${answer.toFixed(8)}`);
