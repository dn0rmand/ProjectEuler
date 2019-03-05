const assert = require('assert');
const primeHelper = require('tools/primeHelper')();

primeHelper.initialize(1E6);

function largestPrime(k2)
{
    let largest = 1;
    let index   = 0;

    let previousPrimes = [];

    let N  = 2*k2;
    let v1 = N*N + k2;

    primeHelper.factorize(v1, (prime) => {
        previousPrimes[prime] = 1;
    });

    v1 = ((N+1)*(N+1)) + k2;

    primeHelper.factorize(v1, (prime) => {
        if (prime > largest && previousPrimes[prime])
        {
            largest = prime;
            index   = N;
        }
    });

    previousPrimes = [];

    for (let n = 1; n < 1000; n++)
    {
        let value = n*n + k2;
        let currentPrimes = [];
        let max = 0;

        primeHelper.factorize(value, (prime) => {
            currentPrimes[prime] = 1;
            if (prime > max && previousPrimes[prime])
                max = prime;
        });

        if (max > largest)
        {
            index   = n-1;
            largest = max;
        }
        previousPrimes = currentPrimes;
    }

    return { prime: largest, index: index };
}

// assert.equal(largestPrime(3).prime, 13);

largestPrime(16);

for (let k = 1; k < 20; k++)
{
    let k2 = k*k;
    let res = largestPrime(k2);
    console.log('k =', k, ', k^2 =', k2, ', n =', res.index, ', 2*n+1 = ', (2*res.index + 1), ', prime =', res.prime);
}
console.log('Done');