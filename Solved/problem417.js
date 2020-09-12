const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const divisors = require('tools/divisors');
const primeHelper = require('tools/primeHelper')();
const BigMap = require('tools/BigMap');

require('tools/numberHelper');

const MAX = 1E8;
const TEN = 10;

timeLogger.wrap('Loading primes', _ => primeHelper.initialize(MAX));

const allPrimes = primeHelper.allPrimes();  

function generateNumbers(min, max, callback)
{
    const primes = [];

    function inner(value, key, index)
    {
        if (value > max)
            return;

        if (value >= min)
            callback(key, primes);

        for(let i = index ; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];
            let v = value * p;
            if (v > max)
                break;

            const pf = { p, f: 1 };

            let k = key;

            if (p !== 2 && p !== 5)
            {
                primes.push(pf);
                k *= p;
            }

            while (v <= max)
            {
                inner(v, k, i+1);
                pf.f++;
                v *= p;
                if (p !== 2 && p !== 5)
                    k *= p;
            }

            if (p !== 2 && p !== 5)
                primes.pop();
        }
    }

    inner(1, 1, 0);
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

const $calculate = new BigMap();

function calculate(key, primes)
{
    let length = $calculate.get(key);
    if (length !== undefined)
        return length;
    
    length = 1;
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

    length = valid ? length : 0;
    $calculate.set(key, length);
    return length;
}

function solve(MAX)
{    
    let total = 0, count = 2;

    const tracer = new Tracer(1000, true);
    
    generateNumbers(3, MAX, (key, primes) => {
        count++;
        tracer.print(_ => MAX - count);

        const l = calculate(key, primes);
        total += l;
    });

    tracer.clear();
    return total;
}

assert.strictEqual(timeLogger.wrap('', _ => solve(1000000, true)), 55535191115);
console.log('Test passed');

const answer = timeLogger.wrap('', _ => solve(MAX, true));
console.log(`Answer is ${answer}`);
