const assert = require('assert');
const prettyTime= require("pretty-hrtime");
require('tools/numberHelper');

const modulo     = 1000000007;

const LETTERS    = 1E7;
const MAX_LENGTH = 1E12;

const $factorials = [];

(function()
{
    console.log('Loading factorials');
    let current = 1;
    $factorials[0] = current;

    let letters = LETTERS;
    for (let i = 1; i <= letters; i++)
    {
        current = current.modMul(i, modulo);

        if (current === 0) // maybe
            current = modulo;
        $factorials[i] = current;
    }
    console.log('Factorials loaded');
})();

function C(n, r)
{
    let t  = $factorials[n];
    let b1 = $factorials[n-r];
    let b2 = $factorials[r];
    let b  = b1.modMul(b2, modulo);

    t = t.modDiv(b, modulo);

    return t;
}

// Count of possibles words made with up to "N" letters and with a width up to length
// Includes the x<1> times A(n-1) and x<2> times A(n-2) .... x<n-1> times A(1)
//
// A(n-1) - (x<n-2>A(n-2) + ... + x<1>A(1)) +
// A(n-2) - (y<n-3>A(n-3) + ... + y<1>A(1)) +

let $A = [];

function A(letters, length)
{
    if (letters == 0)
        return 1;
    if (letters == 1) // avoid dividing by 0
        return (length + 1) % modulo;

    let total = $A[letters];
    if (total !== undefined)
        return total;

    total = letters.modPow(length + 1, modulo) - 1;
    if (total < 0)
        total += modulo;
    total = total.modDiv(letters-1, modulo);

    $A[letters] = total;
    return total;
}

function I(letters, length)
{
    let negative = true;
    let total    = 0;

    for (let i = 1, j = letters-1; i <= letters; i++, j--)
    {
        negative = ! negative;

        let f = A(j, length);
        let x = C(letters, i);
        let y = f.modMul(x, modulo);

        if (negative)
        {
            if (total < y)
                total += modulo;

            total = (total - y) % modulo;
        }
        else
        {
            total = (total + y) % modulo;
        }
    }

    return total;
}

function S(letters, length, trace)
{
    let total = 0;

    // Reset cache
    $A = []

    for (let l = 1; l <= letters; l++)
    {
        total = (total + I(l, length)) % modulo;
    }

    if (trace)
        console.log('\r'+letter);

    return total;
}

assert.equal(S(4,4), 406);
assert.equal(S(8,8), 27902680);
assert.equal(S(10,100), 983602076);

let timer = process.hrtime();
let answer = S(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

console.log('Answer is', answer, 'calculated in', prettyTime(timer, {verbose:true}));
console.log('Done');