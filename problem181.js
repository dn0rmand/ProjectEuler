const assert     = require('assert');
const Tracer     = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX_W = 40;
const MAX_B = 60;

const MAX_GKEY = BigInt((40*MAX_B) + MAX_W);

class State
{
    static makeKey = (b, w) => b * MAX_W + w;

    constructor(previous)
    {
        if (previous)
        {
            this.groups = previous.groups.map((g) => ( {...g}));
            this.count  = previous.count;
        }
        else
        {
            this.groups = [];
            this.count  = 1;
        }

        this.$key = undefined;
    }

    get key()
    {
        if (this.$key === undefined)
            this.$key = this.groups.reduce((a, g) => a * MAX_GKEY + BigInt(g.key), 0n);

        return this.$key;
    }

    sort()
    {
        this.groups.sort((a, b) => a.key - b.key);
    }

    startNewGroup(b, w)
    {
        let s = new State(this);
        s.groups.push({ b, w, key: State.makeKey(b, w) });
        s.sort();
        return s;
    }

    addToGroup(index, b, w)
    {
        if (index < 0 || index >= this.groups.length)
            throw "ERROR";

        let s = new State(this);
        let g = s.groups[index];

        g.b  += b;
        g.w  += w;
        g.key = State.makeKey(g.b, g.w);

        s.sort();

        return s;
    }
}

function solve(B, W, trace)
{
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());

    const tracer = new Tracer(1, trace);

    const add = (s) => {
        let old = newStates.get(s.key);
        if (old === undefined)
            newStates.set(s.key, s);
    };

    while (W--)
    {
        tracer.print(_ => `${B} ${W} - ${states.size}`);

        newStates.clear();

        for(let state of states.values())
        {
            add(state.startNewGroup(0, 1));
            let lastK = undefined;
            for(let i = 0; i < state.groups.length; i++)
            {
                let k = state.groups[i].key;
                if (k !== lastK)
                {
                    lastK = k;
                    add(state.addToGroup(i, 0, 1));
                }
            }
        }

        [states, newStates] = [newStates, states];
    }

    while (B--)
    {
        tracer.print(_ => `${B} - ${states.size}`);

        newStates.clear();

        for(let state of states.values())
        {
            add(state.startNewGroup(1, 0));

            let lastK = undefined;
            for(let i = 0; i < state.groups.length; i++)
            {
                let k = state.groups[i].key;
                if (k !== lastK)
                {
                    lastK = k;
                    add(state.addToGroup(i, 1, 0));
                }
            }
        }

        [states, newStates] = [newStates, states];
    }

    tracer.clear();

    let total = states.size; 
    
    return total;
}

assert.equal(solve(3, 1), 7);
assert.equal(solve(10, 5), 3804);
assert.equal(timeLogger.wrap('', _ => solve(30, 5, true)), 1961432);

console.log('Test passed');

const answer = solve(MAX_B, MAX_W, true);
console.log(`Answer is ${answer}`);