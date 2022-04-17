const assert = require('assert');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

primeHelper.initialize(1E6);

const MILLION = 1E6;

function gcd(a, b)
{
    while (b !== 0)
    {
        let c = a % b;
        a = b;
        b = c;
    }
    return a;
};

function A(n)
{
    let x = 1, k = 1;

    while (x !== 0)
    {
        x = (x * 10 + 1) % n;
        k++;
    }
    return k
}

function solve()
{
    for (let n = MILLION+1; ; n += 2)
    {
        if (gcd(n, 10) === 1)
        {
            k = A(n);
            if (k > MILLION)
                return n;
        }
    }
}

assert.equal(A(7), 6);
assert.equal(A(41), 5);

let answer = solve();

console.log('Answer is', answer);
console.log('Done');
