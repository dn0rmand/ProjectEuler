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
                    let time = process.hrtime();
                    let results = episodeRecording(episodes);
                    time = process.hrtime(time);

                    if (expected[season][0] == results[0] && expected[season][1] == results[1])
                        console.log(season,  'good in',prettyHrtime(time, {verbose:true}));
                    else
                        console.log(`${season} bad. Expecting ${expected[season][0]}, ${expected[season][1]} but got ${results[0]}, ${results[1]} in ${ prettyHrtime(time, {verbose:true})} `);
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

const SCCNODE = 1000;

class SCC
{
    constructor()
    {
        this.num  = []; // length SCCNODE
        this.low  = [];
        this.col  = [];
        this.cycle= [];
        this.st   = [];
        this.tail = 0;
        this.cnt  = 0;
        this.cc   = 0;
        this.adj  = [];
    }

    clear(n)
    {
        this.cc += 3;
        for(let i = 0 ; i <= n ; i++)
            this.adj[i] = [];
        this.tail = 0;
    }

    tarjan(s)
    {
        this.num[s] = this.low[s] = this.cnt++;
        this.col[s] = this.cc + 1;
        this.st[tthis.ail++] = s;
        for(let i = 0; i < adj[s].length; i++)
        {
            let t = adj[s][i];
            if (this.col[t] <= this.cc )
            {
                this.tarjan(t);
                this.low[s] = Math.min(this.low[s], this.low[t]);
            }
            else if (this.col[t] == this.cc+1)
            {
                this.low[s] = Math.min(this.low[s], this.low[t]);
            }
        }
        if (this.low[s] == this.num[s])
        {
            while (true)
            {
                let temp = this.st[--this.tail];
                this.col[temp] = this.cc + 2;
                this.cycle[temp] = s;
                if (s == temp)
                    break;
            }
        }
    }

    findSCC(n )
    {
        for (let i = 0; i <= n; i++)
        {
            if ( this.col[i] <= this.cc )
                this.tarjan(i);
        }
    }
};

class SAT2
{
    constructor()
    {
        this.scc   = new SCC();
    }

    clear(n)
    {
        this.scc.clear(n);
    }

    orClause(a, b, converted )
    {
        if (! converted)
        {
            a *= 2;
            b *= 2;
        }
        /// A || B clause
        //!a->b !b->a
        this.scc.adj[a ^ 1].push(b);
        this.scc.adj[b ^ 1].push(a);
    }

    xorClause(a, b, converted)
    {
        if (! converted)
        {
            a *= 2;
            b *= 2;
        }

        this.orClause(a, b, true);
        this.orClause(a ^ 1, b ^ 1, true);
    }

    notAndClause(a, b, converted)
    {
        if (! converted)
        {
            a *= 2;
            b *= 2;
        }
        this.scc.adj[a].push(b ^ 1);
        this.scc.adj[b].push(a ^ 1);
    }

    ///Send n, total number of nodes, after expansion
    possible(n)
    {
        this.scc.findSCC(n);

        for (let i = 0; i <= n; i++)
        {
            let a = i;
            let b = i ^ 1;
            ///Falls on same cycle a and !a.
            if (this.scc.cycle[a] == this.scc.cycle[b] )
                return false;
        }

        ///Valid solution exists
        return true;
    }
}

function episodeRecording(episodes)
{
    let bestMin = 1, bestMax = 1, bestCount = 1;
    let nodes = [];

    function buildNodes()
    {
        nodes.push(undefined); // not needed

        for (let i = 1; i <= episodes.length; i++)
        {
            let e = episodes[i-1];

            let e1 = {
                episode: i,
                start:   e[0],
                end:     e[1],
                key:     i*2,
            };
    
            let e2 = {
                episode: i,
                start:   e[2],
                end:     e[3],
                key:     i*2+1,
            };
    
            nodes.push({ live: e1, replay: e2 });
        }
    }

    function isPossible(used, current)
    {
        for (let e of used)
        {
            if (current.start <= e.end && current.end >= e.start)
                return false;
        }

        return true;
    }

    function buildGraph(b, e)
    {
        let sat2 = new SAT2();
    
        b = b * 2;
        e = e * 2 + 1;

        for ( let i = b; i <= e; i += 2 )
        {
            ///First make sure only one between live and repeat is recorded
            sat2.xorClause(i, i+1);
        }

        for ( let i = b; i <= e; i++ )
        {
            let node1 = nodes[i];
            for ( let j = i + 1; j <= e; j++ )
            {
                let node2 = nodes[j];
                ///Check if they overlap
                if ( node1.end < node2.start || node2.end < node1.start)
                {
                    ///No overlap
                }
                else
                {
                    sat2.notAndClause(i, j);
                }
            }
        }
    }

    function findPath(start, end)
    {
        let used = [];

        function possible(index)
        {
            if (index > end)
                return true;

            let n = nodes[index];

            if (isPossible(used, n.live))
            {
                used.push(n.live);
                if (possible(index+1))
                    return true;
                used.pop();
            }
            if (isPossible(used, n.replay))
            {
                used.push(n.replay);
                if (possible(index+1))
                    return true;
                used.pop();
            }
            return false;
        }

        return possible(start);
    }

    function process(start, end)
    {
        let used = [];

        function lastPossible(index)
        {
            let i = index+1;
            if (i >= end)
                return index;

            let max = index;
            let n   = nodes[i];

            if (isPossible(used, n.live))
            {
                used.push(n.live);
                let m = lastPossible(i);
                used.pop();
                if (m > max)
                    max = m;
                if (max+1 === nodes.length)
                    return max; // no need to try better.
            }
            if (isPossible(used, n.replay))
            {
                used.push(n.replay);
                let m = lastPossible(i);
                used.pop();
                if (m > max)
                    max = m;
            }
    
            return max;
        }
    
        for (let l = start; l < end; l++)
        {
            if (bestCount+l-1 >= end) // No point ... can't do better
                break;

            let n = nodes[l];
    
            used[0] = n.live;
            r = lastPossible(l);
    
            used[0] = n.replay;
            r = Math.max(r, lastPossible(l));
    
            let count = r-l+1;
            if (count > bestCount)
            {
                bestCount = count;
                bestMin   = l;
                bestMax   = r;
            }
            if (r+1 === end) // Best we can do!
                break;
        }
    }

    buildNodes();

    // process(1, nodes.length);

    for (let l = 1; l < nodes.length; l++)
    {
        if (bestCount+l-1 >= nodes.length)
            break;

        let minR   = bestCount+l;
        let maxR   = nodes.length-1;
        let found  = -1;
        let okr    = -1;
        while (minR <= maxR)
        {
            let r = Math.floor((maxR + minR)/2);
            if (r < minR)
                r = minR;
            else if (r > maxR)
                r = maxR;
            let ok = true;
            if (found > 0)
            {
                if (okr < r)
                {
                    ok = findPath(found, r);
                    if (ok)
                    {
                        okr = r;
                    }
                }
            }

            if (ok && findPath(l, r))
            {
                minR = r+1;
                found= r;
            }
            else
                maxR = r-1;
        }

        if (found > 0 && found-l+1 > bestCount)
        {
            bestCount = found-l+1;
            bestMin   = l;
            bestMax   = found;
        }
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