const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007;
const MAX_A = 1e6;
const MAX_B = 1e7;
const MAX_C = 1e8;

const [$factorials, $inverseFactorials] = TimeLogger.wrap('preloading factorials', () => {
    const max = MAX_A + MAX_B + MAX_C;

    const factorials = new Uint32Array(max);
    const inverses = new Uint32Array(max);

    inverses.fill(MODULO);
    inverses[0] = inverses[1] = 1;

    const tracer = new Tracer(true);
    factorials[0] = factorials[1] = 1;

    let v = 1;
    for (let i = 2; i < max; i++) {
        tracer.print(() => max - i);
        v = v.modMul(i, MODULO);
        factorials[i] = v;
    }
    tracer.clear();
    return [factorials, inverses];
});

function inverseFactorials(n) {
    if ($inverseFactorials[n] === MODULO) {
        $inverseFactorials[n] = $factorials[n].modInv(MODULO);
    }
    return $inverseFactorials[n];
}

function binomial(n, p) {
    return $factorials[n].modMul(inverseFactorials(p), MODULO).modMul(inverseFactorials(n - p), MODULO);
}

function W(a, b, c, trace) {
    function calculate(switches, count) {
        const remainingC = c - switches * 2;
        const times = binomial(a + b + remainingC, remainingC);
        return count.modMul(times, MODULO);
    }

    const tracer = new Tracer(trace);

    let total = 0;
    let state = {
        switches: 1,
        ka: 1,
        kb: 1,
        oa: 0,
        ob: 1,
    };

    while (state.ka <= a && state.kb <= b && state.switches * 2 <= c) {
        const { ka, kb, switches } = state;

        tracer.print((_) => a - ka);

        const c1 = binomial(a - 1, ka - 1).modMul(binomial(b - 1, kb - 1), MODULO);
        const c2 = kb > a ? 0 : binomial(b - 1, ka - 1).modMul(binomial(a - 1, kb - 1), MODULO);
        const count = (c1 + c2) % MODULO;

        total = (total + calculate(switches, count)) % MODULO;

        state = {
            switches: switches + 1,
            ka: ka + state.oa,
            kb: kb + state.ob,
            oa: (state.oa + 1) % 2,
            ob: (state.ob + 1) % 2,
        };
    }

    tracer.clear();

    return total;
}

assert.strictEqual(W(2, 2, 4), 32);
assert.strictEqual(W(4, 4, 44), 13908607644 % MODULO); // 908607553
assert.strictEqual(W(1e2, 1e3, 1e4, true), 846725112);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => W(1e6, 1e7, 1e8, true));
console.log(`Answer is ${answer}`);
