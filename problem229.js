const MAX_SAMPLE = 10000000;
const MAX = 2000000000;

const primeHelper = require('./tools/primeHelper')();

primeHelper.initialize(Math.floor(Math.sqrt(MAX)));

function *filter(max)
{
    for (let value = 8; value < max; value++)
    {
        if (primeHelper.isPrime(value))
            continue;

        let v = value;
        let good = true;
        for (let p of primeHelper.primes())
        {
            if (p > v)
                break;

            if (v % p === 0)
            {
                let count = 1;
                v /= p;
                while (v % p === 0)
                {
                    count++;
                    v /= p;
                }

                if (p % 4 === 3 && (count & 1) !== 0)
                {
                    good = false;
                    break;
                }

                if (primeHelper.isPrime(v))
                {
                    if (v % 4 === 3)
                        good = false;
                    break;
                }
            }
        }
        if (good)
            yield value;
    }
}

function solve(max)
{
    let values = new Int8Array(max+1);
    let squares = [];

    let total  = 0;

    function set(n, v)
    {
        if (n > max)
            return;

        if (values[n] === 15)
            return; // already done

        values[n] |= v;

        if (values[n] === 15)
            total++;
    }

    for(let x = 1; ; x++)
    {
        let x2 = x*x;
        if (x2 > max)
            break;
        squares.push(x2);
    }

    for(let x2 of squares)
    for(let y2 of squares)
    {
        if (x2 + y2 > max)
            break;

        set(x2 +   y2, 1);
        set(x2 + 2*y2, 2);
        set(x2 + 3*y2, 4);
        set(x2 + 7*y2, 8);
    }

    return total;
}

function dummy()
{
    let total = 0;
    for (let value of filter(MAX))
    {
        total++;
    }
    console.log(total);
}

let answer = solve(MAX);
console.log('Answer to problem 229 is', answer);
console.log('done');