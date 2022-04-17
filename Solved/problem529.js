const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = { };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "../build/release.wasm"), imports);
const Matrix = wasmModule.exports.Matrix;

// const { Matrix } = require("./loadWasm");

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO  = 1000000007
const MAXSIZE = 10n**18n;
    
class State
{
    static makeKey(sums)
    {
        const k = sums.reduce((a, v) => a*10 + v, 0);
        if (k > Number.MAX_SAFE_INTEGER)
            throw "BIGINT needed";
        return k;
    }

    constructor(sums)
    {
        this.sums  = sums;
        this.key   = State.makeKey(sums);
    }

    addDigit(digit)
    {
        let sums = [];

        if (digit === 0)
            return new State(this.sums);

        let found = false;
        let zeroIndex = undefined;

        const getZeroIndex = () => {
            if (zeroIndex !== undefined)
                return zeroIndex;
            zeroIndex = this.sums.indexOf(0);
            return  zeroIndex;
        };

        for(let i = 0; i < this.sums.length; i++)
        {
            if (this.sums[i] === 0)
            {
                if (!found)
                    sums.push(0);
                continue;
            }

            const v = this.sums[i]+digit;
            if (v > 10)
            {
                if (getZeroIndex() < i+1)
                    return;   

                sums = [];
            }
            else if (v === 10)
            {
                sums = [];
                found = true;
            }
            else 
            {
                sums.push(v);
            }
        }

        sums.push(digit);

        if (found)
        {
            if (sums.includes(0))
                throw "ERROR";
            sums.push(0);
        }
        return new State(sums);
    }
}

function buildMatrix()
{
    const size   = $transitions.length;
    const matrix = new Matrix(size, size);

    for(let key1 = 0; key1 < size; key1++)
    {
        for(const key2 of $transitions[key1])
        {
            const v = matrix.get(key1, key2) + 1;
            matrix.set(key1, key2, v);
        }
    }

    return matrix;
}

function buildTransitions()
{
    const $transitions = new Map();

    function addTransition(fromState, toState)
    {
        let fromKey = fromState.key;
        let toKey   = toState.key;

        let toMap = $transitions.get(fromKey);

        if (toMap === undefined)
        {
            toMap = new Set();
            $transitions.set(fromKey, toMap);
        }
        if (!toMap.has(toKey))
        {
            toMap.add(toKey);
        }
    }

    function processStates(size)
    {
        let states    = new Map();
        let newStates = new Map();

        states.set(0, new State([]));

        for(let i = 0; i < size; i++)
        {
            newStates.clear();

            for(const state of states.values())
            {
                for(let digit = 0; digit < 10; digit++)
                {
                    let newState = state.addDigit(digit, 10);
                    if (! newState)
                        break;

                    addTransition(state, newState);

                    newStates.set(newState.key , newState);
                }
            }
            [states, newStates] = [newStates, states];
        }
    }

    for(let s = 2; s < 20; s++)
    {
        processStates(s, true);
    }

    // convert keys as 0,1,2...

    const keyMap      = new Map();
    const transitions = [];
    transitions.validKeys = [];

    let nextKey = 0;

    const addKey = k => 
    {
        let k2 = keyMap.get(k);
        if (k2 === undefined)
        {
            k2 = nextKey++;
            keyMap.set(k, k2);
            transitions[k2] = [];
            if ((k % 10 === 0) && k !== 0)
                transitions.validKeys[k2] = 1;
        }
        return k2;
    };

    const special = k => {
        const k2 = keyMap.get(k);
        assert.notEqual(k2, undefined);
        const v = transitions[k2];

        v.push(k2);
        v.sort((a, b) => a-b);
    };

    for(let [key1, keys] of $transitions)
    {
        const k1 = addKey(key1);
        const ks = transitions[k1];

        for(const key2 of keys)
        {
            const k2 = addKey(key2);

            ks.push(k2);
        }
    }

    special(50);
    special(86420);
    special(9876543210);

    return transitions;
}

const $transitions    = buildTransitions();
const $matrix         = buildMatrix();

const $statesPerSize  = [];

function getStates(size)
{
    if ($statesPerSize[size] !== undefined)
        return $statesPerSize[size];

    if (size < 1)
    {
        return {
            counts: [1],
            keys:   [0]
        };
    }

    let states = getStates(size-1, false);

    newStates = {
        counts: [],
        keys:   []
    };

    for(let state of states.keys)
    {
        let newKeys = $transitions[state];
        let currentCount = states.counts[state];

        for(let newState of newKeys)
        {
            let count = newStates.counts[newState];
            if (count === undefined)
            {
                newStates.keys.push(newState);
                newStates.counts[newState] = currentCount;
            }
            else
            {
                newStates.counts[newState] = (count + currentCount) % MODULO;
            }
        }
    }

    $statesPerSize[size] = newStates;
    return newStates;
}

function T(size)
{
    let total  = 0;

    const states = getStates(size);
    for(let state of states.keys)
    {
        if ($transitions.validKeys[state])
        {
            const currentCount = states.counts[state];
            total = (total + currentCount) % MODULO;
        }
    }

    return total;
}

function solve(size)
{
    size = BigInt(size);

    const pLow = Number(size & (2n**32n - 1n));
    const pHi  = Number(size >> 32n);

    const m = timeLogger.wrap('Powering Matrix', _ => {
        $matrix.bigPow(pLow, pHi, MODULO, true);
        return $matrix;
    });

    let total = 0;

    for(let x = 0; x < $matrix.columns; x++)
    {
        if ($transitions.validKeys[x])
        {
            total = (total + m.get(0, x)) % MODULO;
        }
    }

    return total;
}

assert.equal(T(2), 9);
assert.equal(T(5), 3492);
assert.equal(solve(5), 3492); // slow so don't do it

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(MAXSIZE, true));
console.log(`Answer is ${answer}`);

console.log('Should be 23624465');