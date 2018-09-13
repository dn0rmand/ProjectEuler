// Number Rotations
// ----------------
// Problem 168
// -----------
// Consider the number 142857. We can right-rotate this number by moving the last digit (7) to the front of it, giving us 714285.
// It can be verified that 714285=5×142857.
// This demonstrates an unusual property of 142857: it is a divisor of its right-rotation.

// Find the last 5 digits of the sum of all integers n, 10 < n < 10^100, that have this property.

const bigInt = require('big-integer');
const MODULO = 100000;

function isSpecial(number1, includeSameDigit)
{
    let digit   = number1 % 10;
    let number2 = (number1 - digit) / 10;
    let factor  = 1;
    while (factor < number1)
        factor *= 10;
    number2 += (digit * factor/10);

    if (number1 === number2 && includeSameDigit !== true)
        return false; // don't count the number with unique digit ... treated separatly

    if (number2 % number1 === 0)
        return true;
    else
        return false;
}

function sumSameDigit(digit)
{
    let value = digit*10 + digit;
    let total = 0;

    for (let i = 2; i <= 100; i++)
    {
        total = (total + value) % MODULO;

        value = ((value * 10) + digit) % MODULO;
    }

    return total;
}

function specialSum(number)
{
    let total = 0;
    let len   = number.toString().length;
    let length= len;
    while(length <= 100)
    {
        total = (total + number) % MODULO;
        length+= len;
    }
    return total;
}

function solve()
{
    let total = 0;

    for (let digit = 1; digit <= 9; digit++)
        total = (total + sumSameDigit(digit)) % MODULO;

    for (let n = 11; n < 1000000; n++)
    {
        if (isSpecial(n))
            total = (total + specialSum(n)) % MODULO;
    }

    console.log('Answer', total);
}

function test()
{
    if (isSpecial(142857) !== true)
        throw "ERROR";

    for (let n = 11; n < 10000000; n++)
    {
        if (isSpecial(n, false))
            console.log(n);
    }
}

solve();
console.log('Done');

/*

up to 100000000000

    102564
    128205
    142857
    153846
    179487
    205128
    230769

*/