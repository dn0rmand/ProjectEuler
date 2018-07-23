const assert = require('assert');
const bigInt = require('big-integer');

const MAX = Math.pow(10, 15);
const MODULO = Math.pow(10, 9);

function squareSum(n, d)
{
    n = Math.floor(n / d);

    let n3 = bigInt(n).pow(3).times(2);
    let n2 = bigInt(n).pow(2).times(3);    
    let s = n3.plus(n2).plus(n).divide(6).mod(MODULO).valueOf();

    return s;
}

function SIGMA2(n, progress)
{
    let max1 = Math.floor(Math.sqrt(n));
    let max2 = Math.floor(n / (max1+1))
    let max  = Math.max(max1, max2);

    let total = 0;
    let percent = -1;

    for (let divisor = 1; divisor <= max; divisor++)
    {        
        if (progress === true && (divisor % 1000000) === 1)
        {
            let p = Math.floor((divisor / max) * 100);
            if (p !== percent)
            {
                percent = p;
                process.stdout.write(' ' + p + '%\r');
            }
        }

        if (divisor <= max1)
        {
            let count  = (n - (n % divisor)) / divisor; 
            
            let square = divisor * divisor;
            let v = square * count;
            if (v > Number.MAX_SAFE_INTEGER)
                v = bigInt(square).times(count).mod(MODULO).valueOf();
            else
                v = v % MODULO;

            total = (total + v) % MODULO;
        }

        if (divisor <= max2)
        {
            let s = squareSum(n, divisor) - squareSum(n, divisor+1);
            if (s < 0)
                s += MODULO;
            let v = s * divisor;
            if (v > Number.MAX_SAFE_INTEGER)
                v = bigInt(s).times(divisor).mod(MODULO).valueOf();
            else
                v = v % MODULO;

            total = (total + v) % MODULO;
        }
    }

    return total;
}

// SIGMA2(30);

assert.equal(SIGMA2(4), 37);
assert.equal(SIGMA2(5), 63);
assert.equal(SIGMA2(6), 113);

console.time(401);
let answer = SIGMA2(MAX, true);
console.timeEnd(401);

console.log('Answer is', answer);
