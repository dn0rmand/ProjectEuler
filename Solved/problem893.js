const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const digits = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

const $simple = [...digits];

function simple(n) {
    const key = n;
    if ($simple[key] !== undefined) {
        return $simple[key];
    }
    let total = 0;
    if (n === 0) {
        return digits[0];
    }
    while (n) {
        const d = n % 10;
        total += digits[d];
        n = (n - d) / 10;
    }
    $simple[key] = total;
    return total;
}

const $MTimes = new Uint16Array(1e6 + 1);
const $M = [];
const $groups = [];

function M(n) {
    if ($M[n]) {
        return $M[n];
    }

    let min = $MTimes[n];

    if (n > 28) {
        min = $groups.reduce((a, vs, v) => {
            const x = v + 2;
            if (x >= a) {
                return a;
            }
            return vs.reduce((a, i) => Math.min(a, v + 2 + $M[n - i]), a);
        }, min);

        $M[n] = min;
        if (!$groups[min]) {
            $groups[min] = [n];
        } else {
            $groups[min].push(n);
        }
        return min;
    } else {
        for (let left = 1; left < n; left++) {
            const right = n - left;
            if (right < left) {
                break;
            }
            const v = M(left) + 2 + M(n - left);
            if (v < min) {
                min = v;
            }
        }

        $M[n] = min;
        if (!$groups[min]) {
            $groups[min] = [n];
        } else {
            $groups[min].push(n);
        }
        return min;
    }
}

function groupBy(array) {
    return array.reduce((a, v, i) => {
        if (a[v] === undefined) {
            a[v] = [i];
        } else {
            a[v].push(i);
        }
        return a;
    }, []);
}

function prepare() {
    for (let i = 1; i <= 1e6; i++) {
        $MTimes[i] = simple(i);
    }

    // Multiplications
    const middle = Math.sqrt(1e6);
    for (let x = 2; x <= middle; x++) {
        const ax = $MTimes[x] + 2;
        for (let y = x; ; y++) {
            const v = x * y;
            if (v > 1e6) {
                break;
            }
            const a = ax + $MTimes[y];
            if (a < $MTimes[v]) {
                $MTimes[v] = a;
            }
        }
    }
}

function T(n, trace = false) {
    let total = 0;
    const tracer = new Tracer(trace);
    for (let i = 1; i <= n; i++) {
        tracer.print((_) => n - i);
        total += M(i);
    }
    tracer.clear();
    return total;
}

TimeLogger.wrap('', (_) => {
    prepare();
    assert.strictEqual(M(28), 9);
    assert.strictEqual(T(100), 916);

    console.log('Tests passed');

    const answer = TimeLogger.wrap('', (_) => T(1e6, true));
    console.log(`Answer is ${answer}`);
});
