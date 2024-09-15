const assert = require('assert');
const {
    TimeLogger,
    Tracer,
    linearRecurrence,
    matrixSmall: Matrix,
} = require('@dn0rmand/project-euler-tools');

const MAX = 1e7;
const MODULO = 1000000007;

function S(max, trace) {
    function isUsed(used, k) {
        const bit = 2n ** BigInt(k - 1);
        return (used & bit) !== 0n;
    }

    function setUsed(used, k) {
        const bit = 2n ** BigInt(k - 1);
        return used | bit;
    }

    function withPiece(k, used, callback) {
        if (k > 0 && k <= max && !isUsed(used, k)) {
            callback(k, setUsed(used, k));
        }
    }

    function makeKey(current, used, upSideDown) {
        let key = used * 2n + (upSideDown === -1 ? 1n : 0n);
        key = key * BigInt(max) + BigInt(current - 1);
        return key;
    }

    const $inner = new Map();

    function inner(current, used, upSideDown, remaining) {
        if (remaining === 0) {
            return 1;
        }

        const key = makeKey(current, used, upSideDown);

        let total = $inner.get(key);
        if (total !== undefined) {
            return total;
        }

        total = 0;

        withPiece(
            current + upSideDown,
            used,
            (k, newUsed) => (total = (total + inner(k, newUsed, upSideDown, remaining - 1)) % MODULO)
        );
        withPiece(
            current - 2,
            used,
            (k, newUsed) => (total = (total + inner(k, newUsed, -1 * upSideDown, remaining - 1)) % MODULO)
        );
        withPiece(
            current + 2,
            used,
            (k, newUsed) => (total = (total + inner(k, newUsed, -1 * upSideDown, remaining - 1)) % MODULO)
        );

        $inner.set(key, total);
        return total;
    }

    const tracer = new Tracer(trace);
    let total = 0;
    for (let n = 1; n <= max; n++) {
        tracer.print(() => max - n);
        withPiece(n, 0n, (k, newUsed) => {
            total = (total + inner(k, newUsed, 1, max - 1)) % MODULO;
            total = (total + inner(k, newUsed, -1, max - 1)) % MODULO;
        });
    }
    tracer.clear();
    return total;
}

function solve(max) {
    if (max & 1) {
        throw 'Support only even numbers';
    }

    const values = [];

    for (let n = 2; n < 26; n += 2) {
        values.push(S(n));
    }

    const ln = linearRecurrence(values, true);

    const M = Matrix.fromRecurrence(ln.factors);
    const I = new Matrix(M.rows, 1);

    for (let row = 0; row < I.rows; row++) {
        I.set(I.rows - 1 - row, 0, values[row]);
    }

    const p = (max - 2) / 2;
    const m = M.pow(p, MODULO);
    const v = m.multiply(I, MODULO);

    return v.get(v.rows - 1, 0);
}

assert.strictEqual(S(4), 12);
assert.strictEqual(S(8), 58);
assert.strictEqual(S(20), 5560);
assert.strictEqual(solve(20), 5560);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX));
console.log(`Answer is ${answer}`);
