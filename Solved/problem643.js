// 2-Friendly
// ----------
// Problem 643 
// -----------
// Two positive integers a and b are 2-friendly when gcd(a,b)=2^t,t>0. For example, 24 and 40 are 2-friendly 
// because gcd(24,40)= 8 = 2^3 while 24 and 36 are not because gcd(24,36)=12=2^2*3 not a power of 2.

// Let f(n) be the number of pairs, (p,q), of positive integers with 1 ≤ p < q ≤ n such that p and q are 2-friendly. 
// You are given f(10^2)=1031 and f(10^6)=321418433 modulo 1000000007.

// Find f(10^11) modulo 1000000007.

const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');
// const announce = require('@dn0rmand/project-euler-tools/src/announce');

const MODULO    = 1000000007;
const MODULO_N  = BigInt(MODULO);
const MAX       = 1E11;

const ONE   = BigInt(1);
const TWO   = BigInt(2);
const THREE = BigInt(3);

const $A = new Map();

// a(n) = n(n+3)/2 - Sum(k = 2 to n, a([n/k]));
function A(n)
{
    if (n === 0)
        return 1;

    let v = $A.get(n);
    if (v !== undefined)
        return v;

    v = BigInt(n);
    v = (v * (v + THREE)) / TWO;

    let root = Math.floor(Math.sqrt(n));

    for (let k = 2; k <= root; k++)
    {
        let m = Math.floor(n/k);
        v -= A(m);
    }

    for (let k = 1; k <= root; k++)
    {
        let m1 = Math.floor(n/k);
        if (m1 === k)
            continue; // Avoid duplicates
        let m2 = Math.floor(n/(k+1));
        let count = BigInt(m1-m2);
        let m = A(k);

        v -= count*A(k);
    }

    $A.set(n, v);
    return v;
}

async function F(n, trace)
{
    let values = [];

    let m = Math.floor(n / 2);
    while (m > 1)
    {
        values.push(m);
        m = Math.floor(m / 2);
    }

    let total = 0;
    let size  = values.length;
    let count = size;
    while (values.length > 0)
    {
        m = values.pop();
        if (trace)
        {
            console.log(count,':',m);
            count--;
        }
        let v = (A(m) - TWO) % MODULO_N;
        total = (total + Number(v)) % MODULO;
    }

    return total;
}

async function test()
{
    assert.equal(await F(1E2), 1031);
    assert.equal(await F(1E6), 321418433);
    console.log('Tests passed');
}

async function solve()
{
    timeLog.wrap("Problem 643", async () => {    
        let answer = await F(MAX, true);
        // await announce(643, "Answer is " + answer);
        console.log('Answer is', answer);
    });
}

(async function()
{
    await test();
    await solve();
})();
