const assert = require("assert");
const { TimeLogger, totientSum } = require("@dn0rmand/project-euler-tools");

const MAX = 1e11;
const MODULO = 1e9;

const CONSTANT = 510510; // 2 x 3 x 5 x 7 x 11 x 13 x 17
const CONSTANT_PRIMES = [2, 3, 5, 7, 11, 13, 17];
const MAIN_PHI = 92160;

/***********************************************/
/*  S(pk,n) = (p-1)S(k,n) + S(pk, floor(n/p)}) */
/**********************************************/
function S(m) {
    function innerS(n, m, phi) {
        if (m === 0) {
            return 0;
        } else if (m === 1) {
            return phi;
        } else if (n === 1) {
            return totientSum(m, MODULO);
        } else {
            const prime = CONSTANT_PRIMES.find((p) => n % p === 0);

            const right = innerS(n, Math.floor(m / prime), phi);
            const left = (prime - 1).modMul(innerS(n / prime, m, phi / (prime - 1)));

            return (left + right) % MODULO;
        }
    }

    return innerS(CONSTANT, m, MAIN_PHI);
}

assert.strictEqual(S(100), 459970560);
assert.strictEqual(S(200), 830481920);
assert.strictEqual(S(1000), 528791040);
assert.strictEqual(S(10000), 570531840);
assert.strictEqual(S(100000), 455982080);
assert.strictEqual(S(1e6), 821125120);
assert.strictEqual(S(1e8), 45263360);

console.log("Tests passed");

const answer = TimeLogger.wrap("", () => S(MAX));
console.log(`Answer is ${answer}`);
