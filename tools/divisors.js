module.exports = function(value)
{
    const isNumberPrime = require('is-number-prime');

    function *getDivisors()
    {
        yield 1;
        if (value > 1)
            yield value;

        if (value <= 2)
            return;

        if (isNumberPrime(value))
            return;

        let max   =  Math.floor(Math.sqrt(value))+1;
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
                if (res > i)
                    yield res;

                yield i;

                if (res < max)
                    max = res;
            }
        }
    }

    return getDivisors();
}
