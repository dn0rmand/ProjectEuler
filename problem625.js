// Gcd sum
// Problem 625 

// G(N)= ∑j=1->N ∑i=1->j gcd(i,j)

// You are given: G(10)=122
// Find G(10^11). Give your answer modulo 998244353

const assert    = require('assert');
const prettyTime= require("pretty-hrtime");
const cluster   = require('cluster');
const bitBuffer = require('bitbuffer');

const MODULO = 998244353;

const MAX           = Math.pow(10, 11);
const TEST          = Math.pow(10, 8);
const ARRAY_SIZE    = MAX/8;

const _primeMap    = new Map();
let   _primes      = []
let   _maxPrime    = 3;

console.log("Initializating arrays");
let caches = [
    new bitBuffer.BitBuffer(ARRAY_SIZE),//1
    new bitBuffer.BitBuffer(ARRAY_SIZE),//2
    new bitBuffer.BitBuffer(ARRAY_SIZE),//3
    new bitBuffer.BitBuffer(ARRAY_SIZE),//4
    new bitBuffer.BitBuffer(ARRAY_SIZE),//5
    new bitBuffer.BitBuffer(ARRAY_SIZE),//6
    new bitBuffer.BitBuffer(ARRAY_SIZE),//7
    new bitBuffer.BitBuffer(ARRAY_SIZE) //8
];
console.log("Arrays now ready");

caches.total = 0;

caches.get = function(index)
{    
    index--;

    let offset  = index % ARRAY_SIZE;
    let array   = (index - offset) / ARRAY_SIZE;

    array = caches[array];

    return array.get(offset);
}

caches.set = function(index)
{
    index--;

    let offset  = index % ARRAY_SIZE;
    let array   = (index - offset) / ARRAY_SIZE;
    
    array = caches[array];

    array.set(offset, 1);
    caches.total++;
}

function isPrime(p)
{
    if (_primeMap.has(p))
        return true;
    if (p <= _maxPrime)
        return false;

    if ((p & 1)  === 0 || (p % 3) === 0)
        return false;
    let root = Math.floor(Math.sqrt(p));
    for(let i of _primes)
    {
        if (i > root)
            break;
        if (p % i === 0)
            return false;
    }
    return true;                        
}

function generatePrimes(max) 
{
    _primeMap.set(2);
    _primeMap.set(3);
    _primes.push(2);
    _primes.push(3);

    let n = max || Math.ceil(Math.sqrt(MAX));
    
    let sieve = []; //new Int32Array(max / 31);

    for (let i = 2, j = 3; ; i+=2, j+=3)
    {
        if (i > n)
            break;
        sieve[i] = 0;
        if (j <= n)
            sieve[j] = 0;
    }

    for (let i = 5; i <= n; i += 2) 
    {
        if (sieve[i] === 0)
            continue;
        sieve[i] = 1;
        _primes.push(i);
        _primeMap.set(i);
        _maxPrime = i;

        for(let j = i+i; j <= n; j += i)
        {
            sieve[j] = 0;
        }
    }

    _maxPrime = n;
}

function g(n, e)
{
    if (e === 1)
        return n+n-1;

    if (e !== undefined)
    {
        //(p^(e−1)) * ((p−1)*e+p)

        let total = Math.pow(n, e-1) * (((n-1) * e) + n);

        return total;
    }
    else
    {
        let total = 1;

        let max = Math.floor(Math.sqrt(n));

        for (let p of _primes)
        {
            if (p > max)
                break;

            let power = 0;
            
            while ((n % p) === 0)
            {
                n /= p;
                power++;
            }

            if (power > 0)
            {
                total *= g(p, power);

                if (n === 1)
                    break;

                max = Math.floor(Math.sqrt(n));
            }
        }

        if (n > 1)
            total *= g(n, 1);

        return total;
    }
}

function seed(max)
{    
    let timer = process.hrtime();
    
    let total = 1; // 1 => 1
    caches.set(1);

    function add(index, value)
    {
        // if (! caches.get(index))
        // {
        total = (total + value) % MODULO;
        caches.set(index);
        // }  
    }

    function inner(pi, factor, value, index)
    {
        if (index > max)
            return;
        
        let prime = _primes[pi];

        let newValue = value * g(prime, factor);
        add(index, newValue);

        // Use same prime ( special case )
        let idx = index*prime;
        let f = factor;
        if (idx > max)
            return;
            
        while (idx <= max)
        {
            f++;

            let v = value * g(prime, f);
            add(idx, v);

            for(let pj = pi+1; pj < _primes.length; pj++)
            {
                let p = _primes[pj];
                let i = idx*p;
                if (i > max)
                    break;
                inner(pj, 1, v, i);
            }

            idx *= prime;
        }

        // use other primes
        for(let pj = pi+1; pj < _primes.length; pj++)
        {
            // only primes not already used
            let p = _primes[pj];
            idx = index*p;
            if (idx > max)
                break;
            inner(pj, 1, newValue, idx);
        }
    }

    console.log("Seeding ...");
    for(let pi = 0; pi < _primes.length; pi++)
    {
        inner(pi, 1, 1, _primes[pi]);
    }

    console.log("Seeded");
    console.log((max - caches.total) + " values remaining");

    for(let i = 2; i <= max; i++)
    {        
        if (! caches.get(i))
        {
            // Some verification
            if (! isPrime(i))
                throw i + " is not a prime!!!";

            console.log("Found new prime " + i + "... seeding some more ...");
            let v = g(i, 1);

            add(i, v);

            for(let pi = 0; pi < _primes.length; pi++)
            {
                let idx = i * _primes[pi];
                if (idx > max)
                    break;

                inner(pi, 1, v, idx);
            }

            console.log("Seeded");
            console.log((max - caches.total) + " values remaining");
            // total = (total + g(i, 1)) % MODULO;
        }
    }

    timer = process.hrtime(timer);    
    console.log('seed(' + max + ') = ' + total + ' - Calculated in ' + prettyTime(timer, {verbose:true}));
    
    return total;
}

function G(min, max)
{
    let timer = process.hrtime();
    
    let total = 0;

    let start = min;
    if (min === 1)
    {
        total = 1;
        start = 2;
    }

    for(let i = start; i <= max; i++)
    {
        total = (total + g(i)) % 998244353;
    }

    timer = process.hrtime(timer);
    
    console.log('G(' + min + ', ' + max + ') = ' + total + ' - Calculated in ' + prettyTime(timer, {verbose:true}));
    return total;
}

function solve(start, end, runTests)
{
    // Prepare

    console.log("initializing primes");
    let timer = process.hrtime();
    generatePrimes(100000000);                        
    timer = process.hrtime(timer);
    console.log('primes loaded in ' + prettyTime(timer, {verbose:true}));

    let answer = seed(9999999999);
//    let answer = seed(MAX);
    console.log("ANSWER is " + answer + " - expected = 551614306");
    process.exit(0);

    // Tests

    if (runTests === true)
    {
        assert.equal(seed(50000000), 954109446); 

        // assert.equal(G(1, 10), 122);
        // assert.equal(G(1, 1000), 2475190);
        // assert.equal(G(1, 10000), 317257140);
        // assert.equal(G(1, 10000000), 825808541);     
        // assert.equal(G(1, 20000000), 974543073);  
        
        assert.equal(G(1, 50000000), 954109446);       
        
        // G(50000000) = 954109446 - Calculated in 3 minutes 5 seconds 520 milliseconds 159 microseconds 936 nanoseconds        
    }
    else
    {
        let total = G(start, end);

        return total;
    }
}

// ------------------------------------------------
//    1 to 4999999999; current Total = 335885638
//
// 5000000000 to 5999999999 = 178920722
// 6000000000 to 6999999999 = 597747200
// 7000000000 to 7999999999 = 4189793
// 8000000000 to 8999999999 = 305574685
// 9000000000 to 9999999999 = 912882500
// 
// 1 to 9999999999 -> 338711832
// ------------------------------------------------


if (cluster.isMaster) 
{
    solve(1, 100000, true);
    process.exit(0);

    console.log("I'm the master");

    let works = [
        { start: 5000000000, end: 5999999999 },
        { start: 6000000000, end: 6999999999 },
        { start: 7000000000, end: 7999999999 },
        { start: 8000000000, end: 8999999999 },
        { start: 9000000000, end: 9999999999 },
    ];
    let mainTotal = 338711832; 

    console.log("Main Total is " + mainTotal);
    let workers = 0;
    for (let w of works)
    {
        const worker = cluster.fork();

        workers++ ;

        // Tell worker what section to calculate
        worker.send(w);
        
        // When worker done, add total
        worker.on('message', (msg) =>
        {
            if (msg.cmd === 'done')
            {
                console.log(msg.start + " to " + msg.end + " = " + msg.total);
                mainTotal = (mainTotal + msg.total) % MODULO;
                workers--;
                if (workers === 0)
                {
                    console.log("Up to 9999999999 -> " + mainTotal);
                }
            }
        });    
    }
} 
else
{
    console.log("I'm a worker");

    process.on('message', (msg) => {
        let s = msg.start;
        let e = msg.end;

        console.log("Solving from " + s + " to " + e);

        let total = solve(s, e);

        process.send({ cmd: 'done', start: s, end: e, total:total });  
        process.exit(0);      
    });
}

// 551614306