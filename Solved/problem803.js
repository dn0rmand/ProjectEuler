const assert = require('assert');
const {
    TimeLogger,
    Tracer,
} = require('@dn0rmand/project-euler-tools');

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const AMODULO = 2 ** 48;
const BMODULO = 52;
const DIVISOR = 2 ** 16;
const CONSTANT = 25214903917;

function getSequence(a0, length, bModulo) {
    bModulo = bModulo || BMODULO;

    let s = [];
    for (let i = 0, a = a0; i < length; i++, a = (a.modMul(CONSTANT, AMODULO) + 11) % AMODULO) {
        s.push(LETTERS[Math.floor(a / DIVISOR) % bModulo]);
    }
    return s.join('');
}

function checkSequence(a0, seq, bModulo) {
    bModulo = bModulo || BMODULO;

    let a = a0;
    for (const c of seq) {
        const b = Math.floor(a / DIVISOR) % bModulo;
        if (c !== b) {
            return false;
        }
        a = (a.modMul(CONSTANT, AMODULO) + 11) % AMODULO;
    }
    return true;
}

function startsWith(a0, s) {
    const s2 = getSequence(a0, s.length);
    return s === s2;
}

function getA0(str, min) {
    const tracer = new Tracer(true);

    const s = str.split('').map(c => LETTERS.indexOf(c));
    const s4 = s.map(c => c % 4);

    // Find lower bits
    let a0 = s[0] * DIVISOR;

    for (let i = 0; i < DIVISOR; i++) {
        tracer.print(_ => i);
        if (checkSequence(a0 + i, s4, 4)) {
            a0 += i;
            break;
        }
    }

    const DIVISOR52 = 52 * DIVISOR;

    if (min) {
        const k = Math.floor((min - a0) / DIVISOR52);
        a0 += k * DIVISOR52;
    }

    for (let a = a0;; a += DIVISOR52) {
        tracer.print(_ => a);

        if (checkSequence(a, s)) {
            tracer.clear();
            return a;
        }
    }
}

function solve() {
    const a1 = TimeLogger.wrap('PuzzleOne', _ => getA0('PuzzleOne', 78580612777175));
    const a2 = TimeLogger.wrap('LuckyText', _ => getA0('LuckyText', a1));

    const {
        CA,
        C11
    } = TimeLogger.wrap('Constants', _ => {
        let CA = CONSTANT.modPow(DIVISOR, AMODULO);
        let C11 = 0;

        for (let i = 0; i < DIVISOR; i++) {
            C11 = (C11 + CONSTANT.modPow(i, AMODULO)) % AMODULO;
        }
        C11 = C11.modMul(11, AMODULO);

        return {
            CA,
            C11
        };
    });

    return TimeLogger.wrap('Difference', _ => {
        const tracer = new Tracer(true);

        const MASK = DIVISOR - 1;

        let steps = 0;
        let a = a1;
        const A2 = a2 & MASK;
        while ((a & MASK) !== A2) {
            steps++;
            a = (a.modMul(CONSTANT, AMODULO) + 11) % AMODULO;
            tracer.print(_ => steps);
        }

        while (a !== a2) {
            steps += DIVISOR;
            a = (a.modMul(CA, AMODULO) + C11) % AMODULO;
            tracer.print(_ => steps);
        }
        tracer.clear();
        return steps;
    });
}

assert.strictEqual(startsWith(123456, 'bQYicNGCY'), true);
assert.strictEqual(startsWith(78580612777175, 'EULERcats'), true);

assert.strictEqual(getA0('bQYicNGCY'), 123456);
// assert.strictEqual(getA0('EULERcats'), 78580612777175);

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => solve());
console.log(`Answer is ${answer}`);