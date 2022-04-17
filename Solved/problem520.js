const assert = require('assert');
const Matrix = require('@dn0rmand/project-euler-tools/src/matrix-small');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1000000123;
const MAX    = 39

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

    constructor(previous)
    {
        this.digits  = previous ? previous.digits.slice() : new Uint8Array(10);
        this.count   = previous ? previous.count : 1;
        this.hasDigit= previous ? previous.hasDigit : 0;
        this.$key    = undefined;
    }

    get key()
    {
        if (this.$key === undefined) {
            const s = this.digits.reduce((a, v) => a*10 + v, this.hasDigit ? 1 : 2);
            this.$key = KeyMapping.get(s);
        }
        return this.$key;
    }

    isSimber()
    {
        if (! this.hasDigit)
            return false;
            
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
        if (!this.hasDigit) 
            return; // nothing to compact

        for(const d1 of State.evenDigits) {
            if (this.digits[d1] === 0) {
                for(const d2 of State.reverseEvenDigits) {
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

        for(const d1 of State.oddDigits) {
            if (this.digits[d1] === 0) {
                for(const d2 of State.reverseOddDigits) {
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
                for(const d2 of State.reverseOddDigits) {
                    if (d2 <= d1) {
                        break;
                    }
                    if (this.digits[d2] === 2) {
                        this.digits[d1] = 2;
                        this.digits[d2] = 1;
                        break;
                    }
                }
            }
        }
    }

    addDigit(d)
    {
        const newState = new State(this);

        if (d === 0 && !newState.hasDigit)
            return newState;

        newState.hasDigit = true;

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
        const m = this.get(parent.key);
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

    clear()
    {
        this.map = new Map();
    }
}

function buildMatrix()
{
    let states    = new Map();
    let newStates = new Map();

    const startState = new State();
    const stateMap   = new StateMapping();

    const uniqueStates = [];

    uniqueStates[startState.key] = startState;

    states.set(startState.key, startState);
    let found = 1;

    while(found)
    {
        found = 0;
        newStates.clear();
        stateMap.clear();

        for(const state of states.values())
        {
            for(let digit = 0; digit < 10; digit++)
            {
                let newState = state.addDigit(digit);

                if (! uniqueStates[newState.key]) {
                    found++;
                    uniqueStates[newState.key] = newState;
                }
                else {
                    newState = uniqueStates[newState.key];
                }

                stateMap.add(state, newState);
                newStates.set(newState.key, newState);
            }
        }

        [states, newStates] = [newStates, states];
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

    matrix.simbers = [];
    
    uniqueStates.reduce((a, s) => {
        if (s.isSimber())
            matrix.simbers.push(s.key);
        }, 1);

    return matrix;
}

function bruteQ(n, trace)
{
    let states = new Map();
    let newStates = new Map();

    const startState = new State();

    states.set(startState.key, startState);

    const tracer = new Tracer(1, trace);

    for(let l = 0; l < n; l++)
    {
        tracer.print(_ => `${n - l} - ${states.size}`);

        newStates.clear();

        for(const state of states.values())
        {
            for(let digit = 0; digit < 10; digit++)
            {
                const newState = state.addDigit(digit);

                const old = newStates.get(newState.key);
                if (old)
                    old.count = (old.count + newState.count) % MODULO;
                else
                    newStates.set(newState.key, newState);
            }
        }

        [states, newStates] = [newStates, states];
    }

    tracer.clear();

    let total = 0;
    for(const state of states.values()) {
        if (state.isSimber()) {
            total = (total + state.count) % MODULO;
        }
    }

    return total;
}

const matrix = timeLogger.wrap('Building Matrix', _ => buildMatrix());

function calculateSimbers(m) 
{
    let result = 0;
    for(const k of matrix.simbers) {
        result = (result + m.get(0, k)) % MODULO;
    }
    return result;
}

function Q(n)
{
    const m = matrix.pow(n, MODULO);
    const result = calculateSimbers(m);
    return result;
}

function solve(max)
{
    let total = 0;
    let m = matrix;

    const tracer = new Tracer(1, true);
    for(let p = 0; p < max; p++) {
        tracer.print(_ => max-p);
        m = m.multiply(m, MODULO);
        total = (total + calculateSimbers(m)) % MODULO;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(Q(7), 287975);
assert.strictEqual(timeLogger.wrap('', _ => Q(100)), 123864868);

console.log('Teats passed');

const answer = timeLogger.wrap('', _ => solve(MAX));
console.log(`Answer is ${answer}`);