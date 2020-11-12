const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const dummyGC = () => {};

const GC = global.gc || dummyGC;

require('tools/numberHelper');

const FIVE = 5;
const MODULO_1 = 1000000007;
const MODULO_2 = 101;

function createTrolls(n, useIds)
{
    const R = (n) => (FIVE.modPow(n, MODULO_1) % MODULO_2) + 50;

    const trolls = [];

    for(let i = 0; i < n; i++)
    {
        const h = R(3*i);
        const l = R(3*i + 1);
        const q = R(3*i + 2);

        const t = { escape: false, h, l, q, uniqueId: i };

        trolls.push(t);
    }

    trolls.sort((a, b) => {
        let x1 = a.q / Math.pow(a.h, 1.01);
        let x2 = b.q / Math.pow(b.h, 1.01);
        if (x1 !== x2)
            return x1-x2;

        x1 = a.q / a.l;
        x2 = b.q / b.l;
        if (x1 !== x2)
            return x1-x2;

        if (a.q !== b.q)
            return a.q - b.q;
        if (a.h !== b.h)
            return b.h - a.h;
        if (a.l !== b.l)
            return b.l - a.l;
        return 0;
    })

    if (useIds) {
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
    }

    return trolls;
}

function getValue(trolls, height)
{
    let value = 0;
    
    for(const t of trolls)
    {
        height -= t.h;
        if (t.l >= height)
        {
            t.escape = true;
            value += t.q;
        }
        else
        {
            t.escape = false;
        }
    }
    return value;
}

function bruteQ(n, trace)
{
    const memoize = new Map();
    const tracer = new Tracer(1, trace);

    const allTrolls = createTrolls(n, true);
    const D         = Math.ceil(allTrolls.reduce((a, t) => a + t.h, 0) / Math.sqrt(2));

    console.log(getValue(allTrolls, D));

    let biggest = 0;

    function add(key, max)
    {
        if (memoize.size > 3000000) {
            memoize.clear();
            GC();
        }

        memoize.set(key, max);
        if (max > biggest) {
            biggest = max;
            tracer.print(_ => biggest);
        }
    }

    function inner(height, trolls)
    {
        if (height < 0)
            height = 0;

        const key = `${height}:${trolls.map(t => t.id).sort((a, b) => a-b).join(',')}`;
        let max = memoize.get(key);
        if (max)
            return max;

        if (height <= 100) { // every h+l is at least 100
            max = trolls.reduce((max, troll) => max + troll.q, 0);
            add(key, max);
            return max;
        }
        else {
            max = 0;
            let maxPossible = trolls.reduce((a, t) => a + t.q, 0);
            let previousID = -1;

            for(let i = 0; i < trolls.length; i++) {
                const troll = trolls[i];
                if (troll.id === previousID)
                    continue;
                previousID = troll.id;
                const newTrolls = trolls.slice(0, i).concat(trolls.slice(i+1));

                let m = inner(height-troll.h, newTrolls);

                if ((troll.h+troll.l) >= height)
                    m += troll.q;

                max = Math.max(max, m);

                if (max > biggest)
                {
                    biggest = max;
                    tracer.print(_ => biggest);
                }

                if (max >= maxPossible)
                    break;
            }

            add(key, max);
            return max;
        }
    }

    const maximum = inner(D, allTrolls);
    
    tracer.clear();

    return maximum;
}

function smartQ(n, trace)
{
    const tracer = new Tracer(1, trace);

    const trolls = createTrolls(n, true);
    const D      = Math.ceil(trolls.reduce((a, t) => a + t.h, 0) / Math.sqrt(2));

    let max = getValue(trolls, D);

    for(let i = 0; i < trolls.length; i++)
    {
        const t1 = trolls[i];

        for(let j = trolls.length-1; j > i; j--)
        {
            const t2 = trolls[j];

            if (t1.escape && t2.escape)
                continue;

            trolls[i] = t2;
            trolls[j] = t1;
            const m = getValue(trolls, D);
            if (m > max) {
                i = -1;
                max = m;
                tracer.print(_ => max);
                break;
            } else {
                trolls[i] = t1;
                trolls[j] = t2;
                getValue(trolls, D);
            }
        }
    }

    tracer.clear();

    return max;
}

const Q = bruteQ;

assert.strictEqual(Q(5), 401);
assert.strictEqual(timeLogger.wrap('Q(15)', _ => Q(15)), 941);

console.log('Tests passed');

const answer = Q(1000, true);
console.log(`Answer is ${answer}`);