const primeHelper = require('./tools/primeHelper')();

const MAX = 10e24;
const MIN_7 = 4*9*25*49*121*169;
const MAX_PRIME = Math.floor(Math.sqrt(MAX / MIN_7));

primeHelper.initialize(Math.min(MAX_PRIME, 100000000), true);
while (primeHelper.maxPrime() < MAX_PRIME)
{
    let count = MAX_PRIME - primeHelper.maxPrime();
    if (count > 100000000)
        count = 100000000;
    primeHelper.initialize(count, true);
}

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
        let didIt = false;

        if (k > 6)
        {
            didIt = true;
            let p = Math.floor(max / value);
            let sign = 1;
            if (k === 7)
                map[k] = (map[k] || 0) + p; 

            for (let i = k-1; i > 6; i--)
            {
                sign = -sign;
                if (i === 7)
                {
                    let count = nCr(k, i) * sign;
                    map[i]   += p*count;                 
                }
            }
        }

        for (let i = index; i < allPrimes.length; i++)
        {
            let p = allPrimes[i];
            let v = value * p * p;
            if (v > max)
                break;
            if (! inner(v, i+1, k+1))
                break;
            else
                didIt = true;
        }

        return didIt;
    }

    inner(1, 0, 0);

    console.log(map[7]);
    let result = map[7] / max;
    return result;
}

let answer;
console.time(633);
answer = solve(MAX);
console.timeEnd(633);
console.log(answer, 'Done');

// 10^16 =>         925199 - 9.2520e-11
// 10^17 =>        9699182 - 9.6992e-11
// 10^18 =>       98908299 - 9.8908e-11
// 10^21 =>   100066452578 - 1.0007e-10
// 10^22 =>  1001033177951 - 1.0010e-10
// 10^23 => 10011598040746 - 1.0012e-10 
