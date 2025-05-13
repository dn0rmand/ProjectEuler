const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e14;
const MODULO = 1234567891;
const TWO = 2;
const INV_TWO = TWO.modInv(MODULO);

let TWO_N = 0;
let prev_div = 1e9;
let prev_w2 = 0;

function getWays(n, div) {
    if (div === 1) {
        return 0;
    }

    if (prev_div + 1 === div) {
        prev_w2 = prev_w2.modMul(INV_TWO, MODULO);
        prev_div = div;
    } else if (div > prev_div) {
        const diff = div - prev_div;
        prev_w2 = prev_w2.modMul(INV_TWO.modPow(diff, MODULO), MODULO);
        prev_div = div;
    } else if (prev_div !== div) {
        prev_w2 = TWO.modPow(n - div, MODULO);
        prev_div = div;
    }

    const ways = (TWO_N - prev_w2) % MODULO;

    return ways;
}

function triangle(value) {
    if (value & 1) {
        return ((value + 1) / 2).modMul(value, MODULO);
    } else {
        return (value / 2).modMul(value + 1, MODULO);
    }
}

function S(n, trace) {
    TWO_N = TWO.modPow(n - 1, MODULO) + MODULO;
    prev_div = 1e9;
    prev_w2 = 0;

    let tracer = new Tracer(trace, 'High part');

    let total = 0;
    let max = 0;
    for (let div = 2; ; div++) {
        max = Math.floor(n / div);
        tracer.print(() => max);

        const min = Math.floor(n / (div + 1));
        if (max === min + 1) {
            break;
        }
        const ways = getWays(n, div);
        const times = triangle(max) + MODULO - triangle(min);
        total = (total + ways.modMul(times, MODULO)) % MODULO;
    }

    tracer.clear();

    tracer = new Tracer(trace, 'Low part');

    for (let k = max; k > 0; k--) {
        tracer.print(() => k);
        const ways = getWays(n, Math.floor(n / k));
        total = (total + ways.modMul(k, MODULO)) % MODULO;
    }

    tracer.clear();
    return total;
}

assert.strictEqual(S(10), 4927);
assert.strictEqual(S(1e7), 413590590);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(MAX, true));
console.log(`Answer is ${answer}`);
