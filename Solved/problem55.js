const bigInt = require('big-integer');

function isPalindrome(value)
{
    value = value.toString();
    for(let i = 0, j = value.length-1; i < j; i++, j--)
    {
        if (value[i] !== value[j])
            return false;
    }
    return true;
}

function calculate(value)
{
    let tmp      = value;
    let reverse  = bigInt(0);

    while (tmp.greater(0))
    {
        let digit = tmp.mod(10);

        reverse  = reverse.multiply(10).add(digit);
        tmp      = tmp.subtract(digit).divide(10);
    }

    return value.add(reverse);
}

function isLychrel(number)
{
    let count = 0;

    value = bigInt(number);
    while (count++ < 50)
    {
        value = calculate(value);
        if (isPalindrome(value))
            return false;
    }
    return true;
}

// TEST
/*
if (isLychrel(47))
    console.log("FAILED!!!!");
if (isLychrel(349))
    console.log("FAILED!!!!");
if (! isLychrel(196))
    console.log("FAILED!!!!");
if (! isLychrel(4994))
    console.log("FAILED!!!!");
*/

let lychrelCount = 0;
for (let i = 1; i < 10000; i++)
{
    if (isLychrel(i))
        lychrelCount++;
}

console.log("There are " + lychrelCount + " Lychrel numbers that are below ten-thousand");
