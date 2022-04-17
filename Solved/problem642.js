const assert = require('assert');
const primeHelper   = require('@dn0rmand/project-euler-tools/src/primeHelper');
const announce      = require('@dn0rmand/project-euler-tools/src/announce');
const BitArray      = require('@dn0rmand/project-euler-tools/src/bitArray');

const MAX        = 201820182018;
const MODULO     = 1E9;
const PRIME_SIZE = 1E9;

let MAX_PRIME = Math.max(PRIME_SIZE, Math.floor(Math.sqrt(MAX)));

console.time(642);

console.log('Loading primes');
primeHelper.initialize(MAX_PRIME, true);
console.log('Primes loaded');

const allPrimes = primeHelper.allPrimes();


function *sieve(start, end)
{
    if ((start & 1) !== 0)
        throw "Start has to be even";

    let size   = end-start;
    let root   = Math.floor(Math.sqrt(end))+1;

    if (root >= start)
        throw "WHAT!";

    let sieve  = BitArray(root);
    let primes = BitArray(size);

    for(let p of allPrimes)
    {
        if (p >= root)
            break;

        let d = p - (start % p);
        if (d === p)
            d = 0;
        while (d < size)
        {
            primes.set(d, 1);
            d += p;
        }
    }

    for(let p = 1; p < size; p += 2)
    {
        if (! primes.get(p))
        {
            yield start+p;
        }
    }
}

function F(n, trace)
{
    let total = 0;

    function inner(P, index, value)
    {
        total = (total + P) % MODULO;

        for (let i = index; i < allPrimes.length; i++)
        {
            let prime = allPrimes[i];
            if (prime > P)
                break;

            let v = value * prime;
            if (v > n)
                break;
            while (v <= n)
            {
                inner(P, i+1, v);
                v *= prime;
            }
        }
    }

    let primeCount = 0;
    let lastP = 0;
    let traceCount = 0;

    for (let i = 0; i < allPrimes.length; i++)
    {
        let P = allPrimes[i];
        lastP = P;
        if (P > n)
            break;
        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write('\r'+P);
            traceCount++;
            if (traceCount >= 100)
                traceCount = 0;
        }

        inner(P, 0, P);
    }

    if (lastP < n)
    {
        let next = 0;

        while(lastP < n)
        {
            next += PRIME_SIZE;

            if (trace)
            {
                traceCount = 0;
                process.stdout.write('\rloading     ');
            }
            let start = next;
            let end   = next+PRIME_SIZE;

            for (let P of sieve(start, end))
            {
                if (P <= lastP)
                    throw "lastP check: " + P + " <= " + lastP;

                lastP = P;

                if (P > n)
                    break;

                if (P < start)
                    throw "Range check: " + P + " < " + start;

                if (P >= end)
                    throw "Range check: " + P + " >= " + end;

                if (trace)
                {
                    if (traceCount === 0)
                        process.stdout.write('\r'+P);
                    traceCount++;
                    if (traceCount >= 1000)
                        traceCount = 0;
                }
                inner(P, 0, P);
            }
        }
    }

    if (trace)
    {
        console.log('');
        console.log(n,'=>',primeCount,'primes');
    }

    return total;
}

function tests()
{
    assert.equal(F(10), 32);
    assert.equal(F(100), 1915);
    assert.equal(F(10000), 10118280);

    console.log('Tests passed');
}

tests();

let answer = F(MAX, true);

console.timeEnd(642);
announce(642, 'F('+MAX+')=' + answer);

// gpf(n)=if(n<4, n, n=factor(n)[, 1]; n[#n]);
// a(n)=sum(k=2, n, Mod(gpf(k), 1000000000))
// a(10000)
// a(201820182018)