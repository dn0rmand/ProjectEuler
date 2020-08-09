const assert = require('assert');
const Tracer = require('tools/tracer');

const MODULO = 1000000007;
const MAX = 1E15;

if (MAX > Number.MAX_SAFE_INTEGER)
    throw "TOO BIG";

function f(a, b)
{
    let count = 0;

    while (a || b)
    {
        if ((a ^ b) & 1)
        {
            a--;
            count++;
            if (count >= MODULO)
                count -= MODULO;
        }
        [a, b] = [(b-a)/2 , -(a+b)/2];
    }

    return count;
}

function BA(a, start, end)
{
    let total = 0;

    for(let b = start; b <= end; b += 1)
    {
        const t = f(a, b);
        total = (total + t) % MODULO;
    }

    return total;
}

function B(L)
{
    let total = 0;

    for(let a = -L; a <= L; a++)
    {
        const t = BA(a, -L ,L);

        total = (total + t) % MODULO;
    }

    return total;
}

assert.equal(f(11, 24), 9);
assert.equal(f(24, -11), 7);
assert.equal(f(8, 0), 3);
assert.equal(f(-5, 0), 5);
assert.equal(f(0, 0), 0);

assert.equal(B(500), 10795060);

console.log('Tests passed');

`
f(2b, 2a) + f(2b+1, 2a) + f(2b, 2a+1) + f(2b-1, 2a+1) = 4 + 4*f(a, b)
f(2b-1, 2a) f(2b-1, 2a-1) f(2b, 2a-1) f(2b+1, 2a+1) f(2b+1, 2a-1)



   xxy
   yxx
   yyy  
a
 b
`