const assert = require('assert');
const { TimeLogger, Tracer, linearRecurrence } = require('@dn0rmand/project-euler-tools');

const MAX = 100;
const MODULO = 1e9 + 7;
const MODULO8 = MODULO * 8;

function* tribonacci() {
    let a0 = 0;
    let a1 = 0;
    let a2 = 1;

    while (true) {
        [a2, a1, a0] = [a2 + a1 + a0, a2, a1];
        if (a2 > 1) {
            yield a2;
        }
    }
}

function F(N) {
    let total = 1;
    n = 1;

    let sequence = tribonacci();
    let nextBad = sequence.next().value;

    while (n <= N) {
        n++;
        if (n === nextBad) {
            nextBad = sequence.next().value;
        } else {
            total = (total + n.modMul(n, MODULO)) % MODULO;
        }
    }

    return total;
}

function bruteF(N) {
    const values = [1];
    const indexes = [];
    let total = 1;
    n = 1;

    while (n <= N) {
        const v = values.shift();
        n++;
        const v2 = (v * 2) % MODULO8;
        values.push(v2);
        indexes.push(n);
        if (n <= N && (v & 3) !== 3) {
            n++;
            values.push((v2 + 1) % MODULO8);
            total = (total + n.modMul(n, MODULO)) % MODULO;
        }
    }

    console.log(indexes.join(', '));
    linearRecurrence(indexes);

    return total;
}

console.log(bruteF(1000));
// console.log(F(100));

assert.strictEqual(F(10), 199);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => F(MAX));
console.log(`Answer is ${answer}`);
