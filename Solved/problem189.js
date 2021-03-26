const assert = require('assert');
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

        s.previousRow = this.previousRow;
        s.currentRow  = [...this.currentRow];
        s.count       = this.count;
        s.rows        = this.rows;
        return s;
    }

    get key() 
    {
        if (this.$key === undefined) 
        {
            const map = [];

            const convert = c => {
                const color = map.indexOf(c);

                if (color === -1) {
                    map.push(c);
                    return map.length-1;
                } else {
                    return color;
                }
            }

            let key = 0;

            for(let i = 0; i < this.previousRow.length; i += 2) {
                key = (key*3) + convert(this.previousRow[i]);
            }

            const l = this.currentRow.length;
            
            if (l > 0) {
                let i = 0;
                for(; i < l; i += 2) {
                    key = (key*3) + convert(this.currentRow[i]);
                }

                if (i === l) // add last color since it was "missed"
                    key = (key*3) + convert(this.currentRow[l-1]);
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

function solve(maxRows) 
{
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());

    let total = 0n;

    while(states.size > 0) 
    {
        newStates.clear();
        for(const state of states.values()) 
        {
            for(let color = MIN_COLOR; color <= MAX_COLOR; color++) 
            {
                const newState = state.addColor(color);
                if (! newState) 
                    continue;

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

    return total;
}

assert.strictEqual(solve(3), 528n);
assert.strictEqual(solve(6), 2450774016n);

console.log('Tests passed');

let answer = timeLogger.wrap('', _ => solve(8));
console.log(`Answer is ${answer}`);