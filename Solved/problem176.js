/*
If n = (p1^a1)(p2^a2)...(pt^at), a(n) = ((2*a1 + 1)(2*a2 + 1) ... (2*at + 1) + 1)/2
*/

const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const primeHelper = require('tools/primeHelper')();

primeHelper.initialize(1E6);

function solve(target)
{
    let value = target*2+1;
    let factors = [];
    primeHelper.factorize(value, (p, f) => {
        factors.push(p);
    });
    factors.sort((a, b) => a-b);
    let expected = 1n;
    for(let p of primeHelper.allPrimes())
    {
        let f = factors.pop();
        if (p === 2)
            f = (f+1)/2;
        else
            f = (f-1)/2

        expected *= BigInt(p)**BigInt(f); 
        if (factors.length === 0)
            break;
    }
    return expected;
}

const answer = timeLogger.wrap('', () => solve(47547));
console.log(`Answer is ${answer}`);
