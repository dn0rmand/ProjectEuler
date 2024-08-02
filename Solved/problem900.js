const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 900497239;
const MODULO_N = BigInt(MODULO);

class Cache {
    constructor() {
        this.data = [];
    }

    get(minPile, coins) {
        let a = this.data[minPile];
        if (a) {
            return a[coins];
        }
    }

    set(minPile, coins, value) {
        let a = this.data[minPile];
        if (!a) {
            a = [];
            this.data[minPile] = a;
        }

        a[coins] = value;
    }

    clear() {
        this.data = [];
    }
}

const $winning = new Cache();
const $losing = new Cache();

function getNewMin(minPile, coins, piles) {
    while (piles * minPile > coins) {
        minPile--;
    }
    return minPile;
}

function isWinning(minPile, coins, piles) {
    minPile = getNewMin(minPile, coins, piles);
    if (minPile < 1 || coins <= piles) {
        return false;
    }

    let r = $winning.get(minPile, coins);
    if (r !== undefined) {
        return r;
    }

    r = false;

    for (let i = 0; i < minPile; i++) {
        let m = minPile - i;
        let c = coins - minPile;
        if (m < 1 || c < piles) {
            continue;
        }
        if (isLosing(m, c, piles)) {
            r = true;
            break;
        }
    }

    $winning.set(minPile, coins, r);
    return r;
}

function isLosing(minPile, coins, piles) {
    minPile = getNewMin(minPile, coins, piles);
    if (minPile < 1 || coins <= piles) {
        return true;
    }

    let r = $losing.get(minPile, coins);
    if (r !== undefined) {
        return r;
    }

    r = true;

    for (let i = 0; i < minPile; i++) {
        let m = minPile - i;
        let c = coins - minPile;
        if (m < 1 || c < piles) {
            continue;
        }
        if (!isWinning(m, c, piles)) {
            r = false;
            break;
        }
    }

    $losing.set(minPile, coins, r);
    return r;
}

function t(n) {
    $losing.clear();
    $winning.clear();

    for (let k = 0; ; k++) {
        const coins = n * n + (n + k);
        if (isLosing(n, coins, n + 1)) {
            return k;
        }
    }
}

function S(N) {
    function bruteS(n) {
        const max = 2 ** n;

        let total = 0;

        for (let o = 3; o <= max; o += 2) {
            for (let m = o; m <= max; m *= 2) {
                total += t(m);
            }
        }
        return total;
    }

    if (N <= 4) {
        return bruteS(N);
    }

    let extra = 16;
    let low = 16;
    let high = 64;

    let s = bruteS(4);
    for (let x = 5; x <= N; x++) {
        const v = (high * 4 + low + low) % MODULO;
        s = (s + v) % MODULO;
        extra = (extra + extra) % MODULO;
        low = (low + low) % MODULO;
        high = (high * 4) % MODULO;
        if (x % 2 === 0) {
            low = (low + low + extra) % MODULO;
        }
    }

    return s;
}

assert.strictEqual(t(1), 0);
assert.strictEqual(t(2), 0);
assert.strictEqual(t(3), 2);
assert.strictEqual(S(7), 5938);
assert.strictEqual(S(8), 23090);
assert.strictEqual(S(10), 361522);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => S(1e4));
console.log(`Answer is ${answer}`);
