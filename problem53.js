const _cache = [];

function factorial(n)
{
    if (n === 0)
        return 1;

    let result = _cache[n];
    if (result === undefined)
    {
        result = n * factorial(n-1);
        _cache[n] = result;
    }
    return result;
}

function C(n, r)
{
    let result = factorial(n) / (factorial(r) * factorial(n-r));

    return result;
}

let bigValues = 0;

for(let n = 1; n <= 100; n++)
for(let r = 0; r <= n; r++)
{
    let value = C(n, r);
    if (value > 1000000)
        bigValues++;
}

console.log(bigValues + ' values of  nCr, for 1 ≤ n ≤ 100, are greater than one-million')