const bigInt = require('big-integer');
const assert = require('assert');

function Rmax(a)
{
    let rmax = 2;
    let aa   = a*a;
    let maxn = 2*a;
    for (let n = 1; n <= maxn; n+=2)
    {
        let a1 = bigInt(a-1).modPow(n, aa).valueOf();
        let a2 = bigInt(a+1).modPow(n, aa).valueOf();
        let r  = (a1 + a2) % aa;

        if (r > rmax)
        {
            rmax = r;
            if (r === aa-1)
                break; // Can't be more
        }
    }

    return rmax;
}

assert.equal(Rmax(7), 42);

let total = 0;
for (let a = 3; a <= 1000; a++)
    total += Rmax(a);

console.log('Answer', total, ' (333082500)');