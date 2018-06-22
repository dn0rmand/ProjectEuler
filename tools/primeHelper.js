module.exports = function(maxPrime)
{
    const $isNumberPrime = require('is-number-prime');
    const _primeMap    = new Map();
    let   _primes      = []
    let   _maxPrime    = 0;

    function isPrime(p)
    {
        if (_primeMap.has(p))
            return true;
        if (p <= _maxPrime)
            return false;

        if ((p & 1)  === 0 || (p % 3) === 0)
            return false;
        let root = Math.floor(Math.sqrt(p));
        for(let i of _primes)
        {
            if (i > root)
                return true;
            if (p % i === 0)
                return false;
        }

        if (root > _maxPrime)
            return $isNumberPrime(p);
        else
            return true;
    }

    function generatePrimes(max) 
    {
        _primeMap.set(2);
        _primeMap.set(3);
        _primes.push(2);
        _primes.push(3);

        let n = max;

        let sieve = []; //new Int32Array(max / 31);

        for (let i = 2, j = 3; ; i+=2, j+=3)
        {
            if (i > n)
                break;
            sieve[i] = 0;
            if (j <= n)
                sieve[j] = 0;
        }

        for (let i = 5; i <= n; i += 2) 
        {
            if (sieve[i] === 0)
                continue;
            sieve[i] = 1;
            _primes.push(i);
            _primeMap.set(i);
            _maxPrime = i;

            for(let j = i+i; j <= n; j += i)
            {
                sieve[j] = 0;
            }
        }

        _maxPrime = max;
    }

    let result = {
        initialize: function(max) {
            generatePrimes(max);
        },
        allPrimes: function() { return _primes; },
        primes : function *() {
            yield *_primeMap.keys();
        },
        isPrime: function(value) { 
            return isPrime(value); 
        }
    }

    if (maxPrime !== undefined)
        result.initialize(maxPrime);
    return result;
}