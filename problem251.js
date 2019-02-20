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
            {
                yield { prime:n, count:1 };
                return;
            }

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
                // if (c > 1) // only the ones that can help with squares
                yield { prime:p, count:c };

                if (n < Number.MAX_SAFE_INTEGER)
                    if (primeHelper.isPrime(Number(n)))
                    {
                        yield { prime:n, count:1 };
                        break;
                    }
            }
        }
    }

    function *getSquareDivisors(x1, x5)
    {
        let factors = [];
        let indexes = [];

        for(let p of factorize(x1))
        {
            p.count *= 2;
            factors.push(p);
            indexes[p.prime] = factors.length-1;
        }

        for(let p of factorize(x5))
        {
            let i = indexes[p.prime];
            if (i)
                factors[i].count += p.count;
            else
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
                if (c < 2)
                    continue;

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

        let x1 = x + 1n;
        let x5 = 8n*x + 5n;

        let b2c = x1 * x1 * x5;

        if ( (4n * ((max - a)**3n)) < (27n * b2c) )
        {
            if (trace)
            {
                process.stdout.write(`\r${a} of ${max}  -> Done\n`);
            }
            break
        }
        // get all possible b ( squares dividing b2c )

        for (let b of getSquareDivisors(x1, x5))
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
