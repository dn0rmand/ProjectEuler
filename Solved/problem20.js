const bigInt = require("big-integer");

function sumDigits(value)
{
    value = value.toString();
    let sum = 0;
    for (let i = 0; i < value.length; i++)
        sum += +(value[i]);
    return sum;
}

function factorial(value)
{
    let result = bigInt(1);

    while (value > 0)
        result = result.multiply(value--);

    return result;
}

function solve(value)
{
    let f = factorial(value);
    let sum = sumDigits(f);

    console.log("Sum of the digits of " + value + "! is " + sum);
}

solve(10);
solve(100);
