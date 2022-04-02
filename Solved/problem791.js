const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const announce = require('tools/announce');

const MODULO = 433494437;

require('tools/numberHelper');

function S(n, trace) {
    let total = 0;

    const {
        abs,
        max,
        round,
        floor,
        ceil,
        sqrt
    } = Math;

    const tracer = new Tracer(1, trace);

    const maxA = ceil(sqrt(n + n));

    let maxB = 0;
    let loopA = 0;
    let loopB = 0;
    let loopC = 0;

    const avg = (v, count) => {
        if (count === 0) {
            return 0;
        }
        return round(v / count);
    }

    for (let a = -maxA; a < 0; a += 0.5) {
        loopA++;
        tracer.print(_ => {
            const str = `${floor(abs(a))} - ${avg(loopB, loopA)} - ${avg(loopC, loopB)}`;
            loopA = loopB = loopC = 0;
            return str;
        });

        const a2 = a * a;

        maxB = ceil(sqrt(n + n - a2))

        const startB = -maxB + (floor(a) !== a ? 0.5 : 0);

        for (let b = max(a, startB); b <= maxB; b++) {
            loopB++;
            const b2 = b * b;

            const minMEAN = (a2 + b2 + 2 * max(0, b) ** 2) / 2;
            if (b + minMEAN > n) {
                break;
            }

            const maxC = -(a + b) / 2;

            const startC = -maxC + (floor(a) !== a ? (maxC < 0 ? 0.5 : -0.5) : 0);

            for (let c = max(b, startC); c <= maxC; c++) {
                loopC++;
                const c2 = (c * c);
                const d = -(a + b + c);
                const d2 = d * d;
                const MEAN = (a2 + b2 + c2 + d2) / 2;

                if ((d + MEAN) > n) {
                    continue;
                }

                if ((a + MEAN) > 0) {
                    total = (total + MEAN.modMul(4, MODULO)) % MODULO;
                }
            }
        }
    }

    tracer.clear();
    return total;
}

async function main() {
    assert(S(5), 48);
    assert(timeLogger.wrap('S(1000)', _ => S(1000, true)), 37048340);

    console.log('Tests passed');

    const answer = timeLogger.wrap('S(1E8)', _ => S(1E8, true));
    console.log(`Answer is ${answer}`);
    await announce(791, `Answer is ${answer}`);
}

main();