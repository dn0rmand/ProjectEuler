// Totient permutation
// Problem 70 
// Euler's Totient function, φ(n) [sometimes called the phi function], is used to determine the number of positive numbers 
// less than or equal to n which are relatively prime to n. For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and 
// relatively prime to nine, φ(9)=6.
// The number 1 is considered to be relatively prime to every positive number, so φ(1)=1.

// Interestingly, φ(87109)=79180, and it can be seen that 87109 is a permutation of 79180.

// Find the value of n, 1 < n < 107, for which φ(n) is a permutation of n and the ratio n/φ(n) produces a minimum.

const assert  = require("assert");
const bigInt  = require('big-integer');
const totient = require("../tools/totient.js");
const maximum = Math.pow(10, 7);

totient.initialize(maximum);

function getDigits(n)
{
    let digits = [];
    while (n > 0)
    {
        let d = n % 10;

        digits.push(d);

        n = (n - d) / 10;
    }
    digits.sort((a, b) => { return a-b; });
    return digits;
}

function isPermutation(n, v)
{
    if (n === v)
        return false;

    let digitsN = getDigits(n);
    let digitsV = getDigits(v);

    if (digitsN.length !== digitsV.length)
        return false;
    for (let i = 0; i < digitsN.length; i++)
        if (digitsN[i] !== digitsV[i])
            return false;
    return true;
}

// function isPermutation2(n, v)
// {
//     if (n === v)
//         return false;
//
//     let sn = n.toString().split('').sort().join('');
//     let sv = v.toString().split('').sort().join('');
//
//     return sn === sv;
// }

let min  = 10000;
let minN = 1;

for (let n = 2; n < maximum; n++)
{
    let phi = totient.PHI(n);

    if (isPermutation(n, phi))
    {
        let ratio = n / phi;
        if (ratio < min)
        {
            min  = ratio; 
            minN = n;
        }
    }
}

console.log("The value of n for which φ(n) is a permutation of n and the ratio n/φ(n) produces a minimum is " + minN);
