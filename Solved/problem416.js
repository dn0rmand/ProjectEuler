const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
// const Matrix = require('tools/matrix-small');

const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = { };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/../build/release.wasm"), imports);
const Matrix = wasmModule.exports.Matrix;

require('tools/numberHelper');

const MODULO = 1E9;

class State
{
    constructor(value)
    {
        if (typeof value === "number")
            this.init(value);
        else
            this.clone(value)
    }

    init(m)
    {
        this.data    = [2*m, 0, 0];
        this.missed  = false;
        this.count   = 1;
    }

    clone(o)
    {
        this.data   = o.data.slice();
        this.missed = o.missed;
        this.count  = o.count;
    }

    get key()
    {
        let k = this.data.reduce((a, v) => a * 20 + v, 0);

        return this.missed ? -k : k;
    }
}

const $factorial = [];

function factorial(n)
{
    if ($factorial[n] !== undefined)
        return $factorial[n];

    let total = 1;
    for(let i = 2; i<=n; i++)
        total *= i;

    $factorial[n] = total;
    return total;
}

const $nCp = [];

function nCp(n, p)
{
    const key = (n*20 + p);
    if ($nCp[key] !== undefined)
        return $nCp[key];

    const top    = factorial(n);
    const bottom = factorial(p) * factorial(n-p);

    const result = top / bottom;
    $nCp[key] = result;
    return result;
}

function buildMatrix(m)
{
    const matrix = [];

    function generateKey(data, missedOne)
    {
        const k = data.reduce((a, v) => a * 20 + v, 0);

        return missedOne ? -k : k;
    }

    const stateMap = new Map();
    const reverseMap = [];

    function recordState(key, data, missedOne)
    {
        const id = stateMap.size;
        stateMap.set(key, id);
        reverseMap[id] = {data, missedOne};
        return id;
    }

    function transitionTo(rowIndex, count, data, missedOne)
    {
        if (data[0] === 0 && missedOne)
            return;

        const key = generateKey(data, missedOne);
        
        let columnIdx = stateMap.get(key);
        if (columnIdx === undefined)
        {
            columnIdx = recordState(key, data, missedOne);
            processState(columnIdx, data, missedOne);
        }

        if (rowIndex >= 0)
        {
            if (matrix[rowIndex] === undefined)
                matrix[rowIndex] = [];
            
            matrix[rowIndex][columnIdx] = count;
        }
    }

    function processState(rowIndex, data, missedOne)
    {
        const count = data[0];

        if (count === 0)
        {
            if (! missedOne)
            {
                transitionTo(rowIndex, 1, [data[1], data[2], 0], true);
            }
            return;
        }

        for(let one = count; one >= 0; one--)
        {
            for(let two = count-one; two >= 0; two--)
            {
                const three   = count-one-two;                
                const newData = [data[1]+one, data[2]+two, three];

                if (newData[0] === 0 && (missedOne || newData[1] === 0))
                    continue;

                let times = 1;

                if (one*two !== 0 || one*three !== 0 || two*three !== 0)
                {
                    if (one === 0 || two === 0 || three === 0)
                    {
                        times = one ? nCp(count, one) : nCp(count, two);
                    }
                    else
                    {
                        times = nCp(count, one) * nCp(count-one, two);
                    }
                }
                transitionTo(rowIndex, times, newData, missedOne);
            }
        }
    }

    transitionTo(-1, 1, [2*m, 0, 0], false);

    const l = matrix.length;
    const $matrix = new Matrix(l, l);

    for(let y = 0; y < l; y++)
    {
        let row = matrix[y];
        if (row === undefined)
            continue;

        for(let x = 0; x < l; x++) 
        {
            if (row[x])
                $matrix.set(y, x, row[x]);
        }
    }

    const p = stateMap.get(generateKey([2*m, 0, 0], true));
    assert.ok(p !== undefined);

    return { matrix: $matrix, position: [ 0, p ] };
}

function F1(m, n)
{
    let states = new Map();
    let newStates = new Map();
 
    states.set(0n, new State(m));

    const add = s => {
        const k = s.key;
        const o = newStates.get(k);
        if (o)
            o.count = (o.count + s.count) % MODULO;
        else
            newStates.set(k, s);
    };

    const dump = _ => {
        const st = [...newStates.values()].sort((a, b) => {
            let v = (b.missed ? 0 : 1) - (a.missed ? 0: 1);
            if (v === 0)
                v = b.data[0]-a.data[0];
            if (v === 0)
                v = b.data[1]-a.data[1];
            if (v === 0)
                v = b.data[2]-a.data[2];

            return v;
        });

        for(const s of st)
        {
            const o = states.get(s.key);
            const offset = (s.count - (o ? o.count : 0) + MODULO) % MODULO;

            console.log(s.data.join(','), s.missed, s.count, offset);
        }
        console.log('');
    };

    for(let jump = 1; jump < n; jump++)
    {
        newStates.clear();

        for(const state of states.values())
        {
            const count = state.data[0];
            
            if (count === 0)
            {
                if (! state.missed)
                {
                    const newState = new State(state);
                    newState.missed = true;
                    newState.data = [state.data[1], state.data[2], 0];
                    add(newState);
                    continue;
                }
                else
                {
                    continue;
                }
            }

            for(let one = count; one >= 0; one--)
            {
                for(let two = count-one; two >= 0; two--)
                {
                    const three    = count-one-two;
                    const newState = new State(state);
                    
                    newState.data = [state.data[1]+one, state.data[2]+two, three];

                    if (newState.data[0] === 0 && (newState.missed || newState.data[1] === 0))
                        continue;

                    if (one*two !== 0 || one*three !== 0 || two*three !== 0)
                    {
                        if (one === 0 || two === 0 || three === 0)
                        {
                            const v = one ? nCp(count, one) : nCp(count, two);
                            newState.count = newState.count.modMul(v, MODULO);
                        }
                        else
                        {
                            const v = nCp(count, one).modMul(nCp(count-one, two), MODULO);
                            newState.count = newState.count.modMul(v, MODULO);
                        }
                    }

                    add(newState);
                }
            }
        }

        // dump();

        [states, newStates] = [newStates, states];
    }  

    let total = 0;
    for(const s of states.values())
    {
        if (s.data[0] === 2*m)
            total = (total + s.count) % MODULO;
    }

    return total;
}

function F(m, n, trace)
{
    const matrixInfo = buildMatrix(m);

    const size = BigInt(n-1);
    const pLow = Number(size & (2n**32n - 1n));
    const pHi  = Number(size >> 32n);

    matrixInfo.matrix.bigPow(pLow, pHi, MODULO, trace);
    
    const matrix = matrixInfo.matrix;
    const answer = (matrix.get(0, matrixInfo.position[0]) + matrix.get(0, matrixInfo.position[1])) % MODULO;    

    return answer;
}

assert.equal(F(1, 3), 4);
assert.equal(F(1, 4), 15);
assert.equal(F(1, 5), 46);
assert.equal(F(2, 3), 16);
assert.equal(F(2, 100), 429619151);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => F(10, 1E12, true));
console.log(`Answer is ${answer}`);