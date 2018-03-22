module.exports = function()
{
    const isNumberPrime = require('is-number-prime');

    function* primes()
    {
        yield 2;
        yield 3;

        let v = 3;
        while (true)
        {
            v += 2;
            if (isNumberPrime(v))
                yield v;
        }
    }    

    return primes();
};