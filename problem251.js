const primeHelper = require('tools/primeHelper')();
const announce = require('tools/announce');

const MAX = 110000000;

console.log('Loading primes');
primeHelper.initialize(MAX);
console.log('Primes loaded');

function solve(max, trace)
{
    max = BigInt(max);

    let allPrimes = primeHelper.allPrimes();

    function *factorize(n)
    {
        if (n < Number.MAX_SAFE_INTEGER)
            if (primeHelper.isPrime(Number(n)))
                return;

        for (let p of allPrimes)
        {
            p = BigInt(p);
            if (p >= n)
                break;

            if ((n % p) === 0n)
            {
                let c = 0;
                while ((n % p) === 0n)
                {
                    n /= p;
                    c++;
                }
                if (c > 1) // only the ones that can help with squares
                    yield { prime:p, count:c };

                if (n < Number.MAX_SAFE_INTEGER)
                    if (primeHelper.isPrime(Number(n)))
                        break;
            }
        }
    }

    function *getSquareDivisors(n)
    {
        let factors = [];

        for(let p of factorize(n))
        {
            factors.push(p);
        }

        function *generate(index, value)
        {
            if (value > max)
                return;

            yield value;

            for (let i = index; i < factors.length; i++)
            {
                let p = factors[i].prime;
                let c = factors[i].count;

                // Do first one to be able to break the main loop early

                let v = value * p;

                if (v > max)
                    break;

                yield *generate(i+1, v);
                c -= 2;

                while (c >= 2)
                {
                    c -= 2;
                    v = v * p;
                    if (v > max)
                        break;
                    yield *generate(i+1, v);
                }
            }
        }

        yield *generate(0, 1n);
    }

    let total   = 0n;
    let M       = max / 3n - 1n;
    let tracer  = 0;

    for (let x = 0n; x <= M; x++)
    {
        let a = 3n*x + 2n;
        if (a >= max-2n)
            break;

        if (trace)
        {
            if (tracer === 0)
                process.stdout.write(`\r${a} of ${max}`);

            if (++tracer === 500)
                tracer = 0;
        }

        let b2c = (x + 1n) * (x + 1n) * (8n*x + 5n);

        if ( (4n * ((max - a)**3n)) < (27n * b2c) )
        {
            if (trace)
            {
                process.stdout.write(`\r${a} of ${max}  -> Done\n`);
            }
            break
        }
        // get all possible b ( squares dividing b2c )

        for (let b of getSquareDivisors(b2c))
        {
            if (a+b >= max)
                continue;

            let c = b2c / (b*b);

            if (a+b+c <= max)
            {
                total++;
            }
        }
    }
    return total;
}

console.assert(solve(1000) == 149);
console.assert(solve(110000) == 18634);
// console.assert(solve(1100000) == 188336);

let total = solve(110000000, true);
console.log("Answer is", total);
announce(251, "Answer is " + total);
