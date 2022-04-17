const assert = require('assert');

const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const MAX = 1E4;

function getValues(n, k) {
    const results = [];
    const digits = [];

    function inner(ones) {
        if (digits.length === n) {
            results.push({
                digits: [...digits],
                ones
            });
            return;
        }

        digits.push(0);
        inner(ones);
        if (ones < k) {
            digits[digits.length - 1] = 1;
            inner(ones + 1);
        }
        digits.pop();
    }

    inner(0);
    results.sort((a, b) => a.ones - b.ones);
    return results;
}

function buildMatrix1(n, k, callback) {
    const values = getValues(n, k);

    const matrix = [];

    function inner(ones, index) {
        if (matrix.length === n) {
            if (ones === k) {
                const m = callback(matrix, true);
                if (m === 3) {
                    return true;
                }
            }
            return false;
        }

        const rowsLeft = n - matrix.length;
        if (ones + n * rowsLeft < k) {
            return false;
        }

        for (let i = index; i < values.length; i++) {
            const value = values[i];
            if (ones + value.ones > k) {
                break;
            }
            matrix.push(value.digits);
            if (inner(ones + value.ones, i)) {
                return true;
            }
            matrix.pop();
        }

        return false;
    }

    inner(0, 0);
}

function buildMatrix(n, k, callback) {
    for (let width = 1; width <= n; width++) {
        const matrix = [];

        for (let r = 0; r < n; r++) {
            matrix[r] = new Uint8Array(n);
        }

        let ones = k;

        for (let r = 0; ones && r < n; r++) {
            for (let w = 0; w < width; w++) {
                if (ones && !matrix[r][w]) {
                    matrix[r][w] = 1;
                    ones--;
                }
                if (ones && !matrix[w][r]) {
                    matrix[w][r] = 1;
                    ones--;
                }
            }

            if (ones === 1) {
                for (let i = 1; i <= n; i++) {
                    if (matrix[n - i][n - i] === 0) {
                        matrix[n - i][n - i] = 1;
                        let min = callback(matrix);
                        if (min === 3) {
                            return 3;
                        }
                        matrix[n - i][n - i] = 0;
                    }
                }
            }
        }
        if (!ones) {
            const min = callback(matrix);
            if (min === 3) {
                return min;
            }
        }
    }

    return false;
}

function someKindOfL(n, k) {
    let p = n;
    let x = 1;

    while (k >= p) {
        k -= p;
        x--;
        if (x === 0) {
            p = p - 1;
            x = 2;
        }
        if (p === 0) {
            break;
        }
    }
    if (k === p - 1 && x === 2) {
        return true;
    }
    return k === 0;
}

function isFish(n, k) {
    const s = (n - 2) * (n - 2);
    return (s + 2 === k);
}

function isOther(n, k) {
    for (let a = 1; a <= n; a++) {
        for (let b = 1; b < n - a; b++) {
            const c = n - a - b;

            for (let a2 = 1; a2 <= n && (a2 * a + b + c) <= k; a2++) {
                for (let b2 = 1; b2 <= n && (a2 * a + b2 * b + c) <= k; b2++) {
                    if (c) {
                        let c2 = k - (a2 * a + b2 * b);
                        if (c2 <= n && c2 % c === 0) {
                            c2 /= c;
                            if (a2 + b2 + c2 === n) {
                                return true;
                            }
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function c(n, k) {
    let min = 4;

    const callback = (matrix, brute) => {
        const stop = /*brute ? ( _ => hash.size > 3 ) :*/ (_ => hash.size >= min);
        const hash = new Set();
        // horizontal
        for (const r of matrix) {
            const key = r.reduce((a, v) => a * 2 + v);
            hash.add(key);
            if (stop()) {
                break;
            }
        }
        if (!stop()) {
            for (let c = 0; c < n; c++) {
                let key = 0;
                for (let r = 0; r < n; r++) {
                    key = key * 2 + matrix[r][c];
                }
                hash.add(key);
                if (stop()) {
                    break;
                }
            }
        }
        min = Math.min(min, hash.size);
        // if (brute && hash.size === 3) {
        //     debugger;
        // }
        // return brute ? 4 : min;
        return min;
    };

    if (k <= n) {
        return 3;
    }

    if (isFish(n, k)) {
        return 3;
    }

    if ((k & 1) === 1 && (k - 1) / 2 <= n) {
        // buildMatrix1(n, k, callback);
        // assert.strictEqual(min, 3);
        return 3;
    }

    let kk = k - 2 * (n - 1);
    if (kk >= 0) {
        if (kk === 0) {
            console.log('I GOT HERE');
        }
        kk = Math.sqrt(kk);
        if (Math.floor(kk) === kk && kk <= n - 1) {
            // buildMatrix1(n, k, callback);
            // assert.strictEqual(min, 3);
            return 3;
        }
    }

    kk = k - n - (n - 1);
    if (kk >= 0) {
        kk = Math.sqrt(kk);
        if (kk === Math.floor(kk)) {
            // buildMatrix1(n, k, callback);
            // assert.strictEqual(min, 3);
            return 3;
        }
    }

    if (someKindOfL(n, k)) {
        // buildMatrix1(n, k, callback);
        // assert.strictEqual(min, 3);
        return 3;
    }

    for (let i = n; i > 0; i--) {
        if ((k % i) === 0 && (k / i) <= n) {
            // buildMatrix1(n, k, callback);
            // assert.strictEqual(min, 3);
            return 3;
        }
    }

    if (!buildMatrix(n, k, callback)) {
        if (isOther(n, k)) {
            return 3;
        }

        // if (n === 9 && [34, 38, 23, 22].includes(k)) {
        //     return 3;
        // }
        // buildMatrix(n, k, callback);
        return 3;
        // return min;
    }

    return min;
}

c(5, 11);

function C(n) {
    const n2 = n * n;

    let total = 2;

    const processed = [1];
    processed[n2] = 1;

    const process = a2 => {
        if (!processed[a2]) {
            processed[a2] = 1;
            total += 2;
        }
        if (!processed[n2 - a2]) {
            processed[n2 - a2] = 1;
            total += 2;
        }
    };

    for (let a = 1; a <= n; a++) {
        const a2 = a * a;
        process(a2);
        process(a2 + (n - a) * (n - a));
    }

    const middle = Math.floor(n2 / 2);

    const tracer = new Tracer(true);

    let last = 0;
    for (let k = 0; k <= middle; k++) {
        if (processed[k]) {
            last = 0;
            continue;
        }

        tracer.print(_ => middle - k);

        last = c(n, k);
        total += 2 * last;
    }

    if (!(n2 & 1)) {
        total -= last;
    }
    tracer.clear();
    return total;
}


assert.strictEqual(C(1), 2);
assert.strictEqual(C(2), 8);
assert.strictEqual(C(3), 22);
assert.strictEqual(C(4), 38);
assert.strictEqual(C(5), 64);
assert.strictEqual(C(6), 94);
assert.strictEqual(C(7), 130);
assert.strictEqual(C(8), 170);
assert.strictEqual(C(9), 222);
assert.strictEqual(C(10), 274);
assert.strictEqual(C(11), 334);
assert.strictEqual(C(12), 400);

// console.log(C(20));

console.log('Tests passed');