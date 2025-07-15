const assert = require('assert');
const { TimeLogger, primeHelper, BigMap, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e14;
const MAX_PRIME = 1e7;
const MODULO = 1e9 + 7;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes();

const [allGroups, allGroupPowers] = (function () {
    const groups = [];
    const groupPowers = [];
    const maxPrime = allPrimes[allPrimes.length - 1];
    for (let i = 1, power = 2, nextPower = 4; power <= maxPrime; i++, power *= 2, nextPower *= 2) {
        const primes = allPrimes.filter((p) => p < nextPower && p & power);
        groups[i - 1] = primes;
        groupPowers[i - 1] = power;
    }
    return [groups, groupPowers];
})();

const $squares = TimeLogger.wrap('Generating Squares', () => {
    const squares = new BigMap();
    squares.set(0, 0);
    let sum = 0;
    const tracer = new Tracer(true);
    for (let i = 1; ; i++) {
        const s = i * i;
        if (s > MAX) {
            break;
        }
        tracer.print(() => MAX - s);
        sum = (sum + s) % MODULO;
        squares.set(i, sum);
    }
    tracer.clear();
    return squares;
});

function nimSolver(piles) {
    let value = 0;

    for (const v of piles) {
        value ^= v;
    }
    return value === 0;
}

function s(n) {
    const piles = [];

    primeHelper.factorize(n, (p, e) => {
        if (e & 1) {
            piles.push(p);
        }
    });

    return nimSolver(piles);
}

let currentMax = 0;
let groups = [];
let groupPowers = [];

function setCurrentMax(max) {
    currentMax = max;
    groups = allGroups.filter((primes) => primes[0] ** 2 <= currentMax);
    groupPowers = allGroupPowers.slice(0, groups.length);

    groups.reverse();
    groupPowers.reverse();
}

function innerS(value, group, index, nim) {
    if (group >= groups.length) {
        if (nim === 0) {
            const maxSquare = Math.floor(currentMax / value);
            const theSquare = Math.floor(Math.sqrt(maxSquare));
            return $squares.get(theSquare).modMul(value, MODULO);
        } else {
            return 0;
        }
    }

    const primes = groups[group];
    const groupPower = groupPowers[group];

    let sum = 0;

    if ((nim & groupPower) === 0) {
        sum = (sum + innerS(value, group + 1, 0, nim)) % MODULO;
    }

    for (let i = index; i < primes.length; i++) {
        const p = primes[i];
        const v = value * p;
        if (v > currentMax) {
            break;
        }
        sum = (sum + innerS(v, group, i + 1, nim ^ p)) % MODULO;
    }

    return sum;
}

function S(max) {
    setCurrentMax(max);
    const total = innerS(1, 0, 0, 0);
    return total;
}

assert.strictEqual(s(1), true);
assert.strictEqual(s(70), true);
assert.strictEqual(S(10), 14);
assert.strictEqual(S(100), 455);
assert.strictEqual(S(1e8), 692344456);
assert.strictEqual(S(1e9), 749204238);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(MAX));
console.log(`Answer is ${answer}`);
