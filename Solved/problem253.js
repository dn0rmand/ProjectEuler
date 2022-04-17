const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
require('@dn0rmand/project-euler-tools/src/bigintHelper');

const MASKS = [0];
const MIDPOINT = 21; // 1..20 & 21..40

for(let i = 1, m = 1; i <= 40; i++, m *= 2)
{
    if (i === MIDPOINT)
        m = 1; // reset

    MASKS[i] = m;
}

MASKS[41] = 0;

const statePool = [];

class State
{
    constructor()
    {
        this.init();
    }

    init()
    {
        this.segments = 0;
        this.pieces1  = 0;
        this.pieces2  = 0;
        this.max      = 0;
        this.used     = 0;
        this.count    = 1n;
    }

    release()
    {
        statePool.push(this);
    }

    static create()
    {
        if (statePool.length > 0)
            return statePool.pop();
        else
            return new State();
    }

    forEach(maxPiece, callback)
    {
        let m = MASKS[1];

        for (let piece = 1; piece <= maxPiece && piece < MIDPOINT; piece++, m *= 2)
        {
            if ((this.pieces1 & m) === 0)
                if (callback(piece) === true)
                    return;
        }

        m = MASKS[MIDPOINT];
        for (let piece = MIDPOINT; piece <= maxPiece; piece++, m *= 2)
        {
            if ((this.pieces2 & m) === 0)
                if (callback(piece) === true)
                    return;
        }
    }

    addPiece(piece, inPlace)
    {
        if (inPlace === true)
        {
            this.$addPiece(piece);
            return this;
        }

        let state       = State.create();

        state.pieces1  = this.pieces1;
        state.pieces2  = this.pieces2;
        state.segments = this.segments;
        state.max      = this.max;
        state.count    = this.count;
        state.used     = this.used+1;

        state.$addPiece(piece);

        return state;
    }

    maxSpace(maxPiece)
    {
        let v = this.pieces1;
        let m = MASKS[1];
        let c = 1;
        let piece;
        for (piece = 1; piece <= maxPiece; piece++, m*=2)
        {
            if (piece === MIDPOINT)
            {
                v = this.pieces2;
                m = MASKS[MIDPOINT];
            }

            if ((v & m) === 0)
            {
                if (++c > 2)
                    break;
            }
            else
                c = 0;
        }

        if (c === 2 && piece > 10)
            c = 3;

        return c;
    }

    $addPiece(piece)
    {
        let v1, v3;

        if (piece >= MIDPOINT)
        {
            this.pieces2 += MASKS[piece];

            v3 = this.pieces2;
            if (piece === MIDPOINT)
                v1 = this.pieces1;
            else
                v1 = this.pieces2;
        }
        else
        {
            this.pieces1 += MASKS[piece];

            v1 = this.pieces1;
            if (piece === MIDPOINT-1)
                v3 = this.pieces2
            else
                v3 = this.pieces1;
        }

        if ((v1 & MASKS[piece-1]) != 0)
        {
            if ((v3 & MASKS[piece+1]) != 0)
            {
                // both side used so merging to segments
                this.segments--;
            }
        }
        else if ((v3 & MASKS[piece+1]) === 0)
        {
            // Neither side are used so it's a new segment
            if (++this.segments > this.max)
                this.max = this.segments;
        }
    }

    getKey(size)
    {
        let spaces = []
        let v = this.pieces1;
        let m = MASKS[1];
        let c = 0;

        for (let piece = 1; piece <= size; piece++, m*=2)
        {
            if (piece === MIDPOINT)
            {
                v = this.pieces2;
                m = MASKS[MIDPOINT];
            }

            if ((v & m) === 0)
                c++;
            else
            {
                if (c !== 0)
                    spaces.push(c);
                else if (piece === 1)
                    spaces.push(0);
                c = 0;
            }
        }
        let end = c;
        let start = spaces.shift();
        spaces.sort((a, b) => a-b);
        if (start > end)
            [start, end] = [end, start];

        let k = BigInt(this.max) * 100n + BigInt(start);
        k = spaces.reduce((a, v) => a*100n+BigInt(v), k);
        k = (k*100n) + BigInt(end);
        return k;
    }
}

function factorial(n)
{
    n = BigInt(n);
    let total = n;
    while (--n > 1n)
        total *= n;
    return total;
}

function solve(size, trace)
{
    if (trace)
        console.log(`Running for size ${size}`);

    const sizeCounts   = Array(size+1);
    const maxSegments  = Math.floor(size/2);

    sizeCounts.fill(0n);

    function calculateResult()
    {
        const total = sizeCounts.reduce((a, v, max) => a + v*BigInt(max), 0n);
        const result = total.divise(factorial(size), 7);
        return result.toFixed(6);
    }

    let states = [new State()];

    let length = 1;
    let map1   = new Map();
    let map2   = new Map();

    for(let i = 1; i <= size; i++)
    {
        if (trace)
            process.stdout.write(`\r${i} - ${length.toLocaleString()}       `);

        // Swap maps
        {
            const tmp = map1;
            map1 = map2;
            map2 = tmp;
        }

        const newStates = map1;
        map1.clear();

        for (let state of states)
        {
            if (state.max >= maxSegments || state.maxSpace(size) < 3) // reached the max possible
            {
                const zeros = size - state.used;
                const pos = factorial(zeros) * state.count;
                sizeCounts[state.max] += pos;
            }
            else
            {
                state.forEach(size, (piece) =>
                {
                    const ns = state.addPiece(piece);
                    const k  = ns.getKey(size);

                    const oldState = newStates.get(k);
                    if (oldState === undefined)
                    {
                        newStates.set(k, ns);
                    }
                    else
                    {
                        oldState.count += ns.count;
                        ns.release();
                    }
                });
            }
            state.release();
        }

        states = newStates.values()
        length = newStates.size;
    }

    for (let state of states)
    {
        sizeCounts[state.max] += state.count;
    }

    if (trace)
        process.stdout.write(`\r                                    \r`);

    return calculateResult();
}

timeLogger.wrap('Tests', () => {
    assert.equal(solve(10), "3.400732");
    assert.equal(solve(20), "6.156946");
});

let answer = timeLogger.wrap('', () => { return solve(40, true); });

console.log(`Answer is ${answer}`);
