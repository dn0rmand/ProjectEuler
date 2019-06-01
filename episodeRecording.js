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

                    if (expected[season][0] != results[0] || expected[season][1] != results[1])
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

class StronglyConnectedComponents
{
    constructor(edges)
    {
        this.$num  = [];
        this.$low  = [];
        this.$col  = [];
        this.$cycle= [];
        this.$st   = [];
        this.$tail = 0;
        this.$count= 0;
        this.$index= 0;
        this.$edges= edges;
        this.$hasCycles = false;
    }

    tarjan(s, stack)
    {
        this.$num[s] = this.$low[s] = this.$count++;
        this.$col[s] = this.$index + 1;

        stack.push(s);

        const edge = this.$edges[s] || [];

        for(let i = 0; i < edge.length; i++)
        {
            const t = edge[i] || 0;
            if ((this.$col[t] || 0) <= this.$index)
            {
                this.tarjan(t, stack);
                this.$low[s] = Math.min(this.$low[s] || 0, this.$low[t] || 0);
            }
            else if ((this.$col[t] || 0) === this.$index+1)
            {
                this.$low[s] = Math.min(this.$low[s] || 0, this.$low[t] || 0);
            }
        }
        if ((this.$low[s] || 0) === (this.$num[s] || 0))
        {
            while (true)
            {
                const temp = stack.pop() || 0;

                this.$col[temp] = this.$index + 2;
                this.$cycle[temp] = s;
                if (s === this.$cycle[temp ^ 1])
                    this.$hasCycles = true;

                if (s === temp)
                    break;
            }
        }
    }

    findCycles(n)
    {
        for (let i = 0; i <= n; i++)
        {
            if ((this.$col[i] || 0) <= this.$index)
                this.tarjan(i, []);
        }
        return this.$hasCycles;
    }
};

class SAT2
{
    constructor()
    {
        this.$edges = [];
    }

    add(index, value)
    {
        let a = this.$edges[index];
        if (a === undefined)
            this.$edges[index] = [value];
        else
            a.push(value);
    }

    xorClause(a, b)
    {
        a *= 2;
        b *= 2;

        // OR
        this.add(a ^ 1, b);
        this.add(b ^ 1, a);

        // Reversed OR
        this.add(a, b ^ 1);
        this.add(b, a ^ 1);
    }

    notAndClause(a, b)
    {
        a *= 2;
        b *= 2;

        this.add(a, b ^ 1);
        this.add(b, a ^ 1);
    }

    possible(n)
    {
        const scc = new StronglyConnectedComponents(this.$edges);

        if (scc.findCycles(n))
            return false;

        return true;
    }
}

function episodeRecording(episodes)
{
    let bestMin = 0, bestMax = 0;
    const nodes = [];

    function buildNodes()
    {
        for (let i = 0; i < episodes.length; i++)
        {
            const e = episodes[i];

            const e1 = {
                start:   e[0],
                end:     e[1],
            };

            const e2 = {
                start:   e[2],
                end:     e[3],
            };

            nodes.push(e1);
            nodes.push(e2);
        }
    }

    function buildGraph(b, e)
    {
        const sat2 = new SAT2();

        b = b * 2;
        e = e * 2 + 1;

        for ( let i = b; i <= e; i += 2 )
        {
            ///First make sure only one between live and repeat is recorded
            sat2.xorClause(i, i+1);
        }

        for ( let i = b; i <= e; i++ )
        {
            const node1 = nodes[i];
            if (node1 === undefined)
                break;

            for ( let j = i + 1; j <= e; j++ )
            {
                const node2 = nodes[j];
                if (node2 === undefined)
                    break;
                if (! (node1.end < node2.start || node2.end < node1.start))
                    sat2.notAndClause(i, j);
            }
        }

        return sat2;
    }

    buildNodes();

    for (let left = 0, right = 1; right < episodes.length; right++ )
    {
        if (right - left <= bestMax - bestMin)
            continue;

        let sat2 = buildGraph(left, right);

        while (! sat2.possible(episodes.length * 4)) // 2 nodes / episode and 2 states per node ( XOR )
        {
            if (left === right)
                throw "It should be possible!";
            sat2 = buildGraph(++left, right);
        }
        if (right - left > bestMax - bestMin )
        {
            bestMin = left;
            bestMax = right;
        }
    }

    return [bestMin+1, bestMax+1];
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