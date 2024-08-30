const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const RAD2DEG = 180 / Math.PI;

function generateTriangles(max, trace, callback) {
    const tracer = new Tracer(trace, 'Generating triples');

    for (let n = 1; ; n++) {
        const n2 = n * n;
        const minM2 = (n + 1) * (n + 1);

        if (n2 + minM2 > max) {
            break;
        }

        tracer.print((_) => max - n2);

        for (let m = n + 1; ; m += 2) {
            const m2 = m * m;
            const A = m2 - n2;
            const B = 2 * m * n;
            const C = m2 + n2;
            if (C > max) {
                break;
            }
            if (n.gcd(m) !== 1) {
                continue;
            }
            const k = Math.floor(max / C);
            const a = k * A;
            const b = k * B;
            const c = k * C;

            if (a > b) {
                callback(b, a, c);
            } else {
                callback(a, b, c);
            }
        }
    }

    tracer.clear();
}

function getAngle(a, b) {
    const ca = Math.sqrt(b * b + (a * a) / 4);
    const cb = Math.sqrt(a * a + (b * b) / 4);
    const alphaA = Math.asin(a / 2 / ca) * RAD2DEG;
    const alphaB = Math.asin(b / 2 / cb) * RAD2DEG;

    const teta = 90 - (alphaB + alphaA);
    return teta;
}

function f(angle, L) {
    let result = Number.MAX_SAFE_INTEGER;
    let min = 100;

    generateTriangles(L, false, (a, b, c) => {
        const diff = Math.abs(angle - getAngle(a, b, c));
        if (diff < min) {
            min = diff;
            result = a + b + c;
        }
    });

    return result;
}

function F(N, L, trace) {
    const bests = new Float32Array(N + 1);
    const values = new Array(N + 1);

    values.fill(0);
    bests.fill(Number.MAX_SAFE_INTEGER);
    bests[0] = 0;

    const tracer = new Tracer(trace, 'Generating Triples');

    let count = 1591549475;
    generateTriangles(L, false, (a, b, c) => {
        count--;
        tracer.print(() => count);

        const angle = getAngle(a, b) ** 3;

        let start = Math.max(1, Math.floor(angle) - 1);

        for (let i = start; i <= N; i++) {
            let diff = Math.abs(angle - i);
            if (diff < bests[i]) {
                bests[i] = diff;
                values[i] = a + b + c;
            } else if (angle < i) {
                break;
            }
        }
    });

    tracer.clear();

    const total = values.reduce((a, v) => a + v, 0);

    return total;
}

assert.strictEqual(f(30, 100), 198);
assert.strictEqual(f(10, 1e6), 1600158);
assert.strictEqual(F(10, 1e6), 16684370);
assert.strictEqual(F(1388, 1e6), 2477897060);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => F(45000, 1e10, true));
console.log(`Answer is ${answer}`);
