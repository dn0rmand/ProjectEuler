const assert = require('assert');
const BigNumber = require('decimal.js');

const MAX_CYCLE_LENGTH = 100;
const DECIMALS = MAX_CYCLE_LENGTH * 4 + 1;
const MODULO = BigInt(1e15);

BigNumber.set({
    rounding: 1,
    precision: DECIMALS,
});

const T = (function () {
    let values = [];
    let current = 1;
    while (current < 1000) {
        current++;
        let s = Math.sqrt(current);
        if (s !== Math.floor(s)) values.push(current);
    }

    return values;
})();

function getQ(value) {
    function* A(value) {
        value = BigNumber(value).sqrt();
        const a = [];

        a[0] = Math.floor(value.toNumber());

        yield a[0];

        const end = a[0] * 2;
        let index = 0;

        while (a[index] != end) {
            value = BigNumber(1).dividedBy(value.minus(a[index]));
            let v = Math.floor(value.toNumber());
            yield v;
            a[++index] = v;
        }

        index = 0;
        while (true) {
            yield a[++index];
            index = index % (a.length - 1);
        }
    }

    let Q0 = 1n;
    let Q1 = 0n;

    let result = [];

    for (let an of A(value)) {
        let Q2 = BigInt(an) * Q1 + Q0;

        result.push(Q2);
        Q0 = Q1;
        Q1 = Q2;

        if (result.length === 200) break;
    }

    return result;
}

function H(g, α) {
    let total = 0n,
        count = 0;

    function add(value) {
        if (count >= g) return;

        total = (total + value) % MODULO;
        count++;
    }

    const Q = getQ(α);

    let index = 1;

    const q1 = Q[index];

    for (let i = 1n; i <= q1 && count < g; i++) {
        add(i);
    }

    while (count < g) {
        index += 2;
        if (index >= Q.length) throw 'Oops';

        let offset = Q[index - 1];
        let start = Q[index - 2];
        let end = Q[index];

        let value = start + offset;
        while (count < g && value <= end) {
            add(value);
            value += offset;
        }
        if (value < end && count < g) add(end);
    }

    return total;
}

function solve() {
    let total = 0n;

    for (const β of T) {
        total = (total + H(100, β)) % MODULO;
    }

    return total;
}

assert.equal(H(20, 31), 150243655);

const answer = solve();

console.log(`Answer is ${answer}`);
