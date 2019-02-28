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

function A(letters, length)
{
    if (letters == 0)
        return 1;
    if (letters == 1) // avoid dividing by 0
        return (length + 1) % modulo;

    let total = letters.modPow(length + 1, modulo) - 1;
    if (total < 0)
        total += modulo;
    total = total.modDiv(letters-1, modulo);

    return total;
}

function I(letters, length, trace)
{
    let total = 0;
    let negative = true;

    let count = 0;

    for (let i = 1, j = letters-1; i <= letters; i++, j--)
    {
        if (trace)
        {
            if (count === 0)
                process.stdout.write(`\r${j} `);
            if (++count > 10001)
                count = 0;
        }

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
    if (trace)
        console.log('\r0    ');
    return total;
}

assert.equal(I(3, 4), 79);

assert.equal(I(100, 101), 448273183);
assert.equal(I(100, 100), 525809200);
assert.equal(I(10, 10), 107482234);

assert.equal(I(3, 0), 1);

assert.equal(I(3, 1), 4);
assert.equal(I(3, 2), 13);
assert.equal(I(3, 3), 34);
assert.equal(I(3, 4), 79);

assert.equal(I(4, 1), 5);
assert.equal(I(4, 2), 21);
assert.equal(I(4, 3), 85);
assert.equal(I(4, 4), 317);
assert.equal(I(4, 5), 1101);
assert.equal(I(4, 6), 3637);
assert.equal(I(4, 7), 11621);

assert.equal(I(5, 1), 6);
assert.equal(I(5, 2), 31);
assert.equal(I(5, 3), 156);
assert.equal(I(5, 4), 781);
assert.equal(I(5, 5), 3786);
assert.equal(I(5, 6), 17611);
assert.equal(I(5, 7), 78936);
assert.equal(I(5, 8), 343561);

let timer = process.hrtime();
let answer = I(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

console.log('Answer is', answer, 'calculated in', prettyTime(timer, {verbose:true}));
console.log('Done');