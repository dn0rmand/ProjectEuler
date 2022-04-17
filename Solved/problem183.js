const assert = require('assert');
const timeLog = require('@dn0rmand/project-euler-tools/src/timeLogger');

function isTerminating(num, div)
{
    while (div % 2 === 0)
        div /= 2;
    while (div % 5 === 0)
        div /= 5;

    return num % div === 0;
}

function M(n)
{
    let k = Math.round(n / Math.E);
    return `${n**k}/${k**k}`;
}

function D(n)
{
    let k = Math.round(n / Math.E);
    return isTerminating(n, k) ? -n : n;
}

function solve(N, trace)
{
    let total = 0;

    for (let i = 5; i <= N; i++)
    {
        if (trace)
        {
            process.stdout.write(`\r${N-i} `);
        }
        total += D(i);
    }
    if (trace)
        process.stdout.write('\r \r');
    return total;
}

assert.equal(M(11, true), "14641/256");
assert.equal(M(8, true), "512/27");

assert.equal(D(11), -11);
assert.equal(D(8), 8);

assert.equal(solve(100), 2438);

console.log("Tests passed");

let answer = timeLog.wrap('', () => solve(10000, true));
console.log('Answer is', answer);