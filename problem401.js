const assert = require('assert');
const primeHelper = require('./tools/primeHelper')();

const MAX = Math.pow(10, 15);

function SIGMA2(n)
{
    let max = Math.floor(Math.sqrt(n));
    let total = 0;

    for (let divisor = 1; divisor <= max; divisor++)
    {
        let count  = (n - (n % divisor)) / divisor; 
        let square = divisor * divisor;

        total += square * count;
    }

    return total;
}

console.log(SIGMA2(4), 37);
console.log(SIGMA2(5), 63);
console.log(SIGMA2(6), 113);

console.log("Done");