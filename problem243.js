const assert = require('assert');
const totient = require('./tools/totient.js');
const primes = require('./tools/primes.js');

let targetN = 15499;
let targetD = 94744;

function resilience(d)
{
    let p = totient.PHI(d);
    let v1 = targetD * p;
    let v2 = targetN * (d-1);

    var v = v1 < v2;

    return v;
}

function step1()
{
    let d = 1;
    let previous = 1;

    for (let p of primes())
    {
        previous = d;
        d = p*d;
        if (resilience(d))
            break;
    }

    return previous;
}

function step2(start)
{
    let factor = 1;

    while (true)
    {
        let d = start * factor++;

        if (resilience(d))
        {
            return start;
        }
    }
}

function solve()
{
    let start = step1();
    let answer= step2(start)

    console.log(answer + " is the smallest denominator d, having a resilience R(d) < 15499/94744");
}

solve();