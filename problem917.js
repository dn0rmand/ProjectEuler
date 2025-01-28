const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e7;
const START = 102022661n;
const MODULO = 998388889n;

const sequence = TimeLogger.wrap('Loading sequence', () => {
    const values = new BigUint64Array(2 * (MAX + 1));

    for (let s = START, i = 0; i < values.length; i++) {
        values[i] = s;
        s = s ** 2n % MODULO;
    }

    return values;
});

// function getCell(i, j) {
//     const a = 2 * (i - 1);
//     const b = 2 * j - 1;

//     return sequence[a] + sequence[b];
// }

function solve1(max) {
    // fill first row

    let row1 = new BigUint64Array(max);
    let row2 = new BigUint64Array(max);

    let sa = sequence[0];
    let sb = sequence[1];

    let previous = sa + sb;

    row1[0] = previous;
    for (let a = 1, ai = 2; a < max; a++, ai += 2) {
        previous += sb + sequence[ai];
        row1[a] = previous;
    }

    // fill other rows
    for (let b = 1, bi = 3; b < max; b++, bi += 2) {
        if (!(b & 127)) {
            process.stdout.write(`\r${max - b}  `);
        }

        sb = sequence[bi];

        // fill first cell
        previous = sa + sb + row1[0];
        row2[0] = previous;

        for (let a = 1, ai = 2; a < max; a++, ai += 2) {
            const v2 = row1[a];
            if (v2 < previous) {
                previous = sequence[ai] + sb + v2;
            } else {
                previous = sequence[ai] + sb + previous;
            }
            row2[a] = previous;
        }
        // Switch rows
        [row1, row2] = [row2, row1];
    }

    process.stdout.write('\r                         \r');

    const result = row1[max - 1];

    return result;
}

function solve2(max, getCell) {
    const m = [];

    function addToPath(cell, i, j, path, direction) {
        if (path.length === 0) {
            return [{ cell, i, j, direction, count: 1 }];
        } else if (path[0].direction !== direction) {
            return [{ cell, i, j, direction, count: 1 }, ...path];
        } else {
            const p = [...path];
            p[0] = { cell, i, j, direction, count: p[0].count + 1 };

            return p;
        }
    }

    function inner(i, j) {
        const v = getCell(i, j);

        if (i === max && j === max) {
            return { value: v, path: addToPath(v, i, j, [], 'end') };
        }
        m[i] ??= [];
        let s = m[i][j];
        if (s !== undefined) {
            return s;
        }

        if (i === max) {
            const { value, path } = inner(i, j + 1);
            s = { value: v + value, path: addToPath(v, i, j, path, 'down') };
        } else if (j === max) {
            const { value, path } = inner(i + 1, j);
            s = { value: v + value, path: addToPath(v, i, j, path, 'right') };
        } else {
            const { value: v1, path: p1 } = inner(i + 1, j);
            const { value: v2, path: p2 } = inner(i, j + 1);
            // console.log(v, getCell(i + 1, j), getCell(i, j + 1), v2 < v1 ? 'down' : 'right');
            if (v1 < v2) {
                s = { value: v + v1, path: addToPath(v, i, j, p1, 'right') };
            } else {
                s = { value: v + v2, path: addToPath(v, i, j, p2, 'down') };
            }
        }
        m[i][j] = s;
        return s;
    }

    const { value, path } = inner(1, 1);

    return value;
}

function solve(max) {
    const v1 = solve2(max, (i, j) => sequence[2 * (i - 1)]);
    const v2 = solve2(max, (i, j) => sequence[2 * j - 1]);

    return v1 + v2;
}

assert.strictEqual(solve(1), 966774091n);
assert.strictEqual(solve(2), 2388327490n);
assert.strictEqual(solve(10), 13389278727n);

assert.strictEqual(
    TimeLogger.wrap('', () => solve(10000)),
    9995502224219n
);

// console.log('Tests passed');

// const answer = TimeLogger.wrap('', () => solve(MAX));
// console.log(`Answer is ${answer}`);

// 1e6 => 998478734027153

function buildMap(max) {
    const $cells = new Map();

    const cell = (i, j) => {
        const v = getCell(i + 1, j + 1);
        let x = $cells.get(v);
        if (!x) {
            x = $cells.size;
            $cells.set(v, x);
            return x;
        } else {
            return x;
        }
    };
    const rows = [];
    for (let j = 0; j < max; j++) {
        const row = [];
        rows[j] = row;
        for (let i = 0; i < max; i++) {
            row[i] = cell(i, j);
        }
    }
    debugger;
}

buildMap(100);
