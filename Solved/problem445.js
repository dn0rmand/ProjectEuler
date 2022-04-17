const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const MAX = 1E7;
const MODULO = 1000000007;

require('@dn0rmand/project-euler-tools/src/numberHelper');

primeHelper.initialize(MAX);

const $modInv = new Uint32Array(MODULO);

function modInv(n) 
{
    if (!$modInv[n]) {
        $modInv[n] = n.modInv(MODULO);
    }
    return $modInv[n];
}

function solve(n)
{
    const tracer = new Tracer(50000, true);

    let total = 0;
    let R = 1;
    let nCk = 1;
    let nCkSum = 0;

    const factors = new Uint32Array(n+1);
    const changed = new Map();
    const middle = n/2;

    for(let k = 1; k <= middle; k++) {
        const factor = k === middle ? 1 : 2;

        tracer.print(_ => middle-k);
        nCk = nCk.modMul(n+1-k, MODULO).modMul(modInv(k), MODULO);
        nCkSum = (nCkSum + factor*nCk) % MODULO;

        changed.clear();

        primeHelper.factorize((n+1-k), (p, f) => {
            changed.set(p, f);
        });

        primeHelper.factorize(k, (p, f) => {
            changed.set(p, (changed.get(p) || 0) - f);
        });

        changed.forEach((f, p) => {
            const $old = factors[p] || 0;
            const $new = $old + f;

            if ($old === $new) {
                return;
            }

            factors[p] = $new;

            if ($new) {                
                R = R.modMul(p**$new + 1, MODULO);
            }

            if ($old) {
                R = R.modMul(modInv(p**$old + 1), MODULO);
            }
        });

        total = (total + factor*R) % MODULO;
    }

    total = (total + MODULO - nCkSum) % MODULO;

    tracer.clear();
    return total;
}

assert.strictEqual(solve(20), 1045006);
assert.strictEqual(timeLogger.wrap('', _ => solve(100000)), 628701600);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);