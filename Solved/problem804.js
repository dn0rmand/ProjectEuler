const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const MAX = (x, y) => x > y ? x : y;
const MIN = (x, y) => x < y ? x : y;

function count(n) {
    let total = 0;

    for (let x = 0;; x++) {
        const x2 = x * x;
        let done = true;
        for (let y = 0;; y++) {
            const y2 = 41 * y * y;

            const v1 = x2 + y2 + x * y;
            const v2 = x2 + y2 - x * y;

            if (v1 > n && v2 > n)
                break;
            done = false;
            if (v1 === n) {
                total += 2;
            }
            if (v2 === n) {
                total += 2;
            }
        }
        if (done) {
            break;
        }
    }

    return total;
}

function case1(maxN) {
    let maxY = (maxN / 41n).sqrt();

    while (41n * maxY * maxY > maxN) {
        maxY--;
    }

    return maxY + maxY;
}

function case2(maxN) {
    let maxX = maxN.sqrt();

    while (maxX * maxX > maxN) {
        maxX--;
    }

    return maxX + maxX;
}

function quickSerch(min, max, target, f) {
    let x;
    let v;

    // let min = 1n;
    while (min < max) {
        x = (min + max) / 2n;
        v = f(x);

        if (v > target) {
            max = x - 1n;
        } else {
            min = x + 1n;
        }
    }

    x = MAX(1n, MIN(min, max));

    while (x && f(x) > target) {
        x--;
    }
    return x;
}

function quickSerch2(m, target, f) {
    let x;
    let v;

    let min = 1n;
    let max = m;
    while (min < max) {
        x = (min + max) / 2n;
        v = f(x);

        if (v > target) {
            min = x + 1n;
        } else {
            max = x - 1n;
        }
    }

    x = MIN(min, max);
    if (x < 1n) {
        x = 1n;
    } else if (x > m) {
        x = m;
    }

    while (x < m && f(x) > target) {
        x++;
    }
    while (x && f(x) <= target) {
        x--;
    }
    return x;
}

function case3(maxN, trace) {
    let total = 0n;

    let tracer = new Tracer(trace, '3:');

    let max = maxN.sqrt();
    for (let y = 1n;; y++) {
        const y2 = 41n * y * y;

        const subTotal = quickSerch(1n, max, maxN, x => x * x + x * y + y2);
        if (subTotal === 0n) {
            break;
        }

        max = subTotal + 2n;
        total += subTotal + subTotal;

        tracer.print(_ => subTotal);
    }
    tracer.clear();
    return total;
}

function case4(maxN, trace) {
    let total = 0n;

    let max = maxN ** 2n;
    let min = 1n;

    let tracer = new Tracer(trace, '4:')

    for (let y = 1n;; y++) {
        const y2 = 41n * y * y;
        const f = x => x * x - x * y + y2;

        let v = f(min);
        if (v > maxN) {
            for (let x = min + 1n; x <= max; x++) {
                const v2 = f(x);
                if (v2 <= maxN) {
                    min = x;
                    break;
                } else if (v2 > v) {
                    min = max;
                    break;
                } else {
                    v = v2;
                }
            }
        }
        if (min >= max) {
            break;
        }
        const xMax = quickSerch(min, max, maxN, f);
        max = xMax + 2n;

        const subTotal = xMax - min + 1n;
        if (subTotal === 0n) {
            break;
        }

        tracer.print(_ => `${min} - ${max} - ${subTotal}`);
        total += subTotal + subTotal;
    }

    tracer.clear();
    return total;
}

function solve(maxN, trace) {
    maxN = BigInt(maxN);

    let t1 = case1(maxN);
    let t2 = case2(maxN);
    let t4 = TimeLogger.wrap('4', _ => case4(maxN, trace));
    let t3 = TimeLogger.wrap('3', _ => case3(maxN, trace));

    let totals = t1 + t2 + t3 + t4;

    return totals;
}

assert.strictEqual(count(53), 4);
assert.strictEqual(solve(1E3), 474n);
assert.strictEqual(solve(1E6), 492128n);
assert.strictEqual(solve(652), 310n);
assert.strictEqual(solve(1E7), 4921382n);

console.log('Tests passed');

const answer1 = TimeLogger.wrap('', _ => solve(10n ** 16n, true));
console.log(`Answer is ${answer1}`);