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

    let result = 0;
    for (let i = 0; i <= digit1; i++)
    {
        if (i === digit1)
        {
            result += g(i) + 1 + v2;
        }
        else
        {
            let o = 0;
            for (let j = 0; j < 7; j++)
            {
                o += g(i*7 + j);
            }
            result += (o + base);
        }
    }

    console.log(`expected ${ S(value) } , calculated ${ result }`);
}

test(1, 2);
test(2, 1);

console.log(H(1).toString(7));
console.log(Number(690409338).toString(7));

assert.equal(g(125), 8);
assert.equal(g(1000), 9);
assert.equal(g(10000), 21);
assert.equal(H(10), 690409338);
console.log('Test passed');

// let answer = H(MAX);
// console.log('Answer is', answer);
