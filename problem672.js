const assert = require('assert');
const BigNumber = require('bignumber.js');
const MODULO = 1117117717; // Prime #
const MAX    = 1000000000;

const digits = [0,4,3,1,1,6,2,3,5,5].reverse();

function analyze()
{
    let p = BigNumber(1);
    for (let i = 1; i < 100; i++)
    {
        p = p.times(7);
        let n = p.minus(1).dividedBy(11);
        if (n.isInteger())
        {
            console.log(i, n.toString(7));
        }
    }
}

function g(value)
{
    // ignore first 0s
    while (value > 0 && (value % 7) === 0)
        value /= 7;

    if (value <= 1)
        return 0;

    let d = value % 7;
    value = (value - d) / 7;

    let total = 7 - d;

    while (value > 0)
    {
        let d = value % 7;
        total = total + 6 - d;

        value = (value - d) / 7;
    }

    return total;
}

function S(n)
{
    n = Math.floor(n);

    let total = 0;

    for (let i = 1; i <= n; i++)
        total = (total + g(i)) % MODULO;

    return total;
}

function H(k)
{
    let n = (7**k - 1)/11;
    if (n > Number.MAX_SAFE_INTEGER)
        return false;
    else
        return S(n);
}

//analyze();

function test(digit1, digit2)
{
    let value = digit1*7 + digit2;
    let v2    = S(digit2);
    let base  = S(6);

    console.log(`S(10) -> ${ S(Number.parseInt("10", 7)).toString(7) }`);
    console.log(`S(11) -> ${ S(Number.parseInt("11", 7)).toString(7) }`);
    console.log(`S(12) -> ${ S(Number.parseInt("12", 7)).toString(7) }`);
    console.log(`S(13) -> ${ S(Number.parseInt("13", 7)).toString(7) }`);
    console.log(`S(14) -> ${ S(Number.parseInt("14", 7)).toString(7) }`);

    console.log(`S(06) -> ${ S(Number.parseInt("6", 7)) }`);
    console.log(`S(16) -> ${ S(Number.parseInt("16", 7)) }`);
    console.log(`S(26) -> ${ S(Number.parseInt("26", 7)) }`);
    console.log(`S(36) -> ${ S(Number.parseInt("36", 7) )}`);

    for (let i = 0; i < 7; i++)
    {
        let x = 7 + i;
        let v = g(x);
        b2 += v;
    }
    console.log(b2);

    let result = 0;
    for (let i = 0; i <= digit1; i++)
    {
        if (i === digit1)
        {
            result += g(i) + 1 + v2;
        }
        else if (i > 0)
        {
            let x = g(i*7 + 1);

            let o = base;
            for (let j = 1; j < 7; j++)
            {
                o += x--;
            }
            result += o;
        }
        else
            result += base;
    }

    console.log(`expected ${ S(value) } , calculated ${ result }`);
}

test(2, 1);
test(1, 2);

console.log(H(1).toString(7));
console.log(Number(690409338).toString(7));

assert.equal(g(125), 8);
assert.equal(g(1000), 9);
assert.equal(g(10000), 21);
assert.equal(H(10), 690409338);
console.log('Test passed');

// let answer = H(MAX);
// console.log('Answer is', answer);
