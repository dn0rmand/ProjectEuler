const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const MAX = 1E13;

const { fibonacci, sums } = timeLogger.wrap('Loading fibonacci', _ => {
    const fibonacci = [1];
    const sums      = [1];

    let f1 = 1;
    let f2 = 2;
    let s  = 1;

    while (f2 <= MAX) {
        s += f2;
        sums.push(s);
        fibonacci.push(f2);
        [f1, f2] = [f2, f1+f2];
    }

    return { fibonacci, sums };
});

function solve(n) 
{
    function inner(value, index) 
    {
        if (value === 0) {
            return 1n;
        }

        let total = 1n;

        for(let i = index; i >= 0; i--) {
            const f = fibonacci[i];            
            if (f > value) {
                continue;
            }

            if (sums[i] <= value) {
                total += BigInt(2 ** i);
            } else {
                total += inner(value-f, i-1);
            }
        }

        return total;
    }

    const total = inner(n, fibonacci.length-1);
    return total;
}

assert.strictEqual(solve(100), 415n);
assert.strictEqual(solve(1E4), 312807n);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);
