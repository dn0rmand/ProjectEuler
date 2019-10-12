const assert    = require('assert');
const timeLog   = require('tools/timeLogger');
const announce  = require('tools/announce');
const fs        = require('fs');
const workerpool= require('workerpool').pool();

const THREADS   = 16;
const MAX       = 1E7;
const MODULO    = 1000000007;

const FILENAME = 'problem682.state';
const TMPFILE  = 'problem682.tmp';

function part2Threaded(n, x, MODULO)
{
    function part2(p5, p3, p2)
    {
        let count = (p2+p3+p5);
        if (count & 1)
            return 0;

        count /= 2;
        let v = [p2, p3, p5];
        v.sort((a,b) => a-b);

        let v0 = v[0];
        let v1 = v[1];

        if (v0+v1 <= count)
            return ((v0+1)*(v1+1)) % MODULO;

        let N  = v[0]+v[1]-count;
        let N2 = (N*N) % MODULO;

        v0 -= N;

        let r = ((v0+1)*(v1+1) + N*v1 - N2) % MODULO;
        return r;
    }

    function shortcut3(x, y, s)
    {
        let t1 = (s+1)*y + (5*s*(s+1))/2;

        return ((t1 % MODULO) * x) % MODULO;
    }

    function shortcut2(x, z, s)
    {
        let t1 = (s+1)*z - (3*s*(s+1))/2;

        return ((t1 % MODULO) * x) % MODULO;
    }

    function shortcut(y, z, s)
    {
        let C1 = s+1;
        let C2 = (s * C1);
        let C3 = (C2*(s+s+1))/6;

        C2 /= 2;

        let t1 = C1*y*z + 5*C2*z;
        let t2 = 3*C2*y + 15*C3;

        return (t1-t2) % MODULO;
    }

    let total = 0;

    let f2 = 2*x;

    if (f2 > n)
        return 0;

    let ystart = -1;
    let zstart = -1;
    let remain = n - f2;

    for(let f3 = 0; ; f3 += 3)
    {
        let f5 = remain - f3;
        if (f5 < 0)
            break;

        if (f5 % 5 == 0)
        {
            ystart = f3 / 3;
            zstart = f5 / 5;
            break;
        }
    }

    if (ystart < 0 || zstart < 0)
        return 0;
    if ((x+ystart+zstart) & 1)
        return 0;

    if (n - f2 <= f2)
    {
        // can shortcut it
        steps = (zstart - (zstart % 3))/3;

        let t = shortcut(ystart+1, zstart+1, steps);
        total = (total + t) % MODULO;
        return total;
    }

    let y, z;

    for(y = ystart, z = zstart; z >= 0; y += 5, z -= 3)
    {
        if (y >= x+z)
        {
            // another shortcut possible.
            let steps = (z - (z % 3))/3;

            let t = shortcut2(x+1, z+1, steps);
            if (t)
                total = (total + t) % MODULO;
            break;
        }
        else if (z > x+y)
        {
            let t;
            let steps = Math.ceil((z-x-y)/8)-1;
            if (steps < 1)
            {
                t = part2(x, y, z);
            }
            else
            {
                t = shortcut3(x+1, y+1, steps);
                y += 5*(steps);
                z -= 3*(steps);
            }
            if (t)
                total = (total + t) % MODULO;
        }
        else
        {
            let t = part2(x, y, z);
            if (t)
                total = (total+t) % MODULO;
        }
    }

    return total;
}

async function solve(n, trace)
{
    function load()
    {
        if (! fs.existsSync(FILENAME))
            return { x: 0, total: 0 };

        let data = fs.readFileSync(FILENAME);

        data = JSON.parse(data);
        if (data.max == MAX)
            return data;

        return { x: 0, total: 0 };
    }

    function save(x, total)
    {
        let data = JSON.stringify({ x: x, total: total, max:MAX });
        fs.writeFileSync(TMPFILE, data);
        if (fs.existsSync(FILENAME))
            fs.unlinkSync(FILENAME);
        fs.renameSync(TMPFILE, FILENAME);
    }

    let total = 0;
    let startX = 0;

    if (trace)
    {
        let data = load();

        startX = data.x;
        total  = data.total;
    }

    let traceCount = 0;

    for(let x = startX; ; x += THREADS)
    {
        let f2 = 2*x;
        if (f2 > n)
            break;

        if (trace)
        {
            if (traceCount == 0)
            {
                process.stdout.write(`  \r${ n - f2 }`);
                save(x, total);
            }
            traceCount += THREADS;
            if (traceCount >= 1000)
                traceCount = 0;
        }

        let workers = [];
        for (let i = 0; i < THREADS; i++)
        {
            let w = workerpool.exec(part2Threaded, [n, x+i, MODULO]);
            workers.push(w)
        }
        let values = await Promise.all(workers);
        total = values.reduce((a, v) => (a+v) % MODULO, total);
    }

    if (trace)
        console.log('\r');

    return total;
}

async function main()
{
    assert.equal(await solve(10), 4);
    assert.equal(await solve(100), 3629);
    assert.equal(await solve(1000), 25808429);
    assert.equal(await solve(10000), 9403972);

    console.log('Tests passed');

    let answer = await timeLog.wrapAsync('', async () => {
        return await solve(MAX, true);
    });

    console.log('Answer is', answer);
    await announce(682, 'Anwer is '+answer);
    process.exit(0);
}

main();