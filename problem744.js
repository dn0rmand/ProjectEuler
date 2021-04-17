const assert     = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer     = require('tools/tracer');

require('tools/bigintHelper');

const MAX = 1E11;

function f1(n, pTop, pBottom, trace)
{
    const p = pTop / pBottom;

    const start = {
        diff: 0,
        probability: 1,
        count: 1,
    };

    let states = new Map();

    states.set(0, start);

    let wins   = 0;
    let played = 0;
    let cards  = 2*n+2;

    const tracer = new Tracer(10000, trace);

    while (cards && states.size > 0) {

        tracer.print(_ => `${cards} - ${states.size} - ${wins.toFixed(10)}`);

        cards--;
        played++;

        const newStates = new Map();

        const add = newState => {
            if (newState.probability <= 1e-30) { 
                return; 
            }
            
            const max = (played + Math.abs(newState.diff))/2;

            if (max >= n) {
                wins += newState.probability;
    } else {
                const key = newState.diff;
                const old = newStates.get(key);
                if (old != null) {
                    old.probability += newState.probability;
                    old.count       += newState.count;
                } else {
                    newStates.set(key, newState);
                }
            }
    }

        for(const state of states.values()) {            
            // pick non-red card

            const prob = (cards-1)/cards;

            // expert wins 

            add({
                diff: state.diff - 1,
                probability: state.probability * p * prob,
                count: state.count,
            });

    // player wins

            add({
                diff: state.diff + 1,
                probability: state.probability * (1-p) * prob,
                count: state.count,
            });

            // otherwise pick red card -> the game ends
        }

        states = newStates;
    }

    tracer.clear();

    wins = wins.toFixed(13);
    return wins.substr(0, 12);
}

function f2(n, pTop, pBottom, trace)
{
    const expertWins  = pTop / pBottom;
    const playerWins  = 1 - expertWins;
    const nExpertWins = Math.pow(expertWins, n);
    const nPlayerWins = Math.pow(playerWins, n);

    const CARDS = 2*n+1;

    const tracer = new Tracer(10000, trace);

    let ways = 1;
    let expertSum = 0;
    let playerSum = 0;

    for(let played = n; played < n+n; played++) {
        tracer.print(_ => n+n-played);
        
        const otherCards = played-n;
        const prob       = (CARDS-played) / CARDS; 
        
        ways = played === n ? 1 : ways * (played-1) / otherCards;

        const times = prob * ways;

        // Expert wins
        const expert = nExpertWins * Math.pow(playerWins, otherCards) * times; 

        // player wins
        const player = nPlayerWins * Math.pow(expertWins, otherCards) * times; 

        // total 

        expertSum += expert;
        playerSum += player;
    }

    tracer.clear();

    let wins = expertSum + playerSum;
    wins = wins.toFixed(13);
    return wins.substr(0, 12);
}

function f3(n, top, bottom, trace)
{
    let wins = 0;

    const p = top / bottom;

    const expertWins  = Math.log10(p);
    const playerWins  = Math.log10(1 - p);
    const CARDS       = 2*n+1;

    const nExpertWins = expertWins * n;
    const nPlayerWins = playerWins * n;

    let ways;

    const tracer = new Tracer(10000, trace);

    for(let played = n; played < n+n; played++) {
        tracer.print(_ => n+n-played);

        const otherCards = played-n;
        const prob       = Math.log10(1 - (1 / CARDS)*played);

        if (otherCards > 0) {
            ways = ways + Math.log10(played-1) - Math.log10(otherCards);
        } else {
            ways = Math.log10(1);
        }

        const factor = prob + ways;

        // Expert wins
        const expert = nExpertWins + (playerWins * otherCards) + factor; 

        // player wins
        const player = nPlayerWins + (expertWins * otherCards) + factor;

        wins += Math.pow(10, expert) + Math.pow(10, player);
    }

    tracer.clear();

    wins = wins.toFixed(13);
    return wins.substr(0, 12);
}

const f = f2;

assert.strictEqual(f(6, 1, 2), '0.2851562500');
assert.strictEqual(f(10,3, 7), '0.2330040743');
assert.strictEqual(timeLogger.wrap('', _ => f(10000, 3, 10)), '0.2857499982');
assert.strictEqual(timeLogger.wrap('', _ => f(100000, 3, 10, true)), '0.2857178571');

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => f(1E7, 0.4999, 1, true));
console.log(`Answer is ${answer}`);