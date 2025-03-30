const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const MAX_R = 24690;
const MAX_B = 12345;

function P(r, b) {
    let previousRow = new Array(b + 1).fill(1);
    let row = new Array(b + 1);
    previousRow[0] = 0;

    for (let r0 = 2; r0 <= r; r0 += 2) {
        row[0] = 0;
        for (let b0 = 1; b0 <= b; b0++) {
            let p = 0;

            const cards = r0 + b0;
            const div = cards * (cards - 1);

            // case RR
            const rr = (r0 * (r0 - 1)) / div;
            p += rr * previousRow[b0];

            // case RB + BR
            const rb = (2 * r0 * b0) / div;
            p += rb * row[b0 - 1];

            // case BB
            const bb = (b0 * (b0 - 1)) / div;
            p = p / (1 - bb);

            row[b0] = p;
        }

        [row, previousRow] = [previousRow, row];
    }

    const p = previousRow[b];
    return +p.toFixed(10);
}

assert.strictEqual(P(2, 2), 0.4666666667);
assert.strictEqual(P(10, 9), 0.4118903397);
assert.strictEqual(P(34, 25), 0.3665688069);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => P(MAX_R, MAX_B));
console.log(`Answer is ${answer}`);

// https://projecteuler.net/problem=secret
