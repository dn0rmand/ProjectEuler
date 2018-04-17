module.exports = function(n)
{
    const isNumberPrime = require('is-number-prime');

    function *getDivisors(value)
    {
        yield 1;
        yield value;

        if (isNumberPrime(value))
            return;

        let max   =  Math.ceil(Math.sqrt(number))+1;
        let start = 2;
        let steps = 1;
        if (value & 1 !== 0)
        {
            start = 3;
            steps = 2;
        }
        for(let i = start; i < max; i+=steps)
        {
            if ((value % i) == 0)
            {
                let res = value / i;
                if (res != i)
                    yield res;

                yield i;
            }
        }
    }

    return getDivisors(n);
}
