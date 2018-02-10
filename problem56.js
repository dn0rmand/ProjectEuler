const bigInt = require('big-integer');

let maxSum = 0;
let maxA, maxB;

for(let a = 2; a < 100; a++)
for(let b = 1; b < 100; b++)
{
    let v = bigInt(a).pow(b);
    let sum = 0;
    while (v.greater(0))
    {
        let digit = v.mod(10);
        v = v.subtract(digit).divide(10);
        sum += digit.valueOf();
    }    

    if (sum > maxSum)
    {
        maxA = a;
        maxB = b;
        maxSum = sum;
    }
}
console.log("The maximum digital sum is " + maxSum + " for a=" + maxA + " and b=" + maxB);
