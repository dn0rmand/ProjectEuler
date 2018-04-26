const totient = require('./tools/totient.js');
const assert  = require('assert');
const prettyTime= require("pretty-hrtime");

const MODULO = 998244353;

const MAX  = Math.pow(10, 11);
const TEST = Math.pow(10, 8);

function Φ(start, end)
{
    let total = 0;

    for (let i = start; i <= end; i++)
    {
        total += totient.PHI(i);
    }

    return total;
}

function S(n, x)
{
    n = Math.floor(n / x);
    let total = 0;

    for(let i = 1; i <= n; i++)
        total += i;

    return total;
}

function G1(n)
{
    let u = Math.floor(Math.sqrt(n));

    let total = 0;
    let phi   = 0;

    for (let x = 1; x <= u; x++)
    {
        let t1  = S(n, x) - S(n, x+1);
        
        phi += Φ(x-1, x);

        total =  (total + (phi * t1)) % MODULO;
    }

    return total;
}

function G2(n)
{
    let u = Math.floor(Math.sqrt(n));
    
    let total = 0;
    let previousX = 0;
    let previousΦ = 0;

    for(let a = u; a >= 1; a--)
    {
        let x = Math.floor(n / a);

        if (x > previousX)
        {
            let newΦ = Φ(previousX+1, x);
            previousX = x;
            previousΦ += newΦ; 
        }
        else if (x !== previousX)
        {
            throw "What happened!";
        }

        x = a * previousΦ;

        total = (total + x) % MODULO;
    }

    return total;
}

function G(n)
{
    let timer = process.hrtime();
    
    let total = 0;
    let previousX = -1;
    let previousΦ = 0;

    for(let a = n; a >= 1; a--)
    {
        let x = Math.floor(n / a);

        if (previousX === -1)
        {
            previousΦ = Φ(1, x);
            previousX = x;
        }
        else if (x > previousX)
        {
            let newΦ = Φ(previousX+1, x);
            previousX = x;
            previousΦ += newΦ; 
        }
        else if (x !== previousX)
        {
            throw "What happened!";
        }

        x = a * previousΦ;

        total = (total + x) % MODULO;
    }

    timer = process.hrtime(timer);
    console.log("previous X = " + previousX + " and previous Φ = " + previousΦ);    
    console.log('G(' + n + ') = ' + total + ' - Calculated in ' + prettyTime(timer, {verbose:true}));

    return total;
}

totient.initialize(Math.ceil(Math.sqrt(MAX)));

assert.equal(G(10), 122);
assert.equal(G(1000), 2475190);
assert.equal(G(10000), 317257140);
assert.equal(G(10000000), 825808541);       
assert.equal(G(50000000), 954109446);       

console.log('Done');

/*

previous X = 10 and previous Φ = 32
G(10) = 122 - Calculated in 311 microseconds 697 nanoseconds

previous X = 1000 and previous Φ = 304192
G(1000) = 2475190 - Calculated in 2 milliseconds 318 microseconds 179 nanoseconds

previous X = 10000 and previous Φ = 30397486
G(10000) = 317257140 - Calculated in 17 milliseconds 316 microseconds 447 nanoseconds

previous X = 10000000 and previous Φ = 30396356427242
G(10000000) = 825808541 - Calculated in 23 seconds 665 milliseconds 348 microseconds 511 nanoseconds

previous X = 50000000 and previous Φ = 759908890586254
G(50000000) = 954109446 - Calculated in 3 minutes 5 seconds 929 milliseconds 8 microseconds 473 nanoseconds

------------


G(1, 10) = 122 - Calculated in 153 microseconds 914 nanoseconds
G(1, 1000) = 2475190 - Calculated in 2 milliseconds 110 microseconds 786 nanoseconds
G(1, 10000) = 317257140 - Calculated in 4 milliseconds 347 microseconds 794 nanoseconds
G(1, 10000000) = 825808541 - Calculated in 6 seconds 409 milliseconds 468 microseconds 155 nanoseconds
G(1, 50000000) = 954109446 - Calculated in 55 seconds 936 milliseconds 472 microseconds 403 nanoseconds

*/