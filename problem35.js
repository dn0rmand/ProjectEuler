const isNumberPrime = require('is-number-prime');

function isPrime(p)
{
    if (p === 2 || p === 3)
        return true;
    else
        return isNumberPrime(p);
}

function *rotations(value)
{
    let s = value.toString();
    let l = s.length;
    let index = 1 % l;
    while (index != 0)
    {
        let v = 0;
        for(let i = 0; i < l; i++)
            v = (v * 10) + +(s[(i + index) % l]);
        yield v;

        index = (index + 1) % l;
    }
}

function solve(max, maxName)
{
    let count = 0;
    for(let prime = 1; prime < max; prime++)
    {
        if (isPrime(prime))
        {
            let good = true;
            // Check all rotations
            let iter = rotations(prime);
            for(let v = iter.next(); ! v.done; v = iter.next())
            {
                if (! isPrime(v.value))
                {
                    good = false;
                    break;
                }
            }
            if (good)
                count++; 
        }
    }

    console.log(count + " primes below " + maxName + " are circular.");
}

solve(100, "100");
solve(1000000, "one million");