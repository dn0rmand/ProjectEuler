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

const bigInt = require('big-integer');

const MODULO  = 1000000000;

function BruteG(n)
{
    let k = 2;
    let digits = [];
    let g = n;

    while (g > 0)
    {
        while (g > 0)
        {
            let d = g % k;
            digits.push(d);
            g = (g - d) / k;
        }

        k++;

        while (digits.length > 0)
        {
            let d = digits.pop();
            g = (g * k) + d;
        }

        g--;
    }

    return k-2;
}

function G(n)
{
    if (n === 1)
        return 1;

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

            if (digits.length === 2)
                return (k + off - 2) % MODULO;

            k = (k + off + 1) % MODULO;
        }
        else if (digits.length === 2)
            throw "How can the last bit be zero?";
        else
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

        digits[0] = k-1;
        digits[1] = k-1;
        digits[2] = k-1;
        digits[3]--;
        if (digits[3] === 0 && digits.length === 4)
            digits.pop();
    }
}

function test(value, expected)
{
    let g = G(value);
    if (g === expected)
        return;

    let message = "G(" + value + ") incorrect. Expected " + expected + " but got " + g;
    console.log(message);
    process.exit(-1);
}

// console.log(BruteG(14));

test(2, 3);
test(4, 21);
test(6, 381);
test(7, 2045);
test(8, 722374141);
test(9, 59756541);
test(10, 954333181);
test(11, 955670525);
test(12, 113137661);
test(13, 465147901);
test(14, 353293821);
test(15, 549498365);

let total = 0;
for (let i = 1; i < 16; i++)
{
    let g = G(i);
    total = (total + g) % MODULO;
}

console.log("Answer is", total);
