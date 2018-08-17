// Weak Goodstein sequence
// -----------------------
// Problem 396 
// -----------
// For any positive integer n, the nth weak Goodstein sequence {g1, g2, g3, ...} is defined as:

// g1 = n
// for k > 1, gk is obtained by writing gk-1 in base k, interpreting it as a base k + 1 number, and subtracting 1.
// The sequence terminates when gk becomes 0.
// For example, the 6th weak Goodstein sequence is {6, 11, 17, 25, ...}:

// g1 = 6.
// g2 = 11 since 6 = 1102, 1103 = 12, and 12 - 1 = 11.
// g3 = 17 since 11 = 1023, 1024 = 18, and 18 - 1 = 17.
// g4 = 25 since 17 = 1014, 1015 = 26, and 26 - 1 = 25.
// and so on.
// It can be shown that every weak Goodstein sequence terminates.

// Let G(n) be the number of nonzero elements in the nth weak Goodstein sequence.
// It can be verified that G(2) = 3, G(4) = 21 and G(6) = 381.
// It can also be verified that ΣG(n) = 2517 for 1 ≤ n < 8.

// Find the last 9 digits of ΣG(n) for 1 ≤ n < 16.

const assert = require('assert');
const bigInt = require('big-integer');

const MODULO = 1000000000;

function G(n)
{
    let k = 2;
    let digits = [];

    while (n > 0)
    {
        let d = n % 2;
        digits.push(d);
        n = (n - d) / 2;
    }

    if (digits.length === 0)
        return 0;
    if (digits.length > 4)
        throw "Too big";

    while(true)
    {
        let d = digits[0];

        if (d > 0)
        {
            k = (k + d) % MODULO;
            if (digits.length === 1)
                return k;
        }

        d = digits[1];

        if (d > 0)
        {
            let off = bigInt(2).modPow(d, MODULO).prev().times(k+1).mod(MODULO).valueOf();
            k = (k + off + 1) % MODULO;

            if (digits.length === 2)
                return k-3;
        }
        else if (digits.length === 2)
            throw "How can the last bit be zero?";
        else if (digits.length === 3)
            k = (k + 1) % MODULO;

        d = digits[2];
        if (d > 0)
        {
            digits[0] = k-1;
            digits[1] = k-1;
            digits[2]--;
            if (digits[2] === 0 && digits.length === 3)
                digits.pop();
            continue;
        }
        else if (digits.length === 3)
            throw "How can the last bit be zero?";

        k = (k + 1) % MODULO;

        digits[0] = k-1;
        digits[1] = k-1;
        digits[2] = k-1;
        digits[3]--;
        if (digits[3] === 0 && digits.length === 4)
            digits.pop();
    }
}

function $G(n)
{
    let g = bigInt(n);
    let k = bigInt(2);
    let digits = [];

    while (g.gt(0))
    {
        while (g.gt(0))
        {
            let d = g.mod(k);
            digits.push(d);
            g = g.minus(d).divide(k);
        }

        let d0 = digits[0];

        if (d0.greater(0))
        {
            let d1 = digits[1] || bigInt.zero;

            k = k.plus(d0).next();

            // let c1 = (count + d0.mod(MODULO).valueOf()) % MODULO;

            if (! d1.greater(0) && digits.length <= 2)
            {
                count = d0.plus(count).prev().mod(MODULO).valueOf();
                console.log(count, c1);
                return count
            }

            if (digits.length <= 2)
            {
                let kk  = k.mod(MODULO).valueOf();
                let off = bigInt(2).modPow(d1, MODULO).prev().times(kk).mod(MODULO).valueOf();
                kk    = (kk + off) % MODULO;
                return kk - 3; // count;
            }
            else if (d1.greater(0))
            {
                let off = bigInt(2).pow(d1).prev().times(k);
                k       = k.plus(off);
            }

            digits[0] = bigInt.zero;
            digits[1] = bigInt.zero;
        }
        else
            k = k.next();

        while (digits.length > 0)
            g = g.times(k).plus(digits.pop());

        g = g.prev();
    }
    return k.minus(3).mod(MODULO);
}

assert.equal(G(2), 3);
assert.equal(G(4), 21);
assert.equal(G(6), 381);
assert.equal(G(7), 2045);
assert.equal(G(8), 722374141);

console.log("G(9) =", G(9));
console.log("G(10) =", G(10));
console.log("G(11) =", G(11));
console.log("G(12) =", G(12));
console.log("G(13) =", G(13));
console.log("G(14) =", G(14));
console.log("G(15) =", G(15));

// for (let i = 1; i < 9/*16*/; i++)
// {
//     console.log(i, "=>", G(i));
// }

console.log("Done");
