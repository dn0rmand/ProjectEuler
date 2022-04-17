const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

const MAX       = 1E14;
const MAX_PRIME = 1E7;

if (MAX > Number.MAX_SAFE_INTEGER)
    throw "too big";

primeHelper.initialize(MAX_PRIME, true);
const allPrimes = primeHelper.allPrimes();

// Dirichlet
// A061142: http://oeis.org/A061142
function f(n)
{
    let total = 1;

    primeHelper.factorize(n, (p, f) => {
        total *= (2**f);
    });

    return total;
}

const $G = new Map();

function S(n, trace)
{
    // http://oeis.org/A006218
    // a(n) = 2*(Sum_{i=1..max} floor(n/i)) - max^2
    function G(n)
    {
        n = Math.floor(n);

        if ($G.has(n))
            return $G.get(n);

        let max = Math.floor(Math.sqrt(n));
        let sum = 0;

        for(let i = 1; i <= max; i++)
        {
            sum += Math.floor(n / i);

            $G[i] = sum;
        }

        sum = sum * 2 - (max*max);    

        $G.set(n, sum);
        return sum;
    }

    let total = 0;
    let extra = 0n;

    function inner(index, value, h)
    {
        if (value > n)
            return 1;

        if (value > 1)
        {
            let F = h * G(n/ value);
            let t = total + F;
            if (t > Number.MAX_SAFE_INTEGER)
            {
                extra += BigInt(total) + BigInt(F);
                total  = 0;
            }
            else
                total = t;
        }

        for(let i = index; i < allPrimes.length; i++)
        {
            let p  = allPrimes[i];
            let v  = value * (p*p);
            if (v > n)
                break;

            let hh = h;

            while (v <= n)
            {
                inner(i+1, v, hh);
                v  *= p;
                hh *= 2;
            }
        }
    }

    total = G(n);

    inner(0, 1, 1);
    return BigInt(total) + extra;
}

assert.equal(f(90), 16);
assert.equal(timeLogger.wrap('', _ => S(1E8)), 9613563919);
console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);
