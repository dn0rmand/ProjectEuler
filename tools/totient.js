const f = function()
{
    const $isPrime = require("./isPrime.js");
    const $primes  = require('./primes.js');

    let _initialized = false;
    let _maximum     = 0;

    let _primes;
    let _primeTable;
    
    function isPrime(n)
    {
        if (! _initialized)
            return $isPrime(n);
        else if (n > _maximum)
            throw "Value too big";
        else
            return _primeTable.has(n);
    }

    function *getPrimeIterator()
    {
        if (! _initialized)
        {
            yield *$primes();
        }
        else
        {
            for(var p of _primes)
                yield p;
        }
    }

    let totient = {
        initialize: function(max) 
        {
            _initialized = true;
            _maximum     = max;

            _primes = [];
            _primeTable = new Map();

            for (let n = 1; n <= max; n++)
            {
                if ($isPrime(n))
                {
                    _primes.push(n);
                    _primeTable.set(n,1);
                }
            }    
        },
        PHI: function(n) 
        {
            if (n === 1)
                return 1;

            if (isPrime(n))
                return n-1;

            let pIter     = getPrimeIterator();
            let p         = pIter.next().value;
            let value     = n;
            let phi       = n;
            
            while (value > 1)
            {
                if ((value % p) === 0)
                {
                    while ((value % p) === 0)
                        value = value / p;

                    phi *= (p-1) / p;

                    if (value === 1)
                        break;

                    if (isPrime(value))
                    {
                        phi *= (value-1)/value;
                        break;
                    }

                    p = pIter.next().value;
                }
                else
                    p = pIter.next().value;
            }

            return phi ;
        }
    };

    return totient;
};

module.exports = f();