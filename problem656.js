const assert = require('assert');
const BigNumber = require('bignumber.js');

const MAX_CYCLE_LENGTH  = 100;
const DECIMALS          = (MAX_CYCLE_LENGTH * 4)+1;

BigNumber.set({
    ROUNDING_MODE: 1,
    DECIMAL_PLACES: DECIMALS
});

const T = (function()
{
    let values = [];
    let current = 1;
    while (current < 1000)
    {
        current++;
        let s = Math.sqrt(current);
        if (s !== Math.floor(s))
            values.push(current);
    }

    return values;
})();

function S(a, n)
{
    let v = (a.times(n).integerValue() - a.times(n-1).integerValue());
    let result = v;
    return result;
}

function test(values)
{
    let a = BigNumber(31).sqrt();
    let s = [];
    for (let n of values)
    {
        let v = S(a, n);
        s.push(v);
    }

    for (let i = 0; i <= (s.length / 2); i++)
        assert.equal(s[i], s[s.length-1-i]);
}

console.log(T);
test([1,3,5,7,44,81,118,273,3158,9201,15244,21287,133765,246243,358721,829920,9600319,27971037,46341755,64712473]);
