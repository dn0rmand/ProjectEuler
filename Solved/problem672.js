const assert = require('assert');
const BigNumber = require('bignumber.js');
const MODULO = 1117117717; // Prime #
const MAX    = 1000000000;
const SEED_SIZE = 1E6;

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

let $seed = undefined;

function seed()
{
    const $seed = new Uint32Array(SEED_SIZE);

    function inner(n, value)
    {
        if (n >= SEED_SIZE)
            return;
        if ($seed[n] > 0)
            return;
        $seed[n] = value+1;
        inner(n*7, value);
        for (let i = 1; i < 7; i++)
        {
            if (n-i > 1)
            {
                let v2 = value+i;
                $seed[n-i] = v2+1;
                inner((n-i)*7, v2);
            }
        }
    }

    inner(1, 0);

    return $seed;
}

function g(n)
{
    if (n < SEED_SIZE)
    {
        if ($seed === undefined)
        {
            $seed = seed();
            console.log('Seeded');
        }
        return $seed[n]-1;
    }

    let total = 0;
    let N = n;
    while (n > 1)
    {
        let x = n % 7;

        while (x === 0)
        {
            n /= 7;
            x = n % 7;
        }

        if (n <= 1)
            break;

        x = 7-x;
        total = (total + x) % MODULO;
        n += x;
    }
    // console.log(N, total);
    return total;
}

let $S = 0;
let $N = 0;

function S(n)
{
    n = Math.floor(n);

    let total = 0;

    if ($N > 0)
    {
        total = $S;
        start = $N+1;
    }
    else
        start = 1;

    for (let i = start; i <= n; i++)
        total = (total + g(i)) % MODULO;

    $N = n;
    $S = total;

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

function compute(value)
{
    let digits = value.toString(7);

    let total = 0;

    let start = digits.length-1;
    while (start >= 0 && digits[start] === '0')
        start--;

    if (start === 0 && digits[0] === '1')
        return 0;

    for(let i = start; i >= 0; i--)
    {
        let d = +(digits[i]);
        let v = 7-d;

        if (i === start)
        {
            total = v;
        }
        else
        {
            total = total-1+v;
        }
    }

    return total;
}

// analyze();

assert.equal(g(125), 8);
assert.equal(g(1000), 9);
assert.equal(g(10000), 21);
// assert.equal(H(10), 690409338);
console.log('Test passed');

console.log(g(49));
console.log(compute(49));

assert.equal(compute(125), 8);
assert.equal(compute(1000), 9);
assert.equal(compute(10000), 21);


for (let i = 10; i < 100000; i++)
{
    if (compute(i) !== g(i))
    {
        console.log("Doesn't work for", i);
    }
}

var v2 = g(parseInt("2", 7));
var v3 = g(parseInt("3", 7));
var v4 = g(parseInt("4", 7));
var v5 = g(parseInt("5", 7));

var v32 = g(parseInt("32", 7));
var v43 = g(parseInt("43", 7));
var v42 = g(parseInt("42", 7));
var v432 = g(parseInt("432", 7));

console.log(`2 => ${v2} , 3 => ${v3} , 4 => ${v4} , 5 => ${v5}`);
console.log(`32 => ${v32}`);
console.log(`432 => ${v432}`);
console.log(`43 => ${v43}`);
console.log(`42 => ${v42}`);

// let i = 1;
// let v = H(i);
// while (v !== false)
// {
//     console.log(i, v);
//     i++;
//     v = H(i);
// }



// let answer = H(MAX);
// console.log('Answer is', answer);
