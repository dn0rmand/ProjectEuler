const assert = require('assert');
const primeHelper = require('tools/primeHelper')();
const divisors = require('tools/divisors');

const MAX = 10000000;
const MODULO = 1000000087;

primeHelper.initialize(MAX);

function ω(n)
{
    let total = 0;
    primeHelper.factorize(n, (p, count) => {
        total++;
    });

    return total;
}

function S(n)
{
    let total = 0;
    for (let d of divisors(n, primeHelper.isKnownPrime))
    {
        let w = ω(d);
        total += (2 ** w);
    }
    return total;
}

function factorial(n)
{
    let v = 1;

    for (let i = 2; i <= n; i++)
        v *= i;

    return v;
}

function F(n)
{
    let total = 0;

    for (let i = 2; i <= n; i++)
    {
        let v = S(factorial(i));
        // console.log(i, '->', v);
        total += v;
    }
    return total;
}

function analyze()
{
    let v1 = factorial(9);
    let d1 = [];

    for (let d of divisors(v1))
        d1.push(d);

    let v2 = 10*v1;
    let d2 = [];
    for (let d of divisors(v2))
        if (!d1.includes(d))
            d2.push(d);

    for (let d of d2)
    {
        let s = d + ' -> ';
        primeHelper.factorize(d, (p, c) => {
            s += p + ', '
        });
        console.log(s);
    }
}

analyze();

// assert.equal(S(6), 9);
assert.equal(F(10), 4821);
console.log('Tests passed');

/*
 2! => 0*1 1* 1
 3! => 0*1 1* 2 2* 1
 4! => 0*1 1* 4 2* 3
 5! => 0*1 1* 5 2* 7 3*  3
 6! => 0*1 1* 7 2*14 3*  8
 7! => 0*1 1* 8 2*21 3* 22 4* 8
 8! => 0*1 1*11 2*33 3* 37 4*14
 9! => 0*1 1*13 2*51 3* 67 4*28
10! => 0*1 1*15 2*70 3*120 4*64

S(2!) = 3
S(3!) = 9       +6
S(4!) = 21      +12
S(5!) = 63      +42
S(6!) = 135     +72
S(7!) = 405     +270
S(8!) = 675     +270
S(9!) = 1215    +540
S(10!) = 2295   +1080
*/