const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const assert = require('assert');

const expected = [
    /*
    [7, 12],
    [36, 41],
    [1, 5],
    [85, 92],
    [3, 6],
    [4, 7],
    [4, 8],
    [16, 20],
    [30, 35],
    [74, 80],
    [19, 24],
    [24, 30],
    [3, 6],
    [3, 9],
    [8, 12],
    [66, 71],
    [5, 9],
    [1, 4],
    [2, 6],
    [1, 4],
    [3, 6],
    [2, 5],
    [4, 8],
    [14, 19],
    [11, 16],
    [32, 37],
    [6, 9],
    [10, 15],
    [18, 25],
    [49, 54],
    [8, 16],
    [11, 16],
    [3, 7],
    [31, 35],
    [38, 44],
    [29, 34],
    [44, 49],
    [6, 10],
    [14, 18],
    [25, 30],
    [6, 12],
    [14, 18],
    [3, 5],
    [9, 14],
    [44, 48],
    [1, 6],
    [4, 7],
    [18, 23],
    [6, 9],
    [13, 18],
    [25, 32],
    [27, 33],
    [8, 14],
    [21, 25],
    [37, 42],
    [1, 1],
    [3, 8],
    [20, 25],
    [38, 43],
    [14, 19],
    [36, 43],
    [7, 11],
    [1, 3],
    [1, 5],
    [17, 22],
    [26, 31],
    [2, 6],
    [1, 3],
    [8, 11],
    [34, 39],
    [14, 18],
    [1, 3],
    [1, 4],
    [7, 12],
    [20, 27],
    [11, 15],
    [48, 55],
    [19, 26],
    [24, 31],
    [17, 21],
    [6, 12],
    [5, 10],
    [57, 66],
    [21, 26],
    [32, 37],
    [24, 28],
    [39, 44],
    [3, 7],
    [47, 53],
    [30, 35],
    [1, 1],
    [3, 8],
    [4, 11],
    [34, 38],
    [1, 5],
    [1, 5],
    [20, 25],
    [3, 6],
    [46, 52],
    [37, 44],
    */
];

function execute()
{
    const readInput = readline.createInterface({
        input: fs.createReadStream('episodeRecording.expected')
    });

    readInput
    .on('line', (line) => {
        let v = line.split(' ');
        v[0] = +(v[0]);
        v[1] = +(v[1]);
        expected.push(v);
    })
    .on('close', () => {
        execute2();
    });
}

function execute2()
{
    let startTime = process.hrtime();

    const readInput = readline.createInterface({
        input: fs.createReadStream('episodeRecording.data')
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
        let endTime = process.hrtime(startTime);
        let time    = prettyHrtime(endTime, {verbose:true});

        console.log(time);
        process.exit(0);
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
            max = Math.max(max, lastPossible(i));
            used.pop();
            if (max+1 === nodes.length)
                return max; // no need to try better.
        }
        if (isPossible(n.replay))
        {
            used.push(n.replay);
            max = Math.max(max, lastPossible(i));
            used.pop();
        }

        return max;
    }

    // Create nodes

    for (let i = 0; i < episodes.length; i++)
    {
        let e = episodes[i];

        let e1 = {
            episode: i+1,
            start: e[0],
            end:   e[1]
        };

        let e2 = {
            episode: i+1,
            start: e[2],
            end: e[3],
        };

        nodes.push({ live: e1, replay: e2 });
    }

    for (let l = 0; l < nodes.length; l++)
    {
        let n = nodes[l];
        used[0] = n.live;
        let r = lastPossible(l);

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

    return [bestMin+1, bestMax+1];
}

execute();