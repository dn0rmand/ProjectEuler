const bigInt = require("big-integer");

function powerDigitSum(pow)
{
    let value = bigInt(2).pow(pow).toString();
    let sum   = 0;

    for(let i = 0; i < value.length; i++)
    {
        let digit = +(value[i]);
        sum += digit;
    }

    console.log('Sum of the digits of 2^'+pow+' is '+sum);
}

powerDigitSum(15);
powerDigitSum(1000);