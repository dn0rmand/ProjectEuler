const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

require('tools/numberHelper');

const MAX = 1000000;

function generateTriangles(max, trace)
{
    const triangles = new Map();

    function add(a, b, c)
    {
        let map = triangles.get(a);
        if (map === undefined)
            triangles.set(a, map = new Map());

        map.set(`${a}:${b}`, { a: a, b: b, c: c });
    }
    
    const tracerN = new Tracer(1, trace);

    for(let n = 1; ; n++)
    {
        const n2 = n*n;
        if (n2 >= max)
            break;

        tracerN.print(_ => max-n2);

        for(let m = n+1; ; m += 2)
        {
            const m2 = m*m;
            const C = m2 + n2;
            if (C >= max)
                break;

            if (n.gcd(m) !== 1)
                continue;

            const A = m2-n2;
            const B = 2*m*n;

            for(let k = 1; ; k++)
            {
                const c = k*C;
                if (c >= max)
                    break;
                const a = k*A;
                const b = k*B;

                add(a, b, c);
                add(b, a, c);
            }
        }
    }

    tracerN.clear();

    for(let k of triangles.keys())
    {
        let m = triangles.get(k);
        if (m.size > 1)
        {
            let t = [...m.values()].sort((t1, t2) => t1.c - t2.c);
            triangles.set(k, t);
        }
        else
            triangles.delete(k);
    }

    return triangles;
}

function count(max, trace)
{
    const triangles = generateTriangles(max, trace);
    
    const tracer = new Tracer(100, trace)
    let total = 0;
    let size = triangles.size;

    for(let a of triangles.keys())
    {
        tracer.print(_ => size);
        size--;

        let ts = triangles.get(a);

        for(let i = 0; i < ts.length; i++)
        {
            const t1 = ts[i];

            for(let j = i+1; j < ts.length; j++)
            {
                const t2 = ts[j];

                const h = (t1.b * t2.b) / (t1.b + t2.b);
                if (Math.floor(h) === h)
                {
                    total++;
                } 
            }
        }
    }

    tracer.clear();
    return total;
}

assert.equal(count(200), 5);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => count(MAX, true));
console.log(`Answer is ${answer}`);
