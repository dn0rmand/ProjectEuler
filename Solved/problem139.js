const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const BigSet = require('@dn0rmand/project-euler-tools/src/BigSet');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MAX = 100000000;

function *primitiveTriplets(max, trace)
{
    // a = m^2 - n^2, b = 2mn, c = m^2+n^2
    const tracer = new Tracer(100, trace);

    for(let m = 2;; m++)
    {
        const m2 = m*m;

        if (m2 >= max) // C = m2+n2
            break;

        tracer.print(_ => max - m2);
        
        const start = m & 1 ? 2 : 1;
        for(let n = start; n < m; n += 2)
        {
            const n2 = n*n;
            const a  = m2-n2;
            const b  = 2*m*n
            const c  = m2+n2;

            if (a+b+c >= max)
                break;

            if (m.gcd(n) !== 1)
                continue;

            yield { a, b, c };
        } 
    }
    tracer.clear();
}

function solve(max, trace)
{
    let total = 0;

    for(const { a, b, c } of primitiveTriplets(max, trace))
    {
        const d = Math.abs(b-a);
        if (c % d === 0 && (a+b+c) < max) 
        {            
            const l = a+b+c;
            const count = Math.floor((max-1) / l);
            total += count;
        }
    }

    return total;
}

const answer = timeLogger.wrap('', _ => solve(MAX, true));

console.log(`Answer is ${answer}`);
