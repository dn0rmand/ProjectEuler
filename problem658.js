const assert = require('assert');
const prettyTime= require("pretty-hrtime");
const announce = require('tools/announce');

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

function I(letters, length, factors, trace)
{
    let total = 0;
    let MODULO = BigInt(modulo);

    for (let i = 1, j = letters-1; i <= letters; i++, j--)
    {
        if (trace)
            process.stdout.write(`\r${i}`);

        let f = A(j, length);

        let x = factors[j];
        let negative = (x < 0);
        if (negative)
            x = -x;
        x = Number(x % MODULO);

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

function I1(letters, factors)
{
    let negative = true;
    let CCache   = [];
    for (let i = 1, j = letters-1; i <= letters; i++, j--)
    {
        negative = ! negative;

        // let f = A(j, length);
        let x = CCache[i];
        if (x === undefined)
        {
            x = BigInt(C(letters, i));
            CCache[j] = x;
        }

        let s = factors[j] || 0n;
        if (negative)
        {
            s -= x;
        }
        else
        {
            s += x;
        }
        factors[j] = s;
    }
}

function S(letters, length, trace)
{
    let total = 0;
    let factors = [];

    for (let l = 1; l <= letters; l++)
    {
        if (trace)
            process.stdout.write(`\r${l}`);

        I1(l, factors);
    }
    if (trace)
        console.log("\rLast step - Consolidation");

    total = (total + I(letters, length, factors, trace)) % modulo;

    if (trace)
        console.log('\rDone        ');

    return total;
}

assert.equal(S(4,4), 406);
assert.equal(S(8,8), 27902680);
assert.equal(S(10,100), 983602076);

let timer = process.hrtime();
let answer = S(LETTERS, MAX_LENGTH, true);
timer = process.hrtime(timer);

timer = prettyTime(timer, {verbose:true});
console.log('Answer is', answer, 'calculated in', timer);
announce(658, `Answer is ${answer} calculated in ${ timer}`);
console.log('Done');