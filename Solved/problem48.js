const bigInt = require('big-integer');

function getPow(i)
{
    let v = bigInt(i).pow(i);
    return v;
}

let sum = bigInt();

for(let i = 1; i <= 1000; i++)
{
    sum = sum.add(getPow(i));
}

let mask   = getPow(10);
let digits = sum.mod(mask);

console.log("The last ten digits of the series is " + digits);