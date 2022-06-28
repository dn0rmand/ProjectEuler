const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const FORTYONE = 41;

const MAX = (x, y) => x > y ? x : y;
const MIN = (x, y) => x < y ? x : y;
const FLOOR = x => Math.floor(x);
const SQRT = x => Math.sqrt(x);

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

function quickSearch(min, max, target, f) {
    let x;
    let v;

    while (min < max) {
        x = FLOOR((min + max) / TWO);
        v = f(x);

        if (v > target) {
            max = x - ONE;
        } else {
            min = x + ONE;
        }
    }

    x = MAX(ONE, MIN(min, max));

    while (x && f(x) > target) {
        x--;
    }
    return x;
}

function case1(maxN) {
    let maxY = FLOOR(SQRT(maxN / FORTYONE));

    while (FORTYONE * maxY * maxY > maxN) {
        maxY--;
    }

    return maxY + maxY;
}

function case2(maxN) {
    let maxX = FLOOR(SQRT(maxN));

    while (maxX * maxX > maxN) {
        maxX--;
    }

    return maxX + maxX;
}

function case3(maxN, trace) {
    let total = ZERO;

    let tracer = new Tracer(trace);

    let max = FLOOR(SQRT(maxN));
    for (let y = ONE;; y++) {
        const y2 = FORTYONE * y * y;

        const subTotal = quickSearch(ONE, max, maxN, x => x * x + x * y + y2);
        if (subTotal === ZERO) {
            break;
        }

        max = subTotal + TWO;
        total += subTotal + subTotal;

        tracer.print(_ => subTotal);
    }
    tracer.clear();
    return total;
}

function case4(maxN, trace) {
    let total = ZERO;

    let tracer = new Tracer(trace);

    let xMax = maxN ** TWO;
    let xMin = ONE;

    for (let y = ONE;; y++) {
        const y2 = FORTYONE * y * y;
        const f = x => x * x - x * y + y2;

        let v = f(xMin);
        if (v > maxN) {
            for (let x = xMin + ONE; x <= xMax; x++) {
                const v2 = f(x);
                if (v2 <= maxN) {
                    xMin = x;
                    break;
                } else if (v2 > v) {
                    xMin = xMax + ONE;
                    break;
                } else {
                    v = v2;
                }
            }
        }

        if (xMin > xMax) {
            break;
        }

        xMax = quickSearch(xMin, xMax, maxN, f);

        const subTotal = xMax - xMin + ONE;
        if (subTotal === ZERO) {
            break;
        }

        xMax += TWO;
        tracer.print(_ => xMax);
        total += subTotal + subTotal;
    }

    tracer.clear();
    return total;
}

function solve(maxN, trace) {
    let t1 = case1(maxN);
    let t2 = case2(maxN);
    let t4 = TimeLogger.wrap('4', _ => case4(maxN, trace));
    let t3 = TimeLogger.wrap('3', _ => case3(maxN, trace));

    let totals = t1 + t2 + t3 + t4;

    return totals;
}

assert.strictEqual(count(53), 4);
assert.strictEqual(solve(652), 310);
assert.strictEqual(solve(1E3), 474);
assert.strictEqual(solve(1E6), 492128);
assert.strictEqual(solve(1E7), 4921382);

console.log('Tests passed');

const answer1 = TimeLogger.wrap('', _ => solve(10 ** 16, true));
console.log(`Answer is ${answer1}`);