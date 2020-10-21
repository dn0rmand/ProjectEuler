const assert = require('assert');
const Matrix = require('tools/matrix-small');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

require('tools/numberHelper');

const MODULO = 1000000123;
const MAX    = 16; // 39

class KeyMapping
{
    static keys = {};
    static nextKey = 0;

    static get(key) {
        if (KeyMapping.keys[key] === undefined) {
            KeyMapping.keys[key] = KeyMapping.nextKey++;
        }
        return KeyMapping.keys[key];
    }

    static reset()
    {
        KeyMapping.keys = {};
        KeyMapping.nextKey = 0;
    }
}

class State
{
    static oddDigits = [1, 3, 5, 7, 9];
    static evenDigits= [0, 2, 4, 6, 8];
    static reverseEvenDigits = [8, 6, 4, 2, 0];
    static reverseOddDigits  = [9, 7, 5, 3, 1];

    static simberStates = []; // 0, 10, 1010, 101010, 10101010, 1010101010];

    static keys = new Map();

    constructor(previous)
    {
        this.digits = previous ? previous.digits.slice() : new Uint8Array(10);
        this.count  = previous ? previous.count : 1;
        this.$key    = undefined;
    }

    get key()
    {
        if (this.$key === undefined) {
            const s = this.digits.reduce((a, v) => a*10 + v);
            this.$key = KeyMapping.get(s);
        }
        return this.$key;
    }

    isSimber()
    {
        if (State.simberStates.includes(this.key))
            return true;

        for(let d = 0; d < 10; d += 2) {
            if (this.digits[d] !== 0)
                return false;
        }
        for(let d = 1; d < 10; d += 2) {
            if (this.digits[d] === 2)
                return false;
        }
        State.simberStates.push(this.key);
        State.simberStates.sort((a, b) => a-b);
        return true;
    }

    compact()
    {
        for(let d1 of State.evenDigits) {
            if (this.digits[d1] === 0) {
                for(let d2 of State.reverseEvenDigits) {
                    if (d2 <= d1) {
                        break;
                    }
                    if (this.digits[d2] !== 0) {
                        this.digits[d1] = this.digits[d2];
                        this.digits[d2] = 0;
                        break;
                    }
                }
                if (this.digits[d1] === 0) // didn't have anything to do
                    break;
            }
        }

        for(let d1 of State.oddDigits) {
            if (this.digits[d1] === 0) {
                for(let d2 of State.reverseOddDigits) {
                    if (d2 <= d1) {
                        break;
                    }
                    if (this.digits[d2] !== 0) {
                        this.digits[d1] = this.digits[d2];
                        this.digits[d2] = 0;
                        break;
                    }
                }
                if (this.digits[d1] === 0) // didn't have anything to do
                    break;
            }
            if (this.digits[d1] === 1) {
                // try to put the 2s before the 1s
                for(let d2 of State.reverseOddDigits) {
                    if (d2 <= d1) {
                        break;
                    }
                    if (this.digits[d2] === 2) {
                        this.digits[d1] = 2;
                        this.digits[d2] = 1;
                        break;
                    }
                }
                // if (this.digits[d1] === 1) // didn't have anything to do
                //     break;
            }
        }
    }

    addDigit(d)
    {
        const newState = new State(this);

        let count = newState.digits[d] + 1;
        if (d & 1) {
            if (count === 3) // same as having only 1
                count = 1;
        }
        else {
            if (count === 2) // same as having 0
                count = 0;
        }

        newState.digits[d] = count;
        newState.compact();
        return newState;
    }
}

class StateMapping
{
    constructor()
    {
        this.map = new Map();
    }

    add(parent, child)
    {
        let m = this.get(parent.key);
        m.set(child.key, (m.get(child.key) || 0) + 1);
    }

    get(key)
    {
        let m = this.map.get(key);
        if (m === undefined)
        {
            m = new Map();
            this.map.set(key, m);
        }
        return m;
    }
}

function buildMatrix()
{
    let states    = new Map();
    let newStates = new Map();

    const startState = new State();
    const special    = new State();

    special.$key     = KeyMapping.get(-1);
    startState.$key  = KeyMapping.get(0);
    special.count = 0;

    let uniqueStates = [];

    uniqueStates[special.key] = special;
    uniqueStates[startState.key] = startState;

    states.set(startState.key, startState);

    let found = 1;

    for(let l = 0; found; l++)
    {
        found = 0;
        newStates.clear();

        for(const state of states.values())
        {
            for(let digit = l === 0 ? 1 : 0; digit < 10; digit++)
            {
                const newState = state.addDigit(digit);

                if (! uniqueStates[newState.key]) {
                    found++;
                    uniqueStates[newState.key] = newState;
                }

                if (! newStates.get(newState.key))
                    newStates.set(newState.key, newState);
            }
        }

        [states, newStates] = [newStates, states];
        // if (l === 0) {
        //     const keys = uniqueStates.reduce((a, v) => {
        //         if (v)
        //             a.push(v.key);
        //         return a;
        //     }, []);
        //     console.log(keys.join(', '));
        // }
    }

    const stateMap = new StateMapping();

    stateMap.add(special, special);

    for(let state of uniqueStates)
    {
        if (state === special)
            continue;

        for(let digit = 0; digit < 10; digit++)
        {
            const newState = state.addDigit(digit);

            stateMap.add(state, newState);
            if (newState.isSimber())
                stateMap.add(state, special);
        }
    }

    const size   = uniqueStates.length;
    const matrix = new Matrix(size, size);

    for(let y = 0; y < uniqueStates.length; y++)
    {
        assert.strictEqual(y, uniqueStates[y].key);

        for(const [x, count] of stateMap.get(y))
        {
            matrix.set(y, x, count);
        }
    }
    return matrix;
}

function Q1(n, _matrix, callback)
{
    let states = new Map();
    let newStates = new Map();

    const startState = new State();
    const special    = new State();

    special.$key  = -1;
    special.count = 0;

    states.set(startState.key, startState);

    let total  = 0;

    const tracer = new Tracer(1, callback !== undefined);

    for(let l = 0; l < n; l++)
    {
        tracer.print(_ => `${n - l} - ${states.size}`);

        newStates.clear();
        newStates.set(-1, special);

        const map = new StateMapping(special);

        for(const state of states.values())
        {
            if (state === special)
                continue;

            for(let digit = 0; digit < 10; digit++)
            {
                const newState = state.addDigit(digit);

                map.add(state, newState);

                if (newState.isSimber())
                {
                    map.add(state, special);
                    special.count = (special.count + newState.count) %  MODULO ;
                }

                const old = newStates.get(newState.key);
                if (old)
                    old.count = (old.count + newState.count) % MODULO;
                else
                    newStates.set(newState.key, newState);
            }
        }

        [states, newStates] = [newStates, states];

        if (callback)
            callback(l+1, total);
    }

    tracer.clear();

    return special.count;
}

function Q2(n, matrix)
{
    const m = matrix.pow(n, MODULO);
    const result = m.get(1, 0);

    return result;
}

function Q(n, matrix, callback)
{
    let states = [0, 1]; // 0 = special, 1 = start with count of 1

    const tracer = new Tracer(1, callback !== undefined);

    const size = matrix.rows;

    for(let l = 0; l < n; l++)
    {
        tracer.print(_ => n - l);

        const newStates = [];

        for(let state = 0; state < states.length; state++)
        {
            let count = states[state];
            if (! count)
                continue;

            for(let newState = 0; newState < size; newState++)
            {
                const ratio = matrix.get(state, newState);
                if (ratio) {
                    newStates[newState] = ((newStates[newState] || 0) + ratio.modMul(count, MODULO)) % MODULO;
                }
            }
        }

        states = newStates;

        if (callback)
            callback(l+1, states[0]);
    }

    tracer.clear();

    return states[0];
}

function solve(max)
{
    const lengths = [];
    for(let u = 1; u <= max; u++)
        lengths.push(2**u);

    let total = 0;

    Q(lengths[lengths.length-1], (l, value) => {
        if (l === lengths[0]) {
            total = (total + value) % MODULO;
            lengths.shift();
        }
    })

    return total;
}

const matrix = buildMatrix();

// timeLogger.wrap('', _ => {
//     console.log(Q(2**10, matrix));
// });
// timeLogger.wrap('', _ => {
//     console.log(Q2(2**10, matrix));
// });

assert.strictEqual(Q(7, matrix), 287975);
assert.strictEqual(timeLogger.wrap('', _ => Q(100, matrix)), 123864868);

console.log('Teats passed');

const answer = timeLogger.wrap('', _ => solve(MAX));

console.log(`Answer is ${answer} - 888128264`);