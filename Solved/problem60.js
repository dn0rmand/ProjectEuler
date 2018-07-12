const isPrime = require('./tools/isPrime.js');

const cache = [];

function FindOthers(primes, min)
{        
    if (primes.length === 5)
        return primes;

    for(let i = min; i < cache.length; i++)
    {
        let value = cache[i];
        let isOK  = true;

        for(let p of primes)
        {
            let n = +(value + '' + p);
            if (! isPrime(n))
            {
                isOK = false;
                break;
            }
            n = +(p + '' + value);
            if (! isPrime(n))
            {
                isOK = false;
                break;
            }
        }
        
        if (! isOK)
            continue;

        primes.push(value);
        let result = FindOthers(primes, i+1);
        if (result !== undefined)
            return result;
        primes.pop();
    }
}

function solve()
{
    const primes  = require('./tools/primes.js');
    let primeIterator = primes();

    while (true)
    {
        let prime = primeIterator.next().value;

        if (cache.length < 4)
        {
            if (prime === 2 || prime === 5)
                continue; // Don't put those in the case since they won't work
            cache.push(prime);
            continue;
        }

        let setOfPrimes = FindOthers([prime], 0);

        if (setOfPrimes !== undefined )
        {
            return setOfPrimes;
        }
        cache.push(prime)
    }
}

let setOfPrimes = solve();
let sum = 0;
for(let v of setOfPrimes)
{
    sum += v;
}
console.log("Result is " + sum);