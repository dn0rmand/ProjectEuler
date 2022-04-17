const assert     = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer     = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/bigintHelper');

const MAX = 1E11;

function f1(n, p)
{
    const CARDS  = n+n+1;
    const pp = 1-p;

    let playerCount = n;
    let nPlayerWins = 1/CARDS;

    let expertCount = n;
    let nExpertWins = 1/CARDS;

    let playerSum = nPlayerWins * (CARDS - n);
    let expertSum = nExpertWins * (CARDS - n);

    for(let played = n+1; played < n+n; played++) {
        const ways = (played-1) / (played-n);

        // EXPERT PART

        nExpertWins *= ways * p;
        expertSum += nExpertWins * (CARDS - played); 

        while (expertCount && nExpertWins > 1) {
            nExpertWins *= pp;
            expertSum   *= pp;
            expertCount--;    
        } 

        // PLAYER PART

        nPlayerWins *= ways * pp;
        playerSum += nPlayerWins * (CARDS - played);

        while (playerCount && nPlayerWins > 1) {
            nPlayerWins *= p;
            playerSum   *= p;
            playerCount--;
        }
    }

    if (expertCount)
        expertSum *= Math.pow((pp), expertCount);

    if (playerCount) 
        playerSum *= Math.pow(p, playerCount);

    const wins = (expertSum + playerSum).toFixed(11);
    return wins.substr(0, 12);
}

function f2(n, p)
{
    const CARDS  = n+n+1;

    const pp = 1-p;
    const pp2 = pp*pp;
    const pp3 = pp2*pp;
    const pp4 = pp3*pp;

    let playerCount = n;
    let nPlayerWins = 1/CARDS;

    let playerSum = nPlayerWins * (CARDS - n);

    let traceCount = 1;

    const tracer = new Tracer(1, true);

    for(let played = n+1; played < n+n; played++) {
        if (--traceCount === 0) {
            tracer.print(_ => n+n-played);
            traceCount = 10000000;
        }

        const ways = (played-1) / (played-n);

        // PLAYER PART

        nPlayerWins *= ways * p;
        playerSum += nPlayerWins * (CARDS - played);

        while (playerCount && nPlayerWins > 1) {
            if (playerCount > 3) {
                nPlayerWins *= pp4;
                playerSum   *= pp4;
                playerCount -= 4;
            } else if (playerCount > 2) {
                nPlayerWins *= pp3;
                playerSum   *= pp3;
                playerCount -= 3;    
            } else if (playerCount > 1) {
                nPlayerWins *= pp2;
                playerSum   *= pp2;
                playerCount -= 2;    
            } else {
                nPlayerWins *= pp;
                playerSum   *= pp;
                playerCount--;
            }
        }
    }

    if (playerCount) 
        playerSum *= Math.pow(pp, playerCount);

    tracer.clear();

    const wins = playerSum.toFixed(11);
    return wins.substr(0, 12);
}

function f(n, p, trace)
{
    if (trace) {
        return f2(n, p);
    } else {
        return f1(n, p);
    }
}

assert.strictEqual(f(6, 1/2), '0.2851562500');
assert.strictEqual(f(10,3/7), '0.2330040743');
assert.strictEqual(timeLogger.wrap('', _ => f(10000, 3/10)), '0.2857499982');
assert.strictEqual(timeLogger.wrap('', _ => f(100000, 3/10)), '0.2857178571');

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => f(MAX, 0.4999, true));
console.log(`Answer is ${answer}`);