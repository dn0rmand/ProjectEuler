const assert = require('assert');

const MODULO = 1E10;

require('tools/numberHelper');

function solve(precision)
{
    const TEN     = 10;

    let divisor   = 1;
    let total     = 0;
    let power     = precision + 10;

    while (power % 3 !== 0)
        power--;

    while (power > 0) {
        power   -= 3;
        divisor *= 3;

        let v = TEN.modPow(power, MODULO);

        v = v.modDiv(divisor, MODULO); 

        total = (total + v) % MODULO;
    }

    return total;
}

assert.strictEqual(solve(100), "4938271604");
assert.strictEqual(solve(1E8), "2584642393");

console.log('Test passed');

//console.log(total.toString().substr(101, 10));
