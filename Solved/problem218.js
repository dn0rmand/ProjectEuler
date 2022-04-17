const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/bigIntHelper');

const MAX = 10n ** 10n;
const MIN = 1n;

function SQRT(value)
{
    let root  = BigInt(Math.floor(Math.sqrt(Number(value))));

    let v = (root+1n) ** 2n;
    while (v <= value)
    {
        root++;
        v = (root+1n) ** 2n;
    }
    return root;
}

function *primitiveTriplets(min, max, trace)
{
    let traceCount = 0;

    max = BigInt(max);
    min = BigInt(min);

    // a^2 = m^2 - n^2, b = 2mn, c^2 = m^2+n^2 ( 0 < n < m )

    for(let m = min; m < max; m++)
    {
        const m2 = m*m;
        if (m2 > max)
            break;

        if (trace)
        {
            if (traceCount === 0)
                process.stdout.write(`\r${max - m2}  `);
            if (traceCount++ >= 100)
                traceCount = 0;
        }
        
        const start = (m & 1n) === 0n ? 1n : 2n;

        for(let n = start; n < m; n += 2n)
        {
            const n2 = n*n;
            const c  = m2+n2;

            if (c > max)
                break;

            if (m.gcd(n) !== 1n)
                continue;

            yield {a: m2-n2, b: 2n*m*n, c};
        } 
    }

    if (trace)
        process.stdout.write(`\r        \r`);
}

function triangles(min, max, trace)
{
    let count = 0;

    // c^2 = a^2 + b^2
    // a^2 = m^2 - n^2, b = 2mn, c^2 = m^2+n^2

    for(let {a, b, c} of primitiveTriplets(min, max, trace))
    {
        // 6 = 2*3
        // 28= 2*2*7
        // a=7, b=24 and c=25
        let area = (a*b)/2n;
        if (area % 6n === 0n || area % 28n === 0n)
            continue;

        for (let ka = a, kb = b, kc = c ; kc <= max; ka += a, kb += b, kc += c)
        {
            let kcc = SQRT(kc);
            if (kcc*kcc === kc)
            {
                const k     = kc / k;
                const area2 = k*k*(area);

                if (area2 % 6n !== 0n || area2 % 28n !== 0n)
                {
                    count++;
                }
            }
        }
    }

    return count;
}

const answer = timeLogger.wrap('', _ => triangles(MIN, MAX, true));
console.log(`Answer is ${answer}`);