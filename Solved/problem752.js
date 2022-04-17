const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

const MAX = 10**6;

function g(x)
{
    if ((x % 2) === 0 || (x % 3) === 0) {
        // even => Nope
        return 0n;
    }

    let a = 1;
    let b = 1;

    const max = x*x;

    for(let n = 2; n < max ; n++) {
        [a, b] = [(a + b*7) % x, (a+b) % x];

        if (b === 0) {
            for(const frequency = n, A = a; n < max; n += frequency) {
                if (a === 1) {
                    return BigInt(n);    
                }

                a = (a * A) % x;
            }
        }
    }

    return 0n;
}

function G(n, trace)
{
    let total = 0n;

    const tracer = new Tracer(1000, trace);
    for (let x = 3; x <= n; x += 2) {
        tracer.print(_ => n-x);
        total += g(x, trace);
    }
    tracer.clear();
    return total;
}

assert.strictEqual(g(3), 0n);
assert.strictEqual(g(5), 12n);

assert.strictEqual(G(100), 28891n);
assert.strictEqual(timeLogger.wrap('', _ => G(1000)), 13131583n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => G(MAX, true));
console.log(`Answer is ${answer}`);