const assert = require('assert');
const {
    Tracer,
    TimeLogger: timeLogger
} = require('@dn0rmand/project-euler-tools');

const MAX_MOD = 4000000;

const $l = [];

timeLogger.wrap('Initializing', _ => {
    const tracer = new Tracer(true);
    $l.length = MAX_MOD + 1;

    for (let i = MAX_MOD; i > 0; i--) {
        tracer.print(_ => i);
        $l[i] = []; // new Uint32Array(i);
    }
    tracer.clear();
});

function getL(a, mod) {
    let r = $l[mod][a];
}

function setL(a, mod, value) {
    $l[mod][a] = value;
}

function l2(a, mod, deep) {
    if (a <= 1)
        return 1;

    if (a > Number.MAX_SAFE_INTEGER)
        throw "Too big ... "
    let r = getL(a, mod);
    if (r)
        return r;

    let count = 1;

    if (deep > 57595) {
        while (a > 1) {
            if (a > Number.MAX_SAFE_INTEGER)
                throw "Too big ... "
            count++;
            a = (a * a) % mod++
        }
    } else
        count += l2((a * a) % mod, mod + 1, deep + 1);

    setL(a, mod, count);
    return count;
}

function l(x, y) {
    let count = l2(y, x, 1);
    return count;
}

const $g = [];

function g(x) {
    if ($g[x])
        return $g[x];

    let max = 0;
    for (let y = 1; y < x; y++) {
        let v = l(x, y);
        if (v > max)
            max = v;
    }
    $g[x] = max;
    return $g[x];
}

function f(n, trace) {
    let max = 0;
    const tracer = new Tracer(trace);
    for (let x = n; x > 0; x--) {
        tracer.print(_ => `${x} - ${MAX_MOD} - ${max}`);

        let value = g(x);
        if (value > max) {
            max = value;
        }
    }
    tracer.clear();
    return max;
}

assert.equal(l(5, 3), 29);
assert.equal(g(5), 29);

assert.equal(f(100), 145);
assert.equal(timeLogger.wrap('', _ => f(10000, true)), 8824);

console.log('Tests passed');

// answer = f(3000000, true);
// console.log("Answer is", answer)