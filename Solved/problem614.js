const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1E9 + 7;
const MAX = 1E7;

const A = (function() {
    const as = new Int32Array(MAX+1);

    for(let j = 0; ; j++) {
        const n = j*(j+1);
        if (n > MAX) {
            break;
        }
        switch (j % 4) {
            case 0:
            case 3:
                as[n] = 1;
                break;
            case 1:
            case 2:
                as[n] = -1;
                break;
        }
    }

    return as;
})();

const sequence = (function()
{
    const seq = new Set();
    let tooBig = false;

    const add = (v) => {
        if (v <= MAX) {
            tooBig = false;
            seq.add(v);
        }
    };

    add(1);
    add(3);

    for(let k = 1; !tooBig ; k++) {
        tooBig = true;

        const k2 = k*2;
        const k4 = k*4;

        add((k2+1)*(k4+1));
        add((k2+1)*(k4+3));
        add(k2*(k4+1));
        add(k2*(k4-1));
    }

    const S = [...seq.values()].sort((a, b) => a-b);    
    return S;
})();

const $p = new Int32Array(MAX+1);
$p.fill(-1);

function P(n)
{
    if ($p[n] !== -1) {
        return $p[n];
    }

    let total = A[n];

    for(const m of sequence) {
    // for(let i = 0; i < sequence.length; i++) {
        // const m = sequence[i];
        if (m > n) {
            break;
        }
        if (m & 1) {
            total = (total + P(n-m)) % MODULO;
        } else {
            total = (total - P(n-m) + MODULO) % MODULO;
        }
    }

    $p[n] = total;

    return total;
}

function solve(n, trace)
{
    let total = 0;

    const tracer = new Tracer(1, trace);
    for (let k = 1; k <= n; k++) {
        tracer.print(_ => n - k);
        total = (total + P(k)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(P(1), 1);
assert.strictEqual(P(2), 0);
assert.strictEqual(P(3), 1);
assert.strictEqual(P(6), 1);
assert.strictEqual(P(10), 3);
assert.strictEqual(P(100), 37076);
assert.strictEqual(P(1000), Number(3699177285485660336n % BigInt(MODULO)));

console.log('Tests passed');

const answer = timeLogger.wrap('Solving', _ => solve(MAX, true));

console.log(`Answer is ${answer}`);