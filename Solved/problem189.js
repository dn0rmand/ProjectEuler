const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MIN_COLOR = 1

const RED   = MIN_COLOR;
const BLUE  = RED+1;
const GREEN = BLUE+1;

const MAX_COLOR = GREEN

class State 
{
    constructor() 
    {
        this.previousRow = [];
        this.currentRow  = [];
        this.count       = 1n;
        this.rows        = 0;
        this.$key        = undefined;
    }

    clone() 
    {
        const s = new State();

        s.previousRow = [...this.previousRow];
        s.currentRow  = [...this.currentRow];
        s.count       = this.count;
        s.rows        = this.rows;
        return s;
    }

    get key() 
    {
        if (this.$key === undefined) 
        {
            let colors = [];
            for(let i = 0; i < this.previousRow.length; i += 2) {
                colors.push(this.previousRow[i]);
            }
            colors.push(...this.currentRow);
            // let colors = [...this.previousRow, ...this.currentRow];
            // make colors more generic
            let map = [];
            for(let i = 0; i < colors.length; i++) {
                const c = colors[i];
                let color = map.indexOf(c);

                if (color === -1) {
                    map.push(c);
                    color = map.length-1;
                }
                colors[i] = color;
            }

            let key = 0;
            for(const c of colors) {
                key = (key * 3) + (c-1);
            }
            this.$key = key;
        }
        return this.$key;
    }

    addColor(color) 
    {
        const index = this.currentRow.length;
        const previousColor = index > 0 ? this.currentRow[index-1] : 10;

        if (color === previousColor) {
            return undefined;
        }
        if ((index & 1) === 1 && this.previousRow.length > (index-1)) {
            if (this.previousRow[index-1] === color) {
                return undefined;
            }
        }
        const newState = this.clone();
        newState.currentRow.push(color);
        const expectedLength = 2*this.rows+ 1;
        if (newState.currentRow.length >= expectedLength) {
            newState.previousRow = newState.currentRow;
            newState.currentRow  = [];
            newState.rows++;
        }
        return newState;
    }
}

function solve(maxRows, trace) 
{
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());

    let total = 0n;
    let rows  = 0;

    const tracer = new Tracer(10000, trace);
    while(states.size > 0) 
    {
        let count = states.size;
        newStates.clear();
        for(const state of states.values()) 
        {
            tracer.print(_ => `${maxRows - rows} - ${count} - ${newStates.size}`);
            count--;
            for(let color = MIN_COLOR; color <= MAX_COLOR; color++) 
            {
                const newState = state.addColor(color);
                if (! newState) 
                    continue;

                if (newState.rows > rows) {
                    rows = newState.rows;
                }

                if (newState.rows >= maxRows) 
                {
                    total += newState.count;
                } 
                else 
                {
                    const key = newState.key;
                    const old = newStates.get(key);
                    if (old)
                        old.count += newState.count;
                    else
                        newStates.set(key, newState);
                }
            }
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();

    return total;
}

assert.strictEqual(solve(3), 528n);
assert.strictEqual(solve(6), 2450774016n);

console.log('Tests passed');

let answer = timeLogger.wrap('', _ => solve(8, true));
console.log(`Answer is ${answer}`);