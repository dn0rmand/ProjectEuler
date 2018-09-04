const FOUR_MILLIONS = 4000000;
const bigInt        = require('big-integer');
const assert        = require('assert');
const primeHelper   = require('tools/primeHelper')(FOUR_MILLIONS);

function solve()
{
    let primes = [];
    let TARGET = FOUR_MILLIONS*2;

    // Count number of primes needed with each a factor of 1

    function prepare()
    {
        let allPrimes = primeHelper.allPrimes();
        let v         = 1;
        let p         = 0;
        while (v < TARGET)
        {
            primes.push(allPrimes[p++]);
            v = v*3;
        }
    }

    function divisors(factors)
    {
        let divs = factors.reduce((a, v) => { return a * (2*v+1); }, 1);
        return divs;
    }

    let bestValue;

    function generateValue(factors)
    {
        let value = 1;
        let big = false;

        for (let i = 0; i < factors.length; i++)
        {
            let p = primes[i];
            let f = factors[i];
            if (f > 1)
                p = Math.pow(p, f);

            if (big)
            {
                value = bigInt(value).times(p);
                if (bestValue !== undefined && value.greater(bestValue))
                    return value;
            }
            else
            {
                let v = value * p;
                if (v > Number.MAX_SAFE_INTEGER)
                {
                    big = true;
                    value = bigInt(value).times(p);
                    if (bestValue !== undefined && value.greater(bestValue))
                        return value;
                }
                else
                    value = v;
            }
        }
        if (! big)
            value = bigInt(value);
        return value;
    }

    function inner(factors, count)
    {
        let divs = divisors(factors);
        if (divs > TARGET)
        {
            let value = generateValue(factors);
            if (bestValue === undefined)
                bestValue = value;
            else if (value.greater(bestValue))
                return false; // Adding more factors isn't going to reduce the value
            else
                bestValue = value;
        }

        if (factors.length === primes.length)
            return true;

        factors.push(0);
        let idx = factors.length-1;
        for (let i = 1; i <= count; i++)
        {
            factors[idx] = i;
            if (! inner(factors, count))
                break;
        }
        factors.pop();
        return true;
    }

    prepare();
    inner([], 10); // 10 is arbitrary ... too big = takes too long
    return bestValue.toString();
}

let answer = solve();
console.log("Answer is", answer);
