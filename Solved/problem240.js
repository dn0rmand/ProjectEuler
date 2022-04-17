const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

class State
{
    constructor(dices, sum, count, key)
    {
        this.dices = dices || [];
        this.sum   = sum   || 0;
        this.count = count || 1n;
        this.key   = key || 0;
    }

    static maxPoolSize = 1000;

    static pool = new Array(State.maxPoolSize);
    static poolCount = 0;

    static create(dices, sum, count, key)
    {
        if (State.poolCount > 0)
        {
            let s = State.pool[--State.poolCount];
            s.dices = dices;
            s.sum   = sum;
            s.count = count;
            s.key   = key;
            return s;
        }
        else
            return new State(dices, sum, count, key);
    }

    static buildKey(dices)
    {
        return dices.reduce((a, v) => a*12n + BigInt(v-1), 0n);
    }

    release()
    {
        if (State.poolCount < State.maxPoolSize)
            State.pool[State.poolCount++] = this;
    }

    addRoll(value, diceCount, targetSum)
    {
        let dices;

        let sum   = this.sum;
        let key   = this.key;

        if (this.dices.length < diceCount)
        {
            sum += value;
            if (sum > targetSum)
                return undefined;

            dices = this.dices.slice();
            dices.push(value);
            dices.sort((a, b) => b-a);
            key = State.buildKey(dices);
        }
        else if (value > this.dices[diceCount-1])
        {
            let o = this.dices[diceCount-1];
            sum = sum - o + value;
            if (sum > targetSum)
                return undefined;

            dices = this.dices.slice();
            dices[diceCount-1] = value;
            dices.sort((a, b) => b-a);   
            key = State.buildKey(dices);
        }
        else
            dices = this.dices;

        return State.create(dices, sum, this.count, key);
    }
}

function solve(totalDices, diceSize, diceCount, targetSum, trace)
{
    let total     = 0n;
    let states    = new Map();
    let newStates = new Map();

    states.set(0, new State());

    const tracer = new Tracer(1, trace);

    for(let dice = totalDices; dice > 0; dice--)
    {
        tracer.print(_ => `${dice} : ${states.size}`);

        for(const state of states.values())
        {
            for(let value = 1; value <= diceSize; value++)
            {
                let s = state.addRoll(value, diceCount, targetSum);
                
                if (s === undefined)
                {
                    continue;
                }

                if (dice === 1) // last one
                {
                    if (s.sum === targetSum)
                        total += s.count;

                    s.release();
                }
                else
                {
                    const k = s.key;
                    const o = newStates.get(k);
                    if (o)
                    {
                        o.count += s.count;
                        s.release();
                    }
                    else
                        newStates.set(k, s);
                }
            }

            state.release();
        }
        // Swap
        {
            const x = states;
            states = newStates;
            newStates = x;
        }
        newStates.clear();
    }

    tracer.clear();

    return total;
}

assert.equal(solve(5, 6, 3, 15), 1111);
console.log('Test passed');

const answer = timeLogger.wrap('Solving', _ => solve(20, 12, 10, 70, true));
console.log(`Answer is ${answer}`);