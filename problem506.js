const assert   = require('assert');
const timeLog  = require('tools/timeLogger');

const MODULO   = 123454321n;
const MAX      = 10n ** 4n;

function *sequence()
{
    const $sequence = [1n, 2n, 3n, 4n, 3n, 2n];

    let index = 0;
    let values= [];
    let sum   = 0n;

    let n = 1n;
    while (true)
    {
        const v = $sequence[index];
        values.push(v);
        sum += v;
        while (sum > n)
            sum -= values.shift();
        index = (index + 1) % $sequence.length;

        if (sum === n)
        {
            yield values.reduce((a, v) => (a * 10n + v) % MODULO, 0n);
            values = [];
            sum = 0n;
            n++;
        }
    }
}

function v(n)
{
    n = BigInt(n);

    let i = 0n;
    for(let v of sequence())
    {
        i++;
        if (i === n)
            return Number(v);
    }
}

function S(n)
{
    n = BigInt(n);
    let total = 0n;

    let i = 0n;
    for(let v of sequence())
    {
        total = (total + v) % MODULO;
        i++;
        if (i === n)
            break;
    }

    return Number(total);
}

assert.equal(v(2), 2);
assert.equal(v(5), 32);
assert.equal(v(11), 32123);

assert.equal(S(11), 36120);
assert.equal(S(1000), 18232686);

console.log('Tests passed');

let values = new Map();
let i = 0n;

for(let v of sequence())
{
    i++;
    if (values.has(v))
    {
        let k = values.get(v);
        console.log(`${v} : ${i} - ${k} = ${i-k}`);
    }
    values.set(v, i);
    if (i >= MAX)
        break;
}

console.log('Analyzed');

const answer = timeLog.wrap('', () => S(MAX));
console.log(`Answer is ${answer}`);