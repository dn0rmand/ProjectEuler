const assert = require('assert');
const { TimeLogger, Tracer, BigMap } = require('@dn0rmand/project-euler-tools');

const MAX = 13;

const DEAD_MASK = 2 ** 6 - 1;

const powersOfTwo = (function () {
    const p = [];
    for (let i = 0; i < 7; i++) {
        p[i] = 2 ** i;
    }
    return p;
})();

function isInvalid(offsets, mod) {
    switch (offsets) {
        case 0:
            return false;
        case 1:
            return mod === 1;
        case 2:
            return mod === 2;
        case 3:
            return mod === 1 || mod === 2;
        case 4:
            return mod === 3;
        case 5:
            return mod === 1 || mod === 3;
        case 6:
            return mod === 2 || mod === 3;
        case 7:
            return mod === 1 || mod === 2 || mod === 3;
        case 8:
            return mod === 4;
        case 9:
            return mod === 1 || mod === 4;
        case 10:
            return mod === 2 || mod === 4;
        case 11:
            return mod === 1 || mod === 2 || mod === 4;
        case 12:
            return mod === 3 || mod === 4;
        case 13:
            return mod === 1 || mod === 3 || mod === 4;
        case 14:
            return mod === 2 || mod === 3 || mod === 4;
        case 15:
            return mod !== 5 && mod !== 6;
        case 16:
            return mod === 5;
        case 17:
            return mod === 1 || mod === 5;
        case 18:
            return mod === 2 || mod === 5;
        case 19:
            return mod === 1 || mod === 2 || mod === 5;
        case 20:
            return mod === 3 || mod === 5;
        case 21:
            return mod === 1 || mod === 3 || mod === 5;
        case 22:
            return mod === 2 || mod === 3 || mod === 5;
        case 23:
            return mod !== 4 && mod !== 6;
        case 24:
            return mod === 4 || mod === 5;
        case 25:
            return mod === 1 || mod === 4 || mod === 5;
        case 26:
            return mod === 2 || mod === 4 || mod === 5;
        case 27:
            return mod !== 3 && mod !== 6;
        case 28:
            return mod === 3 || mod === 4 || mod === 5;
        case 29:
            return mod !== 2 && mod !== 6;
        case 30:
            return mod !== 1 && mod !== 6;
        case 31:
            return mod !== 6;
        case 32:
            return mod === 6;
        case 33:
            return mod === 1 || mod === 6;
        case 34:
            return mod === 2 || mod === 6;
        case 35:
            return mod === 1 || mod === 2 || mod === 6;
        case 36:
            return mod === 3 || mod === 6;
        case 37:
            return mod === 1 || mod === 3 || mod === 6;
        case 38:
            return mod === 2 || mod === 3 || mod === 6;
        case 39:
            return mod !== 4 && mod !== 5;
        case 40:
            return mod === 4 || mod === 6;
        case 41:
            return mod === 1 || mod === 4 || mod === 6;
        case 42:
            return mod === 2 || mod === 4 || mod === 6;
        case 43:
            return mod !== 3 && mod !== 5;
        case 44:
            return mod === 3 || mod === 4 || mod === 6;
        case 45:
            return mod !== 2 && mod !== 5;
        case 46:
            return mod !== 1 && mod !== 5;
        case 47:
            return mod !== 5;
        case 48:
            return mod === 5 || mod === 6;
        case 49:
            return mod === 1 || mod === 5 || mod === 6;
        case 50:
            return mod === 2 || mod === 5 || mod === 6;
        case 51:
            return mod !== 3 && mod !== 4;
        case 52:
            return mod === 3 || mod === 5 || mod === 6;
        case 53:
            return mod !== 2 && mod !== 4;
        case 54:
            return mod !== 1 && mod !== 4;
        case 55:
            return mod !== 4;
        case 56:
            return mod === 4 || mod === 5 || mod === 6;
        case 57:
            return mod !== 2 && mod !== 3;
        case 58:
            return mod !== 1 && mod !== 3;
        case 59:
            return mod !== 3;
        case 60:
            return mod !== 1 && mod !== 2;
        case 61:
            return mod !== 2;
        case 62:
            return mod !== 1;
        case 63:
            return true;
    }
}

function C(n, trace) {
    const tracer = new Tracer(trace);

    function inner(mod, offsets, pendings, digits, factor) {
        const length = digits.length;

        if (length === 5) {
            tracer.print(() => `${digits.slice().reverse().join('')}`);
        }
        if (offsets === DEAD_MASK) {
            return 0;
        }

        let total = 0;

        if (mod !== 0 && digits[0] !== 0 && !isInvalid(offsets, mod)) {
            total = 1;
        }

        offsets |= pendings;

        if (length < n && offsets !== DEAD_MASK) {
            const first = length + 1 === n ? 1 : 0;
            const newDigits = [first, ...digits];
            for (let d = first; d < 8; d++) {
                const newMod = (mod + factor * d) % 7;
                let newOffsets = offsets;
                newDigits[0] = d;
                pendings = 0;
                for (let i = 1; i <= length && newOffsets !== DEAD_MASK; i++) {
                    if (newDigits[i] === d) {
                        continue;
                    }

                    newDigits[0] = newDigits[i];
                    newDigits[i] = d;
                    const value = newDigits.reduce((a, d) => a * 10 + d, 0) % 7;
                    newDigits[i] = newDigits[0];
                    newDigits[0] = d;

                    const offset = (newMod - value + 7) % 7;

                    if (offset) {
                        if (newDigits[i] === 0) {
                            pendings |= powersOfTwo[offset - 1];
                        } else {
                            newOffsets |= powersOfTwo[offset - 1];
                        }
                    }
                }

                const count = d === 1 || d === 2 ? 2 : 1;
                total += count * inner(newMod, newOffsets, pendings, newDigits, factor * 10);
            }
        }

        return total;
    }

    const total = inner(0, 0, 0, [], 1);
    tracer.clear();

    return total;
}

assert.strictEqual(C(2), 74);
assert.strictEqual(C(3), 573);
assert.strictEqual(C(4), 3737);
assert.strictEqual(C(6), 96202);
assert.strictEqual(C(7), 423191);
assert.strictEqual(
    TimeLogger.wrap('C(8)', () => C(8)),
    1788771
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => C(MAX, true));
console.log(`Answer is ${answer}`);
