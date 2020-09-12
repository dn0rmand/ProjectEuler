const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const divisors = require('tools/divisors');
const primeHelper = require('tools/primeHelper')();

require('tools/numberHelper');

const MAX = 1E8;
const TEN = 10;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX));

const allPrimes = primeHelper.allPrimes();  

function generateNumbers(min, max, callback)
{
    const primes = [];

    function inner(value, index)
    {
        if (value > max)
            return;

        if (value >= min)
            callback(primes);

        for(let i = index ; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];
            let v = value * p;
            if (v > max)
                break;

            const pf = { p, f: 1 };

            primes.push(pf);
            while (v <= max)
            {
                inner(v, i+1);
                pf.f++;
                v *= p;
            }
            primes.pop();
        }
    }

    inner(1, 0);
}

const $length = new Map();

function getLength(n)
{
    let len = $length.get(n);
    if (len !== undefined)
        return len;

    len = 0;

    if (n > 10)
    {
        len = n-1;

        for(const d of divisors(n-1, primeHelper.isKnownPrime))
        {
            if (d < len)
            {
                const rest = TEN.modPow(d, n);
                if (rest === 1)
                    len = d;
            }
        }
    }
    else
    {
        const reference = n > 10 ? 10 : TEN.modPow(n, n);
        let rest = reference;
        do 
        {
            rest = (rest * 10) % n;
            len++;
        } 
        while (rest != reference);
    }

    $length.set(n, len);
    return len;
}

function calculate(primes)
{
    let length = 1;
    let valid  = false;

    primes.forEach(({p, f}) => {        
        if (p === 2 || p === 5)
            return;

        valid = true;

        let l;
        if (p === 487)
        {
            l = 486;
        }
        else if (p === 3)
        {
            if (f > 2)
                l = 3 ** (f-2);
            else
                l = 1;
        }
        else
        {
            l = getLength(p);
            if (f > 1)
                l *= (p ** (f-1));
        }

        if (l > 1)
            length = length.lcm(l, length);
    });

    return valid ? length : 0;
}

function solve(MAX)
{    
    let total = 0, count = 2;
    let extra = 0n;

    const tracer = new Tracer(1000, true);
    for(let p of allPrimes)
    {
        if (p > MAX)
            break;
        tracer.print(_ => MAX-p);
        getLength(p);
    }

    generateNumbers(3, MAX, (primes) => {
        count++;
        tracer.print(_ => MAX - count);

        const l = calculate(primes);
        const t = total + l;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra += BigInt(total) + BigInt(l);
            total  = 0;
        }
        else
        {
            total = t;
        }
    });

    tracer.clear();
    return extra + BigInt(total);
}

assert.strictEqual(timeLogger.wrap('', _ => solve(1000000, true)), 55535191115n);
console.log('Test passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
