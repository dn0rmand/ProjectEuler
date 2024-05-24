const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const start = [1, 1, 1, 1, 1];

function power(equation) {
    const maxP = equation.length + start.length - 1;
    const new_equation = new Int32Array(maxP);

    let odds = 0;

    for (let p = 0; p < equation.length; p++) {
        const v = equation[p];
        for (let i = 0; i < start.length; i++) {
            const oldValue = new_equation[p + i];
            const newValue = oldValue + v;

            if (oldValue & 1 && !(newValue & 1)) {
                odds--;
            } else if (!(oldValue & 1) && newValue & 1) {
                odds++;
            }
            new_equation[p + i] = newValue;
        }
    }

    return [odds, new_equation];
}

function* split(k) {
    let power = 1;
    let current = 0;
    while (k) {
        if ((k & 3) === 0) {
            if (current >= 1) {
                yield current;
            }
            current = 0;
            power = 1;
            while (k && (k & 1) === 0) {
                k /= 2;
            }
        } else {
            const d = k & 1;
            k = (k - d) / 2;
            current = current + d * power;
            power *= 2;
        }
    }
    if (current >= 1) {
        yield current;
    }
}

const MAX_Q = 27638;
const $Q = new Uint32Array(MAX_Q);
const dummy_function = () => {};

function prepare(maxTest = 0, tests = dummy_function) {
    let equation = start;
    let odds = 0;
    $Q[0] = 1;
    $Q[1] = equation.reduce((a, v) => a + (v & 1), 0);

    const tracer = new Tracer(true);

    for (let i = 2; i < MAX_Q; i++) {
        tracer.print((_) => MAX_Q - i);
        [odds, equation] = power(equation);
        $Q[i] = odds;
        if (i === maxTest) {
            tests();
        }
    }
    tracer.clear();
}

function Q(k) {
    if (k < MAX_Q) {
        return $Q[k];
    }

    let q = 1;
    for (const k1 of split(k)) {
        q *= $Q[k1];
    }

    return q;
}

function solve(max) {
    let total = 0;
    for (let k = 1; k <= max; k++) {
        const p = 10 ** k;
        total += Q(p);
    }
    return total;
}

const answer = TimeLogger.wrap('', (_) => {
    prepare(100, () => {
        assert.strictEqual(Q(37), 85);
        assert.strictEqual(Q(3), 7);
        assert.strictEqual(Q(10), 17);
        assert.strictEqual(Q(100), 35);
    });

    return solve(18);
});

console.log(`Answer is ${answer}`);
