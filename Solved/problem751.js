const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const getDigits = require('@dn0rmand/project-euler-tools/src/digits');
const BigNumber = require('decimal.js');

const DECIMALS = 24;

BigNumber.set({
    precision: DECIMALS + 10,
    rounding: 1,
});

function getNext(digits) {
    const θ = BigNumber('2.' + digits.join(''));

    function bθ(n) {
        if (n < 1) throw 'ERROR: n should be at least 1';
        if (n === 1) {
            return θ;
        }

        const b = bθ(n - 1);
        const B = b.floor(0);

        const r = B.times(b.minus(B).plus(1));

        return r;
    }

    function aθ(n) {
        return bθ(n).floor().toNumber();
    }

    let n = 2;
    let m = 0;

    while (m < digits.length) {
        const an = aθ(n++);
        const ds = getDigits(an, 10);

        for (let i = 0; i < ds.length; i++) {
            if (ds[i] !== digits[m]) {
                throw 'No match';
            } else {
                m++;
            }
        }
    }

    const next = aθ(n);
    return getDigits(next, 10);
}

function solve(bits) {
    let digits = [];

    while (digits.length < bits) {
        const next = getNext(digits);
        digits = [...digits, ...next];
    }
    digits.length = bits;
    digits = [2, '.', ...digits];
    return digits.join('');
}

const answer = timeLogger.wrap('', (_) => solve(DECIMALS));
console.log(`Answer is ${answer}`);
