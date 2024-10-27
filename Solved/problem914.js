const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 10n ** 18n;

function F(R, trace) {
    let max = 0n;

    const D = 2n * R;
    const minN = Math.ceil(Math.sqrt(Number(R))) - 1;
    const start = Math.ceil(minN / 1.8);
    const end = Math.floor(minN / 1.85);

    const tracer = new Tracer(trace);
    for (let n = start; n >= end; n--) {
        tracer.print(() => n - end);
        const n2 = BigInt(n) ** 2n;
        let m = Math.floor(Math.sqrt(Number(D - n2)));
        if ((n & 1) === (m & 1)) {
            m--;
        }
        if (n.gcd(m) !== 1) {
            continue;
        }
        const r = BigInt(n) * BigInt(m - n);
        if (r > max) {
            max = r;
        }
    }

    tracer.clear();

    return max;
}

assert.strictEqual(F(100n), 36n);
assert.strictEqual(F(100000000n), 41421205n);
assert.strictEqual(F(10000000000n), 4142134863n);
assert.strictEqual(F(1000000000000n), 414213558932n);
assert.strictEqual(F(1000000000000n), 414213558932n);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => F(MAX, true));
console.log(`Answer is ${answer}`);
