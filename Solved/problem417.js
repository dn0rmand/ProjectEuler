const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const divisors = require('@dn0rmand/project-euler-tools/src/divisors');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

require('@dn0rmand/project-euler-tools/src/numberHelper');
const MAX = 1E8;
const TEN = 10;

const $isPrime  = new Uint8Array(MAX+1);

timeLogger.wrap('Loading primes', _ => {
    primeHelper.initialize(MAX, true);
    primeHelper.allPrimes().reduce((a, p) => $isPrime[p] = 1, 1);
});
const allPrimes = primeHelper.allPrimes();

function isPrime(p) 
{
    return $isPrime[p] === 1;
}

function generateNumbers(min, max, callback)
{
    const primes = [];

    function inner(value, index)
    {
        if (value > max)
            return;

        if (value >= min)
            callback(value, primes);

        for(let i = index ; i < allPrimes.length; i++)
        {
            const p = allPrimes[i];
            if (p === 2 || p === 5)
                continue;

            let v = value * p;
            if (v > max)
                break;

            const pf = { p, f: 1 };

            primes.push(pf);

            while (v <= max)
            {
                inner(v, i+1);
                v *= p;
                pf.f++;
            }

            primes.pop();
        }
    }

    inner(1, 1, 0);
}

const $length = new Uint32Array(MAX+1);

function getLength(n)
{
    let len = $length[n];
    if (len)
        return len;

    len = 0;

    if (n > 10)
    {
        len = n-1;
        let min = true;
        divisors(n-1, isPrime, d => {
            if (d < len)
            {
                const rest = TEN.modPow(d, n);
                if (rest === 1)
                {
                    len = d;
                    if (min)
                        return false;
                }
            }
            min = !min;
        });
    }
    else
    {
        const reference = TEN.modPow(n, n);
        let rest = reference;
        do 
        {
            rest = (rest * 10) % n;
            len++;
        } 
        while (rest != reference);
    }

    $length[n] = len;
    return len;
}

function Add2and5(value, length, MAX)
{
    let o = length;

    for(let v5 = value*5; v5 <= MAX; v5 *= 5) 
        length += o;
        
    for(let v2 = value*2; v2 <= MAX; v2 *= 2)
    {
        length += o;
        for(let v5 = v2*5; v5 <= MAX; v5 *= 5) 
            length += o;
    }

    return length;
}

function calculate(value, primes, MAX)
{
    let length = primes.reduce((length, {p, f}) => 
    {
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

        return l > 1 ? length.lcm(l, length) : length;
    }, 1);

    return Add2and5(value, length, MAX);
}

function solve(MAX)
{    
    let total = 0, count = 2;

    const tracer = new Tracer(10000, true);
    
    generateNumbers(3, MAX, (value, primes) => {
        count++;
        tracer.print(_ => MAX - count);

        total += calculate(value, primes, MAX);
    });

    tracer.clear();
    return total;
}

assert.strictEqual(timeLogger.wrap('', _ => solve(1000000, true)), 55535191115);
console.log('Test passed');

// const answer = timeLogger.wrap('', _ => solve(MAX, true));
// console.log(`Answer is ${answer}`);
