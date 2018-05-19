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

function G(n)
{
    let g = bigInt(n);
    let k = bigInt(2);
    let count = 0
    let digits = [];

    while (g.gt(0))
    {
        count = (count+1) % 1000000000;

        while (g.gt(0))
        {
            let d = g.mod(k);
            digits.push(d);
            g = g.minus(d).divide(k);
        }

        k = k.next();

        while (digits.length > 0)
            g = g.times(k).plus(digits.pop());

        g = g.prev();
    }
    return count;
}

// assert.equal(G(2), 3);
// assert.equal(G(4), 21);
// assert.equal(G(6), 381);

for (let i = 1; i < 9/*16*/; i++)
{
    console.log(i + " => " + G(i));
}
console.log("Done");