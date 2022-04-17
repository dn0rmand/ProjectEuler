const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const RBTree = require('bintrees').RBTree;

const compare = (a, b) => {
    if (a.end < b.start)
        return -1;
    else if (a.start > b.end) {
        return 1;
    } else {
        return 0;
    }
}

const MAX = 1E6;
const MAXG = 2E7;

const timer = new timeLogger();

timer.start();

const $G = timeLogger.wrap('preloading Gs', _ => {
    const $G = new RBTree(compare);

    $G.get = n => {
        const v = $G.find({ start: n, end: n });
        if (! v) {
            throw `No G entry found for ${n}`;        
        }

        return v.value;
    }

    $G.insert({
        start: 1,
        end: 1,
        value: 1
    });

    let last = { start: 2, end: 3, value: 2 };
    
    $G.insert(last);

    while (last.end < MAXG) {
        const next = {
            start: last.end+1,
            end: last.end + $G.get(last.value+1),
            value: last.value+1,
        };
        last = next;
        $G.insert(last);
    }

    return $G;
});

const $GROUPS = timeLogger.wrap('Loading groups', _ => {
    const groupSize = n => BigInt(n * $G.get(n));
    const nextValue = l => {
        const count = Number(l.end-l.start+1n)/ l.size;
        return l.value + count;
    };

    const $g = new RBTree(compare);

    $g.get = n => {
        n = BigInt(n);
        const v = $g.find({ start: n, end: n });
        if (! v) {
            throw `No group found for ${n}`;        
        }

        const offset = Number(n-v.start);
        const times  = (offset - (offset % v.size)) / v.size;

        return v.value + times;
    };

    let last = { 
        start: 1n, 
        end: 1n,
        value: 1, 
        size: 1 
    };
    
    $g.insert(last);

    const tracer = new Tracer(100000, true);

    const maximum = BigInt(MAX) ** 3n;
    
    let group = 2;

    while (last.end < maximum) {
        tracer.print(_ => maximum - last.end);

        const next = {
            start: last.end+1n,
            end: last.end + groupSize(group),
            value: nextValue(last),
            size: group,
        };

        $g.insert(next);

        group++;
        last = next;
    }

    tracer.clear();

    return $g;
});

const G = $GROUPS.get;

function S(max, trace)
{
    let total = 0;
    let extra = 0n;

    const tracer = new Tracer(2000, trace);
    for(let n = 1; n < max; n++) {
        tracer.print(_ => max - n);
        const cube  = BigInt(n) ** 3n;
        const value = G(cube);

        const t = total + value;
        if (t > Number.MAX_SAFE_INTEGER) {
            extra += BigInt(total);
            total = value;
        } else {
            total = t;
        }
    }
    tracer.clear();
    return extra + BigInt(total);
}

assert.strictEqual(G(1000), 86);
assert.strictEqual(G(1000000), 6137);

assert.strictEqual(timeLogger.wrap('', _ => S(1E3)), 153506976n);

console.log('Test passed');

const answer = timeLogger.wrap('Solving', _ => S(MAX, true));
console.log(`Answer is ${answer}`);

timer.pause();
timer.message = 'Total time';
timer.logStart();
timer.logEnd();