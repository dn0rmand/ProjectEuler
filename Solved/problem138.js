const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const linearRecurrence = require('tools/linearRecurrence');

function bigSQRT(N)
{
    let n = BigInt(Math.floor(Math.sqrt(Number(N))));

    let nn = n*n;

    if (nn < N)
    {
        while (nn < N)
        {
            n++;
            nn = n*n; 
        }
    }
    else if (nn > N)
    {
        while (nn > N)
        {
            n--;
            nn = n*n; 
        }
    }

    if (nn === N)
        return n;
}

function *possibleL()
{
    const action = DELTA => 
    {
        let D = (DELTA*DELTA + 4) / 20;

        const L = Math.sqrt(D);

        if (L === Math.floor(L))
            return L;
    }

    for(let DELTA = 6; ; DELTA += 10)
    {
        let l = action(DELTA);
        if (l)
            yield l;

        l = action(DELTA+8);
        if (l)
            yield l;
    }  
}

function smallest(L)
{
    const DELTA = Math.sqrt(20*L*L - 4);

    if (DELTA !== Math.floor(DELTA))
        return false;

    if ((DELTA+4) % 10 === 0)
    {
        return true;
    }

    if (DELTA > 4 && (DELTA-4) % 10 === 0)
    {
        return true;
    }

    return false;
}

function solve()
{
    let values = [];

    for(L of possibleL())
    {
        values.push(L);
        if (values.length === 5)
            break;
    }

    const l = linearRecurrence(values);
    if (!l || l.factors.length !== 2)
        throw "expected recurrence not found";

    let total = 0n;

    values = [17n, 305n];
    for(let c = 0; c < 12n; c++)
    {
        total += values[0];
        values = l.next(values);
    }

    return total;
}

assert(smallest(17));
assert(smallest(305));

const answer = timeLogger.wrap('' , _ => solve());
console.log(`Answer is ${answer}`);