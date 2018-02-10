const bigInt = require("big-integer");
const _cache = [];

function factorial(n)
{
    if (n === 0)
        return bigInt(1);

    let result = _cache[n];
    if (result === undefined)
    {
        result = bigInt(n).multiply(factorial(n-1));
        _cache[n] = result;
    }
    return result;
}

function C(n, r)
{
    let nn = factorial(n);
    let rr = factorial(r);
    let nr = factorial(n-r);

    let div = rr.multiply(nr);

    let result = nn.divide(div);

    return result;
}

let bigValues = 0;

for(let n = 1; n <= 100; n++)
for(let r = 0; r <= n; r++)
{
    let value = C(n, r);
    if (value.greater(1000000))
        bigValues++;
}

console.log(bigValues + ' values of  nCr, for 1 ≤ n ≤ 100, are greater than one-million')