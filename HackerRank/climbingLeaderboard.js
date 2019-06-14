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
            let v = +line;
            exp.push(v);
        })
        .on('close', () => {
            expected = exp;
            resolve(exp);
        });
    });
}

async function loadData(FILENAME)
{
    return new Promise((resolve, error) => {
        const readInput = readline.createInterface({
            input: fs.createReadStream(FILENAME+'.data')
        });

        let scoreCount   = undefined;
        let scores       = undefined;
        let aliceCount   = undefined;
        let alice        = undefined;

        readInput
        .on('line', (line) => {
            if (scoreCount === undefined)
            {
                scoreCount = +line;
            }
            else if (scores === undefined)
            {
                scores = line.split(' ');
                assert.equal(scores.length, scoreCount);
                for (let i = 0; i < scoreCount; i++)
                {
                    scores[i] = +scores[i];
                }
            }
            else if (aliceCount === undefined)
            {
                aliceCount = +line;
            }
            else if (alice === undefined)
            {
                alice = line.split(' ');
                assert.equal(alice.length, aliceCount);
                for (let i = 0; i < aliceCount; i++)
                {
                    alice[i] = +alice[i];
                }
            }
            else
                throw "Error: Too many input rows";
        })
        .on('close', () => {
            resolve([scores, alice]);
        });
    });
}

function climbingLeaderboard(scores, alice)
{
    let ranks = [];

    let rank    = 1;
    let previous= scores[0];
    let iScores = 0;
    let iAlice  = alice.length;
    let current = alice[--iAlice];

    while (true)
    {
        if (current >= previous)
        {
            ranks.push(rank);
            if (iAlice === 0)
                break;

            current = alice[--iAlice];
        }
        else if (++iScores < scores.length)
        {
            let v = scores[iScores];
            if (v === previous)
                continue;
            rank++;
            previous = v;
        }
        else
        {
            rank++;
            for (let i = 0; i <= iAlice; i++)
                ranks.push(rank);
            break;
        }
    }

    return ranks.reverse();
}

async function DoIt()
{
    console.log('Test Case 1');
    let exp = await loadExpected('climbingLeaderboard');
    let [scores, alice] = await loadData('climbingLeaderboard');

    let time = process.hrtime();
    let result = climbingLeaderboard(scores, alice);
    time = process.hrtime(time);
    assert.deepEqual(result, exp);
    console.log(prettyHrtime(time, {verbose:true}));

    // console.log('Test Case 2');
    // exp = await loadExpected('climbingLeaderboard-2');
    // time = process.hrtime();
    // await execute('climbingLeaderboard-2', exp);
    // time = process.hrtime(time);
    // console.log(prettyHrtime(time, {verbose:true}));
}

DoIt();