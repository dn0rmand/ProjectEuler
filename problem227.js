const assert = require('assert');
const timeLog = require('tools/timeLogger');

const PLAYERS = 10;

class State
{
    constructor(dice1, dice2, probability)
    {
        if (dice1 < 0)
            dice1 += PLAYERS;
        if (dice2 < 0)
            dice2 += PLAYERS;

        this.dice1 = dice1 % PLAYERS;
        this.dice2 = dice2 % PLAYERS;
        this.probability = probability;
    }

    createNext(v1, v2, probability)
    {
        let s = new State(this.dice1+v1, this.dice2+v2, this.probability * probability);

        return s;
    }

    get key()
    {
        return this.dice1 * (PLAYERS*10) + this.dice2;
    }

    get loser()
    {
        return this.dice1 == this.dice2;
    }
}

class StateCollection
{
    constructor()
    {
        this.inner = new Map();
    }

    add(state)
    {
        let k = state.key;
        let s = this.inner.get(k);
        if (s)
            s.probability += state.probability;
        else
            this.inner.set(k, state);
    }

    forEach(callback)
    {
        for (let state of this.values)
            callback(state);
    }

    get values() { return this.inner.values(); }

    get size() { return this.inner.size; }
}

function solve()
{
    let result = 0;
    let states = new StateCollection();

    let middle = Math.floor(PLAYERS / 2);
    states.add(new State(1, middle, 1));

    for(let turn = 0; turn < 1500; turn++)
    {
        let newStates = new StateCollection();

        states.forEach((state) =>
        {
            if (state.loser)
            {
                result += turn * state.probability;
            }
            else
            {
                newStates.add(state.createNext(1, 1, 1/36)); // two 1
                newStates.add(state.createNext(-1,-1,1/36)); // two 6
                newStates.add(state.createNext(1,-1, 1/36)); // a 1 and a 6
                newStates.add(state.createNext(-1,1, 1/36)); // a 6 and a 1
                newStates.add(state.createNext(1, 0, 4/36)); // a 1 and neither 1 or 6
                newStates.add(state.createNext(-1,0, 4/36)); // a 6 and neither 1 or 6
                newStates.add(state.createNext(0, 1, 4/36)); // neither 1 or 6 and a 1
                newStates.add(state.createNext(0,-1, 4/36)); // neither 1 or 6 and a 6
                newStates.add(state.createNext(0, 0,16/36)); // neither 1 or 6 for both dices
            }
        });

        states = newStates;
    }

    return result;
}

let answer = timeLog.wrap('', () => {
    return solve();
});

console.log("Answer is", answer);