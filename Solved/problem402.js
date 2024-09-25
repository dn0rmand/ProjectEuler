const assert = require('assert');
const { TimeLogger, Tracer, chineseRemainder } = require('@dn0rmand/project-euler-tools');

const MAX = 1234567890123;
const MODULO = 1e9;

const $M = [];
const $Z = [];

(function () {
    function M(a, b, c) {
        m = a + b + c + 1;
        let repeat = 1;
        for (let i = 2; repeat < 10; i++) {
            const v = i ** 4 + a * i ** 3 + b * i ** 2 + c * i;
            const m0 = m;
            m = m0.gcd(v);
            if (m === 1) {
                break;
            }
            if (m === m0) {
                repeat++;
            } else {
                repeat = 1;
            }
        }

        $M[a][b][c] = m;
    }

    function Z(x, y, z) {
        let total = 0;
        for (let a = 1; a <= x; a++) {
            for (let b = 1; b <= y; b++) {
                for (let c = 1; c <= z; c++) {
                    total = (total + $M[a][b][c]) % MODULO;
                }
            }
        }

        $Z[x][y][z] = total;
    }

    const emptyArray = () => {
        const a = new Array(25);
        a.fill(0);
        return a;
    };

    for (let a = 0; a <= 24; a++) {
        $Z[a] = [emptyArray()];
        $M[a] = [emptyArray()];
        for (let b = 0; b <= 24; b++) {
            $Z[a][b] = emptyArray();
            $M[a][b] = emptyArray();
        }
    }

    for (let a = 1; a <= 24; a++) {
        for (let b = 1; b <= 24; b++) {
            for (let c = 1; c <= 24; c++) {
                M(a, b, c);
            }
        }
    }

    for (let a = 1; a <= 24; a++) {
        for (let b = 1; b <= 24; b++) {
            for (let c = 1; c <= 24; c++) {
                Z(a, b, c);
            }
        }
    }
})();

function S(N) {
    const count = Math.floor(N / 24);
    const rest = N % 24;
    const count1 = count % MODULO;
    const count2 = count1.modPow(2, MODULO);
    const count3 = count1.modPow(3, MODULO);

    const total =
        count3 * $Z[24][24][24] +
        count2 * ($Z[24][24][rest] + $Z[24][rest][24] + $Z[rest][24][24]) +
        count1 * ($Z[24][rest][rest] + $Z[rest][24][rest] + $Z[rest][rest][24]) +
        $Z[rest][rest][rest];

    return total % MODULO;
}

function solve() {
    const tracer = new Tracer(true);

    const FIB_MODULO = 3e9;

    const modulo1 = 5 ** 9;
    const modulo2 = 2 ** 9;

    const rest1 = MAX % (24 * modulo1);
    const rest2 = MAX % (3 * modulo2);

    let f0 = 0;
    let f1 = 1;
    let total1 = 0;
    let total2 = 0;
    let k = 2;

    // do 1 & 2 until end of 2
    for (; k <= rest2; k++) {
        tracer.print(() => rest1 - k);
        [f0, f1] = [f1, (f0 + f1) % FIB_MODULO];

        const s = S(f1);

        total1 = (total1 + s) % modulo1;
        total2 = (total2 + s) % modulo2;
    }

    // continue with 1 until end of 1
    for (; k <= rest1; k++) {
        tracer.print(() => rest1 - k);
        [f0, f1] = [f1, (f0 + f1) % FIB_MODULO];
        total1 = (total1 + S(f1)) % modulo1;
    }

    tracer.clear();

    return chineseRemainder(modulo1, modulo2, total1, total2);
}

assert.strictEqual($M[4][2][5], 6);
assert.strictEqual(S(10), 1972);
assert.strictEqual(S(100), 2019562);
assert.strictEqual(S(500), 253093976);

assert.strictEqual(
    TimeLogger.wrap('', () => S(10000)),
    258331114
);

console.log('Tests passed');
const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer}`);
