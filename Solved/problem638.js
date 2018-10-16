const assert = require('assert');
const int64  = require('tools/bigintHelper');

const MODULO_N  = BigInt(1000000007);

function factorial(n)
{
    let total = BigInt.ONE;
    for (let x = BigInt.ONE; x <= n; x++)
        total *= x;
    return total;
}

function C(a, b, k)
{
    if (k === 1)
    {
        let top     = factorial(a+b);
        let bottom  = factorial(a)*factorial(b);
        let value   = top / bottom;
        return value % MODULO_N;
    }

    a = BigInt(a);
    b = BigInt(b);

    let K       = BigInt(k);
    let TOP     = K.modPow(b, MODULO_N) - BigInt.ONE;
    let total   = BigInt.ONE;

    for (let i = BigInt.ONE; i <= a; i++)
    {
        let ki     = K.modPow(i, MODULO_N);
        let top    = (ki * TOP) % MODULO_N;
        let bottom = (ki - BigInt.ONE).modInv(MODULO_N);
        let value  = ((top * bottom) + BigInt.ONE) % MODULO_N;

        total = (total * value) % MODULO_N;
    }

    return total;
}

console.time(638);
assert.equal(C( 2,  2, 1), 6);
assert.equal(C( 2,  2, 2), 35);
assert.equal(C(10, 10, 1), 184756);
assert.equal(C(15, 10, 3), 880419838);
assert.equal(C(10000,10000,4), 395913804);
console.timeEnd(638);

console.log('Tests passed');
console.time(638);
let total = BigInt.ZERO;

for (let k = 1; k <= 7; k++)
{
    let x = 10**k + k;
    total = (total + C(x, x, k)) % MODULO_N;
}
console.timeEnd(638);
console.log('Answer is', total.toString());