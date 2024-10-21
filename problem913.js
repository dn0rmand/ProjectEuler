const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

function minSwapsToSort(rows, cols) {
    let length = rows * cols;

    const indexFromValue = (v) => {
        const vc = v * cols;
        const i = (vc - (vc % length)) / length + (vc % length);
        return i;
    };

    let swaps = 0;

    for (let value = 0; value < length; value++) {
        if (value === indexFromValue(value)) {
            continue;
        }

        let cycleSize = 0;

        for (let v = indexFromValue(value); v !== value; v = indexFromValue(v)) {
            if (v < value) {
                cycleSize = 0;
                break;
            }
            cycleSize++;
        }

        if (cycleSize > 0) {
            swaps += cycleSize;
        }
    }
    // console.log(`${rows}x${cols} => `, swapCounts);

    const fast = rows * cols - rows - cols + rows.gcd(cols);
    return swaps;
}

const $S = {};

function S(rows, cols) {
    if (rows === cols) {
        if (rows & 1) {
            return ((rows - 1) / 2) * rows;
        } else {
            return (rows / 2) * (rows - 1);
        }
    }

    if (rows > cols) {
        [rows, cols] = [cols, rows];
    }

    $S[rows] ??= {};
    if ($S[rows][cols] !== undefined) {
        return $S[rows][cols];
    }

    const swaps = minSwapsToSort(rows, cols);

    $S[rows][cols] = swaps;
    return swaps;
}

const normalAction = (rows, cols) => S(rows, cols);
const problemAction = (rows, cols) => S(rows ** 4, cols ** 4);

function solve(max, action = normalAction, trace = false) {
    let total = 0;

    const tracer = new Tracer(trace);
    for (let rows = 2; rows <= max; rows++) {
        tracer.print(() => max - rows);
        for (let cols = 2; cols <= rows; cols++) {
            // const s1 = S(rows, cols);
            // const s2 = S(rows ** 2, cols ** 2);
            // const s3 = S(rows ** 3, cols ** 3);
            // const s4 = S(rows ** 4, cols ** 4);
            // console.log(`${rows}x${cols}`, s1, s2, s3, s4);

            total += action(rows, cols);
        }
    }

    tracer.clear();
    return total;
}

solve(10);
assert.strictEqual(S(3, 4), 8);
assert.strictEqual(S(4, 3), 8);

assert.strictEqual(
    TimeLogger.wrap('Example', () => solve(100, normalAction, false)),
    12578833
);

console.log('Tests passed');

// const answer = TimeLogger.wrap("", () => solve(100, problemAction, true));
// console.log(`Answer is ${answer}`);
