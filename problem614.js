const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1E9 + 7;

function solve(n, trace)
{
    let results = new Uint32Array(n+1);

    results[0] = 1;

    const tracer = new Tracer(1, trace);

    let maxSum = 0;

    for(let value = 1; value <= n; value++) {
        if ((value % 4) === 2) {
            continue;
        }

        tracer.print(_ => n-value);

        for(let sum = Math.min(maxSum, n-value); sum >= 0; sum--)
        {
            const s = results[sum];

            if (s) {
                const newSum = value + sum;
                results[newSum] = (results[newSum] + s) % MODULO;
            }
        }

        maxSum += value;
    }

    tracer.clear();

    results[0] = 0;

    return { 
        value: results[n], 
        sum: results.reduce((a, v) => (a + v) % MODULO)
    };
}

assert.strictEqual(solve(100).value, 37076);
assert.strictEqual(solve(1).value, 1);
assert.strictEqual(solve(2).value, 0);
assert.strictEqual(solve(3).value, 1);
assert.strictEqual(solve(6).value, 1);
assert.strictEqual(solve(10).value, 3);
assert.strictEqual(solve(1000).value, Number(3699177285485660336n % BigInt(MODULO)));

console.log('Tests passed');

const answer = timeLogger.wrap('Solving', _ => solve(1E5, true).sum);

console.log(`Answer is ${answer}`);