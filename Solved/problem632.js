const bigInt = require('big-integer');
const primeHelper = require('tools/primeHelper')();

const MAX = bigInt(10).pow(16);
const MAX_PRIME = 100000000;

primeHelper.initialize(MAX_PRIME);

const allPrimes = primeHelper.allPrimes();

const $factorial = [];

function factorial(n)
{
    if (n <= 1)
        return 1;
    let k = n;
    let v = $factorial[k];
    if (v !== undefined)
        return v;

    v = n;
    while (--n > 1)
    {
        v *= n;
    }

    $factorial[k] = v;
    return v;
}

const $nCr = [];

function nCr(n, r)
{
    if (r >= n)
        return 1;

    let x = $nCr[n];
    if (x === undefined)
        $nCr[n] = x = [];
    let v = x[r];
    if (v !== undefined)
        return v;

    let top = factorial(n);
    let bottom = factorial(r)*factorial(n-r);

    v = Math.floor(top / bottom);
    x[r] = v;
    return v;
}

function solve(max)
{
    let map = [];

    function inner(value, index, k)
    {
        if (k > 0)
        {
            let p = Math.floor(max / value);
            let sign = 1;
            map[k] = (map[k] || 0) + p; 
            for (let i = k-1; i > 0; i--)
            {
                sign = -sign;
                let count = nCr(k, i) * sign;
                map[i]   += p*count;                 
            }
        }

        for (let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p * p;
            if (v > max)
                break;
            inner(v, i+1, k+1);
        }
    }

    inner(1, 0, 0);

    map[0] = max;
    for (let i = 1; i < map.length; i++)
        map[0] = map[0] - map[i];

    let result = bigInt(1);
    for (let i = 0; i < map.length; i++)
    {
        console.log(i, '-', map[i]);
        result = result.times(map[i]);
    }
    return result.mod(1000000007).valueOf()
}

let answer;
//  answer = generateNumbers(10);
//  answer = generateNumbers(100);
//  answer = generateNumbers(1000);
//  answer = generateNumbers(10000);
//  answer = generateNumbers(100000);
//  answer = generateNumbers(1000000);
//  answer = generateNumbers(10000000);
console.time(632);
answer = solve(Math.pow(10, 16));
console.timeEnd(632);
console.log(answer, 'Done'); // 728378714