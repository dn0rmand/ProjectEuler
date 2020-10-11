const assert = require('assert');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MODULO = 1000000033

const DIV6 = Number(6).modInv(MODULO);
// const TWO = 2;

const $TWO = [];
function TWO(n)
{
    if ($TWO[n] !== undefined)
        return $TWO[n];

    let v = 2;
    v = v.modPow(n, MODULO);
    $TWO[n] = v;
    return v;
}

function f(n)
{
    const power = (n+1).modMul(n, MODULO).modMul(n-1, MODULO).modMul(DIV6, MODULO);

    let p = TWO(power);
    for(let k = 1; k < n+1; k++)
    {
        let p2 = TWO(k) - 1;

        if (p2 < 0)
            p2 += MODULO;

        const p3 = p2.modPow(n+1-k, MODULO);

        p = p.modMul(p3, MODULO);
    }

    return p;
}

function S(n, trace)
{
    let total = 0;

    const tracer = new Tracer(100, trace);
    for(let i = 1; i <= n; i++)
    {
        tracer.print(_ => i);
        total = (total + f(i)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.equal(f(1), 1);
assert.equal(f(2), 6);
assert.equal(f(3), 1008);

console.log('Tests passed');

const answer = S(10000, true);

console.log(`Answer is ${answer}`);