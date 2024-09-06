const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX_SIZE = 1001;
const MAKE_KEY = (a, b, c) => (a * MAX_SIZE + b) * MAX_SIZE + c;
const MAX_KEY = MAKE_KEY(1000, 1000, 1000);

const $memoize = (function () {
    const mem = new Uint8Array(MAX_KEY + 1);
    for (let n = 0; n < MAX_SIZE; n++) {
        mem[MAKE_KEY(n, n, n)] = 2;
        mem[MAKE_KEY(0, n, n)] = 2;
        mem[MAKE_KEY(n, 0, n)] = 2;
        mem[MAKE_KEY(n, n, 0)] = 2;
        mem[MAKE_KEY(0, 0, n)] = 2;
        mem[MAKE_KEY(n, 0, 0)] = 2;
        mem[MAKE_KEY(0, n, 0)] = 2;
    }
    return mem;
})();

function get(a, b, c) {
    const key = MAKE_KEY(a, b, c);
    const v = $memoize[key];
    return v ? v - 1 : undefined;
}

function set(a, b, c, value) {
    const key = MAKE_KEY(a, b, c);
    $memoize[key] = value ? 2 : 1;
    if (!value) {
        // inject winning
        const add = (a, b, c) => {
            [a, b, c] = [a, b, c].sort((a, b) => a - b);
            if (c < MAX_SIZE) {
                set(a, b, c, true);
            }
        };

        for (let n = 1; n < MAX_SIZE - a; n++) {
            add(a + n, b, c);
            add(a + n, b + n, c);
            add(a + n, b + n, c + n);
            if (n + b < MAX_SIZE) {
                add(a, b + n, c);
                add(a, b + n, c + n);
                add(a, b, c + n);
            }
        }
    }
}

function isWinning(a, b, c) {
    if (a < 0 || b < 0 || c < 0) {
        throw 'Error .... should not happen';
    }

    [a, b, c] = [a, b, c].sort((a, b) => a - b);

    if (c === 0) {
        return false;
    }

    if ((a === 0 && b === 0) || (a === 0 && b === c) || a === c) {
        return true;
    }

    let win = get(a, b, c);
    if (win !== undefined) {
        return win;
    }

    win = false;
    for (let n = 1; n <= c; n++) {
        if (n <= a) {
            if (isLosing(a - n, b, c)) {
                win = true;
                break;
            }
            if (isLosing(a - n, b - n, c)) {
                win = true;
                break;
            }
            if (isLosing(a - n, b - n, c - n)) {
                win = true;
                break;
            }
            if (isLosing(a - n, b, c - n)) {
                win = true;
                break;
            }
        }
        if (n <= b) {
            if (isLosing(a, b - n, c)) {
                win = true;
                break;
            }
            if (isLosing(a, b - n, c - n)) {
                win = true;
                break;
            }
        }
        if (n <= c && isLosing(a, b, c - n)) {
            win = true;
            break;
        }
    }

    set(a, b, c, win);
    return win;
}

const isLosing = (a, b, c) => !isWinning(a, b, c);

function solve(max) {
    let total = 0;

    const tracer = new Tracer(true);

    for (let a = 0; a <= max; a++) {
        for (let b = a; b <= max; b++) {
            tracer.print(() => `${max - a}: ${max - b}`);
            for (let c = b; c <= max; c++) {
                if (a === b && b === c) {
                    set(a, b, c, 2); // Winning
                } else if (a === 0 && b === c) {
                    set(a, b, c, 2); // Winning
                } else if (a === 0 && b === 0) {
                    set(a, b, c, 2); // Winning
                } else if (isLosing(a, b, c)) {
                    total += a + b + c;
                }
            }
        }
    }

    tracer.clear();

    return total;
}

assert.strictEqual(isWinning(5, 5, 5), true);
assert.strictEqual(isWinning(0, 0, 13), true);
assert.strictEqual(isWinning(11, 0, 11), true);

assert.strictEqual(isWinning(0, 1, 2), false);
assert.strictEqual(isWinning(1, 3, 3), false);

assert.strictEqual(
    TimeLogger.wrap('', () => solve(100)),
    173895
);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(1000));
console.log(`Answer is ${answer}`);
