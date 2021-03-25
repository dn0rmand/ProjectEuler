const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');

const patterns = [
    [[1],
     [1],
     [1]],

    [[1, 1, 1]],

    [[1, 1],
     [1, 0]],

    [[1, 1],
     [0, 1]],

    [[1, 0],
     [1, 1]],

    [[0, 1],
     [1, 1]],
];

class State 
{
    constructor(rows, count) 
    {        
        this.rows = rows;
        this.count = count || 1n;
        this.$key = undefined;
        this.$complete = undefined;
    }

    calculateKey() 
    {
        let complete = true;

        this.$key = this.rows.reduce((a, r) => 
        {
            return r.reduce((a, v) => 
            {
                a <<= 1n;
                if (v)
                    a++;
                else
                    complete = false;
                return a;
            }, a)
        }, 0n);

        this.$complete = complete;
    }

    get complete() 
    { 
        if (this.$complete === undefined) 
        {
            this.calculateKey();
        }

        return this.$complete;
    }

    get key() 
    {
        if (this.$key === undefined) 
        {
            this.calculateKey();
        }

        return this.$key;
    }

    static empty(width, height) 
    {
        const rows = [];
        for(let i = 0; i < height; i++) 
        {
            const r = new Uint8Array(width);
            r.fill(0);
            rows.push(r);
        }
        
        return new State(rows, 1n);
    }

    canFit(pattern, x, y)
    {
        const w = this.rows[0].length;
        const h = this.rows.length;

        const ww = pattern[0].length;
        const hh = pattern.length;
        if (x+ww > w || y+hh > h) 
            return false;

        for(let xx = 0; xx < ww; xx++) {
            for (let yy = 0; yy < hh; yy++) {
                if (pattern[yy][xx] !== 0) {
                    if (this.rows[y+yy][x+xx] !== 0) {
                        return false;
                    }   
                }
            }
        }

        return true;
    }

    doFit(p, x, y) 
    {        
        const w = this.rows[0].length;
        const h = this.rows.length;

        const pattern = patterns[p];
        const ww = pattern[0].length;
        const hh = pattern.length;
        if (x+ww > w || y+hh > h) 
            return;

        const rows = this.rows.map(r => Uint8Array.from(r));

        for(let xx = 0; xx < ww; xx++) {
            for (let yy = 0; yy < hh; yy++) {
                if (pattern[yy][xx] !== 0) {
                    rows[y+yy][x+xx] = pattern[yy][xx];
                }
            }
        }

        return new State(rows, this.count);
    }

    *nextStates()
    {
        const w = this.rows[0].length;
        const h = this.rows.length;

        // find first empty spot

        let done = false;

        for (let y = 0; !done && y < h; y++) {
            for (let x = 0; !done && x < w; x++) {
                if (this.rows[y][x] === 0) {
                    for(let p = 0; p < patterns.length; p++) {
                        const pattern = patterns[p];
                        if (x > 0 && pattern[0][0] === 0) { // special one
                            if (this.canFit(pattern, x-1, y)) {
                                const s = this.doFit(p, x-1, y);
                                if (s)
                                    yield s;
                            }
                        }
                        else if (this.canFit(pattern, x, y)) {
                            const s = this.doFit(p, x, y);
                            if (s)
                                yield s;
                        }
                    }
                    done = true;
                }
            }
        }
    }
}

function solve(width, height, trace) 
{
    const start = State.empty(width, height);

    let states = new Map();
    let newStates = new Map();

    states.set(0, start);

    let total = 0n;

    const tracer = new Tracer(1, trace);
    while (states.size > 0) {
        tracer.print(_ => newStates.size);
        newStates.clear();

        for (const state of states.values()) {
            for(const newState of state.nextStates()) {
                if (newState.complete) {
                    total += newState.count;
                    continue;
                }

                const key = newState.key;
                const old = newStates.get(key);
                if (old) {
                    old.count += newState.count;
                } else {
                    newStates.set(key, newState);
                }
            }
        }

        [states, newStates] = [newStates, states];
    }

    tracer.clear();

    return total;
}

assert.strictEqual(solve(9, 2), 41n);
assert.strictEqual(solve(9, 4), 41813n);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(9, 12, true));
console.log(`Answer is ${answer}`);