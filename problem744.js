const assert     = require('assert');
const G = require('glob');
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

    return wins;// .toFixed(10);
}

const $factorials = [];

function factorial(n)
{
    if (n < 2) return 1n;
    const i = Number(n);

    if (!$factorials[i]) {
        $factorials[i] = n * factorial(n-1n);
    }
    return $factorials[i];
}

function nCp(n, p)
{
    const top    = factorial(n);
    const bottom = factorial(p) * factorial(n-p);

    return top / bottom;
}

class Probability 
{
    static ONE() { 
        return new Probability(1n, 1n);
    }

    constructor(top, bottom) {
        this.top    = top === undefined ? 1n : BigInt(top);
        this.bottom = bottom === undefined ? 1n : BigInt(bottom);
        this.simplify();
    }

    multiply(other) {
        return new Probability(this.top * other.top, this.bottom * other.bottom);
    }

    simplify() {
        const g = this.top.gcd(this.bottom).valueOf();
        if (g == 0) {
            this.top = 0n;
            this.bottom = 1n;
        } else if (g !== 1n) {
            this.top /= g;
            this.bottom /= g;
        }
        return this;
    }

    add(other) {
        return new Probability(
            this.top*other.bottom + other.top*this.bottom,
            this.bottom * other.bottom);
    }

    minus(other) {
        return new Probability(
            this.top*other.bottom - other.top*this.bottom,
            this.bottom * other.bottom
            );
    }

    pow(n) {
        n = BigInt(n);
        return new Probability(this.top ** n, this.bottom ** n);
    }

    toNumber() {
        return this.top.divise(this.bottom, 30);
    }

    equal(other) {
        return this.top === other.top && this.bottom === other.bottom;
    }
}

function f2(n, pTop, pBottom, trace)
{
    let wins = 0;

    const expertWins = new Probability(pTop, pBottom);
    const playerWins = Probability.ONE().minus(expertWins);

    n = BigInt(n);

    const CARDS       = 2n*n+1n;
    const nExpertWins = expertWins.pow(n);
    const nPlayerWins = playerWins.pow(n);

    // for(let played = n; played < )
    for(let played = n; played < n+n; played++) {
        const reverse = played-n;
        const prob    = new Probability(CARDS-played, CARDS); 
        const ways    = new Probability(nCp(played-1n, reverse));  

        // Expert wins
        const expert = nExpertWins.multiply(playerWins.pow(reverse)).multiply(prob).multiply(ways); 

        // player wins
        const player = nPlayerWins.multiply(expertWins.pow(reverse)).multiply(prob).multiply(ways); 

        // total 
        const total = expert.add(player);    

        wins += total.toNumber();
    }

    return wins;
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
        // tracer.print(_ => n+n-played);

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

const f = f3;

assert.strictEqual(f(6, 1, 2), '0.2851562500');
assert.strictEqual(f(10,3, 7), '0.2330040743');
assert.strictEqual(timeLogger.wrap('', _ => f(10000, 3, 10)), '0.2857499982');
assert.strictEqual(timeLogger.wrap('', _ => f(100000, 3, 10, true)), '0.2857178571');

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => f(1E7, 0.4999, 1, true));
console.log(`Answer is ${answer}`);