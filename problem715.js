const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MAX       = 1E12;
const MAX_PRIME = 1E7;
const MODULO    = 1000000007;

primeHelper.initialize(MAX_PRIME);

const TWO = Number(2);

class Cache
{
    constructor()
    {
        this.map = new Map();
    }

    get(p, e)
    {
        let a = this.map.get(p);
        if (a !== undefined)
            return a.get(e);
    }

    set(p, e, value)
    {
        let a = this.map.get(p);
        if (a === undefined)
        {
            a = new Map();
            this.map.set(p, a);
        }
        a.set(e, value);
    }
}

function fp(p, e)
{
    if (p === 2)
    {
        return TWO.modPow(e*6 - 1, MODULO);
    }
    else
    {
        const p2  = (3*(p-1)/2) & 1 ? -1 : 1;
        const e64 = p.modPow(e*6 - 4, MODULO);
        let   p3  = p.modPow(3, MODULO) - p2;
        while (p3 < 0)
            p3 += MODULO;

        return (p-1).modMul(e64, MODULO).modMul(p3, MODULO);
    }
}

function f(n)
{
    let total = 1;

    primeHelper.factorize(n, (p, e) => {
        total = total.modMul(fp(p, e), MODULO);
    });

    return total;
}

const $FP = new Cache();

function FP(p, e)
{
    let result = $FP.get(p, e);
    if (result !== undefined)
        return result;

    const k      = p ** e; 
    const phi    = k-(k/p);
    const bottom = k.modMul(k, MODULO).modMul(phi, MODULO);
    const top    = fp(p, e);

    result = top.modDiv(bottom, MODULO);

    $FP.set(p, e, result);
    return result;
}

function F(k)
{
    let total = 1;

    primeHelper.factorize(k, (p, e) => {
        total = total.modMul(FP(p, e), MODULO);
    });

    return total;
}

function G(n, trace)
{
    let total = 0;

    const tracer = new Tracer(100000, trace);

    for(let k = 1; k <= n; k++)
    {
        tracer.print(_ => n-k);
        total = (total + F(k)) % MODULO;
    }

    tracer.clear();

    return total;
}

assert.equal(G(10), 3053);
assert.equal(G(1E5), 157612967);

console.log('Tests passed');

timeLogger.wrap('', _ => {
    let total = 0;
    for(let i = 0; i < MAX; i++)
    {
        total = i
    }
    return total;
});
// const answer = timeLogger.wrap('', _ => G(MAX, true));
// console.log(`Answer is ${answer}`);