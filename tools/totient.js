const f = function()
{
    const isPrime = require("./isPrime.js");
    
    let initialized = false;
    let maximum     = 0;

    let primes;
    let primeTable;
    
    let totient = {
        initialize: function(max) 
        {
            initialized = true;
            maximum     = max;

            primes = [];
            primeTable = new Map();

            for (let n = 1; n <= max; n++)
            {
                if (isPrime(n))
                {
                    primes.push(n);
                    primeTable.set(n,1);
                }
            }    
        },
        PHI: function(n) 
        {
            if (n === 1)
                return 1;

            if (! initialized)
                throw "Not initialized";
            if (n > maximum)
                throw "Value too big";

            if (primeTable.has(n))
                return n-1;

            let pIndex    = 0;
            let p         = primes[0];
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

                    if (primeTable.has(value))
                    {
                        phi *= (value-1)/value;
                        break;
                    }

                    p = primes[++pIndex];
                }
                else
                    p = primes[++pIndex];
            }

            return phi ;
        }
    };

    return totient;
};

module.exports = f();