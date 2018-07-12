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

    function generateMorePrimes(count) 
    {
        let newMax = _maxPrime + count;
        let n = newMax;

        let sieve = []; //new Int32Array(max / 31);
        let start;
        let maxPrime = _maxPrime;

        for (let p of _primes)
        {
            let start = maxPrime - (maxPrime % p);

            for (let i = start; ; i += p)
            {
                if (i < maxPrime)
                    continue;

                if (i > n)
                    break;

                sieve[i - maxPrime] = 0;
            }
        }

        start = maxPrime;
        if ((start & 1) === 0)
            start++;

        for (let i = start; i <= n; i += 2) 
        {
            if (sieve[i-maxPrime] === 0)
                continue;

            sieve[i-maxPrime] = 1;
            _primes.push(i);
            _primeMap.set(i);
            _maxPrime = i;

            for(let j = i+i; j <= n; j += i)
            {
                sieve[j-maxPrime] = 0;
            }
        }

        _maxPrime = newMax;
        return _maxPrime;
    }

    function generatePrimes(max) 
    {
        _primeMap.set(2);
        _primeMap.set(3);
        _primeMap.set(5);
        _primeMap.set(7);
        _primes.push(2);
        _primes.push(3);
        _primes.push(5);
        _primes.push(7);

        let n = max;

        let sieve = []; //new Int32Array(max / 31);

        for (let i = 2, j = 3, k = 5, l = 7; ; i+=2, j+=3, k+=5, l+=7)
        {
            if (i > n)
                break;
            sieve[i] = 0;
            if (j <= n)
                sieve[j] = 0;
            if (k <= n)
                sieve[k] = 0;
            if (l <= n)
                sieve[l] = 0;
        }

        for (let i = 11; i <= n; i += 2) 
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
        return _maxPrime;
    }

    let $init = generatePrimes;

    let result = {
        initialize: function(max) {
            let v = $init(max);
            $init = generateMorePrimes;
            return v;
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