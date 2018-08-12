module.exports = function(maxPrime)
{
    const $isNumberPrime = require('is-number-prime');
    let   _primeMap    = new Set();
    let   _primes      = [];
    let   _extraPrimes = [];
    let   _maxPrime    = 0;
    let   _memoizePrimeCount = new Map();

    function reset()
    {
        _primeMap = new Set();
        _primes   = [];
        _maxPrime = 0;
        _memoizePrimeCount = new Map();
    }

    function countPrimes(num) 
    {
        let count = _memoizePrimeCount.get(num);
        if (count !== undefined)
            return count;
    
        let r = Math.floor(Math.sqrt(num));
        let v = [];
    
        for (let i = 1; i <= r + 1; i++)
            v.push(Math.floor(num / i));
    
        for (let i = v[v.length - 1] - 1; i >= 0; i--)
            v.push(i);
    
        let s = {};
    
        for (let i = 0; i < v.length; i++)
        {
            let idx = v[i];
            s[idx] = idx - 1;
        }
    
        for (let p = 2; p <= r + 1; p++) 
        {
            let sp = s[p - 1];
            if (s[p] > sp) 
            {
                let p2 = p * p;
                for (let i = 0; i < v.length; i++) 
                {
                    let idx = v[i];
                    if (idx < p2)
                        break;
                    s[idx] = s[idx] - (s[Math.floor(idx / p)] - sp);
                }
            }
        }
        
        count = s[num];
        _memoizePrimeCount.set(num, count);
        return count;
    }

    function isPrime(p)
    {
        if (_primeMap === undefined)
            throw "Prime Map not enabled";

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

        for(let i of _extraPrimes)
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
            if (_primeMap !== undefined)
                _primeMap.add(i);
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
        if (_primeMap !== undefined)
        {
            _primeMap.add(2);
            _primeMap.add(3);
            _primeMap.add(5);
            _primeMap.add(7);
        }
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
            if (_primeMap !== undefined)
                _primeMap.add(i);
            _maxPrime = i;

            for(let j = i+i; j <= n; j += i)
            {
                sieve[j] = 0;
            }
        }

        _maxPrime = max;
        return _maxPrime;
    }

    function next(p)
    {
        while (true)
        {
            p += 2;
            if (isPrime(p))
            {
                _extraPrimes.push(p);
                return p;
            }
        }
    }

    function *primes(limitless)
    {
        let last = undefined;
        for (let p of _primes)
        {
            last = p;
            yield p;
        }
        if (limitless)
        {
            for (let p of _extraPrimes)
            {
                last = p;
                yield p;
            }

            if (last === undefined)
            {
                yield 2;
                yield 3;
                yield 5;
                yield 7;
                yield 11;
                last = 11;
            }
            while (true)
            {
                last += 2;
                if (isPrime(last))
                    yield last;
            }
        }
    }

    let $init = generatePrimes;

    let result = {
        reset: function() {
            reset();
        },
        maxPrime: function() { return _maxPrime; },
        initialize: function(max, noMap) {
            if (noMap === true)
                _primeMap = undefined;
            let v = $init(max);
            $init = generateMorePrimes;
            return v;
        },
        allPrimes: function() { return _primes; },
        extraPrimes: function() { return _extraPrimes; },
        primes : function *(limitless) {
            yield *primes(limitless);
        },
        isPrime: function(value) { 
            return isPrime(value); 
        },
        next: function(p) { return next(p); },
        countPrimes: function(to) { return countPrimes(to); }        
    }

    if (maxPrime !== undefined)
        result.initialize(maxPrime);
    return result;
}