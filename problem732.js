const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const FIVE = 5;
const MODULO_1 = 1000000007;
const MODULO_2 = 101;

function R(n)
{
    const r = (FIVE.modPow(n, MODULO_1) % MODULO_2) + 50;
    
    return  r;
}

function createTrolls(n)
{
    const trolls = [];

    for(let i = 0; i < n; i++)
    {
        const h = R(3*i);
        const l = R(3*i + 1);
        const q = R(3*i + 2);

        trolls.push({ h, l, uniqueId: i, q });
    }

    trolls.sort((a, b) => {
        if (a.h !== b.h)
            return b.h - a.h;
        if (a.q !== b.q)
            return a.q - b.q;
        if (a.l !== b.l)
            return b.l - a.l;
        return 0;
    })

    let idx = 0;
    let previous = undefined;
    let same = troll => {
        if (! previous)
            return false;

        return troll.h === previous.h && troll.l === previous.l && troll.q === previous.q;
    }

    trolls.forEach(troll => {
        if (same(troll))
            troll.id = previous.id;
        else
            troll.id = ++idx;
        previous = troll; 
    });

    return trolls;
}


function Q(n, trace)
{
    const memoize = {};
    const tracer = new Tracer(1, trace);

    const allTrolls = createTrolls(n);
    const D         = Math.ceil(allTrolls.reduce((a, t) => a + t.h, 0) / Math.sqrt(2));

    let maximum = 0;
    let biggest = 0;

    function getMaxQ(trolls, height)
    {
        let q = 0;

        trolls.forEach(t => t.unused = true);

        for(const troll of allTrolls) 
        {
            if (!troll.unused && troll.l >= height && troll.q > q)
            {
                q = troll.q;
            }
        }

        trolls.forEach(t => t.unused = false);

        return q;
    }

    function inner(height, trolls)
    {
        if (height < 0)
            height = 0;

        const key = `${height}-${trolls.map(t => t.id).join(':')}`;
        if (memoize[key])
            return memoize[key];

        if (height <= 0) {
            const max = trolls.reduce((max, troll) => max + troll.q, 0);
            memoize[key] = max;
            if (max > biggest)
            {
                biggest = max;
                tracer.print(_ => max);
            }
            return max;
        }
        else {
            let max = 0;
            let maxPossible = trolls.reduce((a, t) => a + t.q, 0);
            let previousID = -1;

            for(let i = 0; i < trolls.length; i++) {
                const troll = trolls[i];
                if (troll.id === previousID)
                    continue;
                previousID = troll.id;
                const newTrolls = trolls.slice(0, i).concat(trolls.slice(i+1));

                let m = inner(height-troll.h, newTrolls);
                let m0 = m;

                if ((troll.h+troll.l) >= height)
                    m += troll.q;

                max = Math.max(max, m);

                if (max > biggest)
                {
                    biggest = max;
                    const couldHaveBeen = m0 + getMaxQ(newTrolls, height-troll.h);                    
                    tracer.print(_ => `${max} - ${couldHaveBeen}`);
                }

                if (max >= maxPossible)
                    break;
            }

            memoize[key] = max;
            return max;
        }
    }

    maximum = inner(D, allTrolls);

    return maximum;
}

assert.strictEqual(Q(5), 401);
assert.strictEqual(timeLogger.wrap('Q(15)', _ => Q(15)), 941);

console.log('Tests passed');

const answer = Q(1000, true);
console.log(`Answer is ${answer}`);