//
// Javascript too slow. Solved with C# in 3 hours 30 minutes
//
const assert = require('assert');
const { TimeLogger, ULong } = require('@dn0rmand/project-euler-tools');
const ProgressBar = require('progress');

const MODULO = 2n ** 60n;
const MAX = 10n ** 8n;

let REF_N = undefined;
let BAR = undefined;

const MODULO1 = ULong.fromBigInt(MODULO - 1n);

function yy(k, xCurrent, xPrevious) {
    if (k.gte(REF_N)) return xCurrent;

    BAR.tick();

    const k2 = k.add(k);
    const xy = xCurrent.add(xPrevious).shl(1); // 2*xCurrent+2*xPrevious

    const left = yy(k2, xy.add(xCurrent).and(MODULO1), xCurrent);
    const right = yy(k2.add(ULong.ONE), xy.add(xPrevious).and(MODULO1), xCurrent);

    if (left.gte(right)) return MODULO1.sub(left);
    else return MODULO1.sub(right);
}

function A(n, trace) {
    let bar;

    if (trace) {
        bar = new ProgressBar('  Calculating :percent [:bar]', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: Number(n),
            renderThrottle: 1000,
        });
    }

    try {
        BAR = bar || { tick: () => {} };
        REF_N = ULong.fromBigInt(n);
        STEPS = n;
        const res = yy(ULong.fromNumber(1), ULong.fromNumber(1), ULong.fromNumber(0));

        return res.toBigInt();
    } finally {
        if (trace) {
            console.log();
        }
    }
}

assert.equal(A(4n), 8);
assert.equal(A(10n), MODULO - 34n);

assert.equal(A(1000n), 101881);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => A(MAX, true));

console.log(`Answer is ${answer}`);
