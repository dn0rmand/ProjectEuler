const assert     = require('assert');
const Tracer     = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const BigMap     = require('tools/BigMap');

const MAX_W = 40;
const MAX_B = 60;

const MAX_KEY  = (40*MAX_B) + MAX_W;
const MAX_GKEY = BigInt(MAX_KEY);
const MAX_GROUPS = MAX_W + MAX_B;

const MAX_POOL_SIZE = 100000;

class State
{
    static makeGroup = (b, w) => b * MAX_W + w;
    static addWhite  = v => v+1;
    static addBlack  = v => v + MAX_W;
    static compare   = (a, b) => a-b;

    static pool = [];
    static arrays = [];

    static getArrays(size)
    {
        let arrays = State.arrays[size];
        if (arrays === undefined)
            arrays = State.arrays[size] = [];
        return arrays;
    }

    static popArray(size)
    {
        const arrays = State.getArrays(size);

        if (arrays.length > 0)
            return arrays.pop();
        else
            return new Uint32Array(size);
    }

    static pushArray(array)
    {
        const arrays = State.getArrays(array.length);
        if (arrays.length < MAX_POOL_SIZE)
            arrays.push(array)
    }

    static create(previous, size)
    {
        if (State.pool.length > 0)
        {
            const s = State.pool.pop();
            s.groups = State.popArray(size);
            s.groups.set(previous.groups, 0);
            return s;
        }
        else
        {
            const s = new State();
            s.groups = State.popArray(size);
            s.groups.set(previous.groups, 0);

            return s;
        }
    }

    release()
    {
        if (State.pool.length < MAX_POOL_SIZE)
            State.pool.push(this);

        State.pushArray(this.groups);

        this.groups = undefined;
        this.$key   = undefined;
    }

    constructor()
    {
        this.groups = undefined;
        this.$key   = undefined;
    }

    get key()
    {
        if (this.$key === undefined)
        {
            this.$key = this.groups.reduce((a, g) => a * MAX_GKEY + BigInt(g), 0n);
        }
        return this.$key;
    }

    sort()
    {
        this.groups.sort(State.compare);
        this.$key = undefined;
    }

    startNewGroup(b, w)
    {
        let s = State.create(this, this.groups.length+1);
        let i = this.groups.length;
        s.groups[i] = State.makeGroup(b, w);
        s.sort();
        return s;
    }

    addToGroup(index, b, w)
    {
        let s = State.create(this, this.groups.length);
        let g = s.groups[index];

        g = b ? State.addBlack(g) : g;
        g = w ? State.addWhite(g) : g;

        s.groups[index] = g;

        s.sort();

        return s;
    }
}

function solve(B, W, trace)
{
    let states    = new BigMap();
    let newStates = new BigMap();

    states.set(0, State.create({ groups: [] }));

    const tracer = new Tracer(1, trace);

    const add = (s) => {
        let old = newStates.get(s.key);
        if (old === undefined)
            newStates.set(s.key, s);
        else
            s.release();
    };

    while (W--)
    {
        tracer.print(_ => `${B} ${W} - ${states.size}`);

        newStates.clear();

        for(let state of states.values())
        {
            add(state.startNewGroup(0, 1));
            let lastK = undefined;
            let len = state.groups.length;
            for(let i = 0; i < len; i++)
            {
                let k = state.groups[i];
                if (k !== lastK)
                {
                    lastK = k;
                    add(state.addToGroup(i, 0, 1));
                }
            }

            state.release();
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
            let len = state.groups.length;
            for(let i = 0; i < len; i++)
            {
                let k = state.groups[i];
                if (k !== lastK)
                {
                    lastK = k;
                    add(state.addToGroup(i, 1, 0));
                }
            }

            state.release();
        }

        [states, newStates] = [newStates, states];
    }

    tracer.clear();

    let total = states.size; 
    
    return total;
}

assert.equal(solve(3, 1), 7);
assert.equal(solve(10, 5), 3804);
// assert.equal(timeLogger.wrap('', _ => solve(30, 5, true)), 1961432);

console.log('Test passed');
// process.exit(0);

let answer = timeLogger.wrap('', _ => solve(1, MAX_W, true));
console.log(`1x${MAX_W} is ${answer}`);

answer = timeLogger.wrap('', _ => solve(2, MAX_W, true));
console.log(`2x${MAX_W} is ${answer}`);

answer = timeLogger.wrap('', _ => solve(3, MAX_W, true));
console.log(`3x${MAX_W} is ${answer}`);
// const answer = solve(MAX_B, MAX_W, true);
