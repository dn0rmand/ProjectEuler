const assert     = require('assert');
const Tracer     = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const BigSet     = require('@dn0rmand/project-euler-tools/src/BigSet');

function sortStations(stations, trace)
{
    const tracer = new Tracer(1, trace);
    tracer.print(_ => 'Sorting');
    stations.sort((s1, s2) => {
        if (s1.x === s2.x)
            return s1.y - s2.y;
        else
            return s1.x - s2.x;
    });

    // reduce to 1 dimension

    tracer.print(_ => 'Reducing');
    stations = stations.map(v => v.y);

    // convert to Uint32Array

    tracer.print(_ => 'Converting');
    stations = new Uint32Array(stations);

    tracer.clear();
    return stations;
}

function getStations(n, trace)
{
    const keys = new BigSet();

    let x = 1, y = 1;

    keys.add('1,1');
    const stations = [{x, y}];

    const tracer = new Tracer(10000, trace);
    for(let i = 1; i <= 2*n; i++)
    {
        tracer.print(_ => stations.length);
        const x2 = (x+x) % n;
        const y2 = (y+y+y) % n;

        if (x2 === 0 && y2 === 0)
            continue;

        const key = `${x2},${y2}`;

        if (keys.has(key))
            break;

        stations.push({x: x2, y: y2});
        keys.add(key);

        x = x2 || x;
        y = y2 || y;
    }

    tracer.clear();
    return sortStations(stations, trace);
}

function S(n, trace)
{
    const tracer = new Tracer(100, trace);

    let stations    = getStations(n, trace);
    let steps       = 0;
    let count       = stations.length;
    let offset      = 0;
    let MIN         = 0;

    while(count > 0)
    {
        tracer.print(_ => count);
        steps++;

        let minY = stations[offset];
        if (minY === MIN)
        {
            offset += 1;
            count   = count-1;
            continue;
        }
        else if (1 < count && stations[offset+1] === MIN)
        {
            offset += 2;
            count   = count-2;
            continue;
        }
            
        const len = offset+count;

        count = 0;

        for(let i = offset+1; i < len; i++)
        {
            const to = stations[i+offset];
            
            if (to >= minY)
            {
                stations[count++] = to;
            }
            else
            {
                minY = to;
                if (minY === MIN)
                {
                    stations.copyWithin(count, offset+i+1, len);
                    count += len-i-1;
                    break;
                }
            }
        }
        MIN = minY;
        offset = 0;
    }
    tracer.clear();
    return steps;
}

function solve(maxK, trace)
{
    let total = 0;

    const tracer = new Tracer(1, trace);
    for(let k = 1; k <= maxK; k++)
    {
        tracer.print(_ => k);

        const n = k ** 5;
        // if (k === 27)
        //     total += S27(n, trace);
        // else
            total += S(n, trace);
    }
    tracer.clear();

    return total;
}

assert.equal(S(22), 5);
assert.equal(S(123), 14);
assert.equal(S(10000), 48);

assert.equal(solve(10), 48561);

console.log('Tests passed');

const answer = timeLogger.wrap('Solving', _ => solve(30, true));
console.log(`Answer is ${answer}`);