module.exports = function(n)
{
    const isNumberPrime = require('is-number-prime');

    function *getDivisors(value)
    {
        yield 1;
        yield value;

        if (isNumberPrime(value))
            return;

        let max = value;
        for(let i = 2; i < max; i++)
        {
            if ((value % i) == 0)
            {
                let res = value / i;
                if (res < max)
                    max = res;
                if (res != i)
                    yield res;

                yield i;
            }
        }
        return divisor;
    }

    return getDivisors(n);
}
