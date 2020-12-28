const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/bigintHelper');

const MODULO = 1000000007n
const MAX = 10n**8n;

// OEIS A081696

function ff(n, trace)
{
    let f0 = 1n, f1 = 1n, f2 = 3n;
    let divisor = 1n;

    const tracer = new Tracer(1000, trace);

    for(let i = 3n; i < n; i++)
    {
        tracer.print(_ => n-i);

        const v3 = f0 * (4n * i - 6n);
        const v2 = f1 * (15n * i - 24n);
        const v1 = f2 * (8n * i - 6n);

        f0 = (f1 * i) % MODULO;
        f1 = (f2 * i) % MODULO;
        f2 = (v1 + MODULO - (v2 + v3) % MODULO) % MODULO;

        divisor = (divisor * i) % MODULO;
    }

    tracer.clear();

    return { f1, f2, divisor };
}

function f(n, trace)
{
    const { f1, f2, divisor } = ff(BigInt(n), trace);
    let answer = (f2 + f2 + f1) % MODULO;

    answer = answer.modDiv(divisor, MODULO);

    return Number(answer);
}

assert.strictEqual(f(8), 2663);
assert.strictEqual(f(20), 742296999);

const answer = timeLogger.wrap(`${MAX}`, _ => f(MAX, true));
console.log(`Answer is ${answer}`);