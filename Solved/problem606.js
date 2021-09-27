const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const getDivisors = require('tools/divisors');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MAX       = 10n**36n;
const MAX_PRIME = 1E6;
const MODULO    = 1E9;
const MODULO_N  = BigInt(MODULO);

primeHelper.initialize(MAX_PRIME, true);

const allPrimes = primeHelper.allPrimes();

function gozinta(n)
{
    const divisors = [...getDivisors(n)].sort((a, b) => a-b);

    let total = 0;

    function inner(index, previous) 
    {
        total++;

        if (total > 252) {
            return false;
        }

        for(let i = index; i < divisors.length; i++) {
            const v = divisors[i];
            if (v === n) { break; }
            if (v % previous === 0) {
                if (! inner(i+1, v)) {
                    return false;
                }
            }
        }

        return true;
    }

    inner(1, 1);

    return total;
}

let $S = undefined;

function primeSum(n, factor, sumFunction, modulo, trace)
{
    if ($S && $S[n] !== undefined) {
        return $S[n];
    }

    const tracer = new Tracer(1, trace);
    const r = Math.floor(Math.sqrt(n));

    const V = [];
    const S = [];

    for(let i = 1; i < r+1; i++) {
        const v = Math.floor(n / i);
        V.push(v);
        S[v] = sumFunction(v);
    }

    let last = V[V.length-1];
    while (--last) {
        V.push(last);
        S[last] = sumFunction(last);
    }

    for(let p = 2; p < r+1; p++) {
        tracer.print(_ => r-p);
        const sp1 = S[p-1];
        if (S[p] !== sp1) {
            const p2 = p*p;
            const P  = p.modPow(factor, modulo);
            for (const v of V) {
                if (v < p2) {
                    break;
                }
                const vp = Math.floor(v / p);
                S[v] = (S[v] - P.modMul(S[vp] + modulo - sp1, modulo) + modulo) % modulo;
            }
        }
    }
    tracer.clear();

    $S = S;
    return S[n];
}

function cubeSum(max, trace) 
{
    const sum = primeSum(max, 3, n => {
        let v;
        if (n & 1) {
            v = n.modMul((n+1)/2, MODULO);
        } else {
            v = (n/2).modMul(n+1, MODULO);
        }
        
        return (v.modMul(v, MODULO) + MODULO - 1) % MODULO;
    }, MODULO, trace);

    return sum;
}

function cbrt(n)
{
    n = BigInt(n);
    const r = BigInt(Math.floor(Math.cbrt(Number(n))))+1n;

    while (r*r*r <= n) {
        r++;
    }

    return Number(r-1n);
}

function S(n, trace)
{
    const croot = cbrt(n);

    const tracer = new Tracer(1, trace);

    let lowerSum = 0;
    let total = 0;

    $S = undefined;

    cubeSum(croot, trace);
    
    for(const p of allPrimes) {
        if (p > croot) {
            break;
        }
        const maxQ = Math.floor(croot / p);

        if (maxQ <= p) {
            break;
        }

        tracer.print(_ => `${p} / ${maxQ}`);

        const p3 = p.modPow(3, MODULO);

        lowerSum = (lowerSum + p3) % MODULO;

        const sum  = (cubeSum(maxQ) + MODULO - lowerSum) % MODULO;
        
        total = (total + sum.modMul(p3, MODULO)) % MODULO;
    } 

    tracer.clear();

    return total;
}

assert.strictEqual(gozinta(12), 8);
assert.strictEqual(S(1E6), 8462952);
assert.strictEqual(S(1E12), 998881978);

console.log('Tests passed');

const answer = timeLogger.wrap('Solving', _ => S(MAX, true));
console.log(`Answer is ${answer}`);
