const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const assert = require('assert');

async function loadExpected(FILENAME)
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream(FILENAME+'.expected')
        });

        let exp = [];
        readInput
        .on('line', (line) => {
            let v = line.split(' ');
            v[0] = +(v[0]);
            v[1] = +(v[1]);
            exp.push(v);
        })
        .on('close', () => {
            expected = exp;
            resolve(exp);
        });
    });
}

async function execute(FILENAME, expected)
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream(FILENAME+'.data')
        });

        let seasons      = undefined;
        let season       = 0;
        let episodeCount = 0;
        let episodes     = undefined;

        readInput
        .on('line', (line) => {
            if (seasons === undefined)
            {
                seasons = +line;
            }
            else if (! episodeCount)
            {
                assert.notEqual(seasons, 0);
                seasons--;
                episodeCount = +line;
                episodes = [];
            }
            else
            {
                const values = line.split(' ');
                assert.equal(values.length, 4);

                values[0] = +values[0];
                values[1] = +values[1];
                values[2] = +values[2];
                values[3] = +values[3];

                episodes.push(values);

                if (episodeCount === episodes.length)
                {
                    let results = episodeRecording(episodes);

                    let e = expected[season][0]+','+expected[season][1];
                    assert.equal(results[0]+','+results[1], e);
                    console.log(season,  'good');

                    season++;
                    episodes = undefined;
                    episodeCount = 0;
                }
            }
        })
        .on('close', () => {
            resolve();
        });
    });
}

function episodeRecording(episodes)
{
    let bestMin = 1, bestMax = 1, bestCount = 1;
    let nodes = [];
    let used  = [];

    function isPossible(current)
    {
        for (let e of used)
        {
            if (current.start <= e.end && current.end >= e.start)
                return false;
        }

        return true;
    }

    function lastPossible(index)
    {
        let i = index+1;
        if (i >= nodes.length)
            return index;

        let max = index;
        let n   = nodes[i];

        if (isPossible(n.live))
        {
            used.push(n.live);
            let m = lastPossible(i);
            if (m > max)
                max = m;
            used.pop();
            if (max+1 === nodes.length)
                return max; // no need to try better.
        }
        if (isPossible(n.replay))
        {
            used.push(n.replay);
            let m = lastPossible(i);
            if (m > max)
                max = m;
            used.pop();
        }

        return max;
    }

    // Create nodes

    nodes.push(undefined); // not needed

    for (let i = 1; i <= episodes.length; i++)
    {
        let e = episodes[i-1];

        let e1 = {
            episode: i,
            start: e[0],
            end:   e[1]
        };

        let e2 = {
            episode: i,
            start: e[2],
            end: e[3],
        };

        nodes.push({ live: e1, replay: e2 });
    }

    for (let l = 1; l <= nodes.length; l++)
    {
        let r;

        let n = nodes[l];

        used[0] = n.live;
        r = lastPossible(l);

        used[0] = n.replay;
        r = Math.max(r, lastPossible(l));

        let count = r-l+1;
        if (count > bestCount || (count === bestCount && l < bestMin))
        {
            bestCount = count;
            bestMin   = l;
            bestMax   = r;
        }
        if (r+1 === nodes.length) // Best we can do!
            break;
    }

    return [bestMin, bestMax];
}

async function DoIt()
{
    console.log('Test Case 1');
    let exp = await loadExpected('episodeRecording-1');
    let time = process.hrtime();
    await execute('episodeRecording-1', exp);
    time = process.hrtime(time);
    console.log(prettyHrtime(time, {verbose:true}));

    console.log('Test Case 2');
    exp = await loadExpected('episodeRecording-2');
    time = process.hrtime();
    await execute('episodeRecording-2', exp);
    time = process.hrtime(time);
    console.log(prettyHrtime(time, {verbose:true}));
}

DoIt();