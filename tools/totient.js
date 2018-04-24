const f = function()
{
    const $isPrime = require("./isPrime.js");
    const $primes  = require('./primes.js');
    const sqlite   = require('better-sqlite3');

    let _maximum     = 4;
    let _maxPrime    = 3;
    const _primeTable  = new Map();
    
    _primeTable.set(2);
    _primeTable.set(3);

    function isNumberPrime(p)
    {
        if ((p & 1)  === 0 || (p % 3) === 0)
            return false;
        let root = Math.floor(Math.sqrt(p));
        for (let i = 5; i <= root; i += 6) 
        {
            if (p % i === 0 || p % (i + 2) == 0)
                return false;
        }
        return true;                        
    }

    function isPrime(n)
    {
        if (n > _maximum)
            return isNumberPrime(n);
        else
            return _primeTable.has(n);
    }

    function *getPrimeIterator()
    {
        for (let key of _primeTable.keys())
            yield key;

        throw "Not enough primes";
    }

    function generatePrimes(n) 
    {
        if (n < 2) 
            return;
    
        let start = Math.max(_maxPrime, _maximum);
        if ((start & 1) === 0)
            start++;

        for (let i = start; i <= n; i += 2) 
        {
            if (isNumberPrime(i))
            {
                _primeTable.set(i);
                _maxPrime = i;
            }
        }
    }

    let totient = {
        load: function()
        {
            _primeTable.clear();
            let db = new sqlite('../data/primes.sqlite3', { fileMustExist: true });
            let command = db.prepare('SELECT prime FROM primes');
            for (let row of command.iterate()) 
            {
                let p = +(row.prime);
                _primeTable.set(p);
                _maxPrime = p;
                _maximum = p;
            }            
        },
        save: function()
        {
            let db = new sqlite('../data/primes.sqlite3', { fileMustExist: false });

            db.exec("DROP TABLE primes");
            db.exec("CREATE TABLE primes(prime INTEGER)");
            db.exec("BEGIN");
            let command = db.prepare("INSERT INTO primes (prime) VALUES (?)");
            for (let p of this.primes())
                command.run(p);
            db.exec("COMMIT");
            db.close();                    
        },
        // You can overide this to define you own prime implementation
        initialize: function(max) 
        {
            if (max <= _maximum)
                return;

            generatePrimes(max);
            _maximum     = max;
        },
        isPrime: function(n) 
        { 
            return isPrime(n);
        }, 
        primes: function *()
        {
            yield *getPrimeIterator();
        },
        // end default prime implementation
        
        PHI: function(n) 
        {
            if (n === 1)
                return 1;

            this.initialize(n);

            if (this.isPrime(n))
                return n-1;
            
            let pIter     = this.primes();
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

                    if (this.isPrime(value))
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