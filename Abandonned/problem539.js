const assert = require('assert');

const MODULO = 987654321;
const MODULO_N = BigInt(MODULO);
const MAX = 10n ** 18n;

const $P = [];

function PP(n) {
    if (n <= 1) {
        return 1;
    }

    if ($P[n]) {
        return $P[n];
    }

    let a;

    if (n & 1) {
        a = (n + 1 - 2 * PP((n - 1) / 2)) % MODULO;
    } else {
        a = (n + 2 - 2 * PP(n / 2)) % MODULO;
    }

    $P[n] = a;

    return a;
}

function P(n) {
    if (n <= Number.MAX_SAFE_INTEGER) {
        return PP(Number(n));
    }

    let a;

    if (n & 1n) {
        a = Number((n + 1n) % MODULO_N);
        a = (a + 2 * (MODULO - P((n - 1n) / 2n))) % MODULO;
    } else {
        a = Number((n + 2n) % MODULO_N);
        a = (a + 2 * (MODULO - P(n / 2n))) % MODULO;
    }

    return Number(a);
}

function S(n) {
    let total = 0;

    for (let i = 1n; i <= n; i++) {
        total = (total + P(i)) % MODULO;
    }

    return total;
}

assert.strictEqual(P(1), 1);
assert.strictEqual(P(9), 6);
assert.strictEqual(P(1000), 510);
assert.strictEqual(S(1000), 268271);

console.log('Tests passed');

console.log(P(MAX));