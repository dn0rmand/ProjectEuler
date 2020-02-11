const assert = require('assert');
const BigMap = require('tools/BigMap');
const timeLogger = require('tools/timeLogger');

class State
{
    constructor(size)
    {
        this.size = size;
        this.data = 0n;
        this.count= 1;
    }

    init(size)
    {
        this.size = size;
        this.data = 0n;
        return this;
    }

    clone()
    {
        let newState = new State(this.size);

        newState.data   = this.data;

        return newState;
    }

    get(x, y)
    {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size)
            return 0;
        const bits = BigInt(y*this.size + x);
        const mask = 2n ** bits;
        return (this.data & mask) != 0 ? 1 : 0;
    }

    set(x, y, value)
    {        
        if (x < 0 || x >= this.size || y < 0 || y >= this.size)
            return;

        const bits = BigInt(y*this.size + x);
        const mask = 2n ** bits;
        this.data |= mask;
        if (value === 0)
            this.data -= mask;
    }

    get uniqueKey()
    {
        return this.data;
    }

    *getAlternateKeys(k1)
    {
        let k2 = 0n, k3 = 0n, k4 = 0n;

        for(let y = 0; y < this.size; y++)
        for(let x = 0; x < this.size; x++)
        {
            k2 = (k2 * 2n) + BigInt(this.get(x, y));
            k3 = (k3 * 2n) + BigInt(this.get(x, this.size-1-y));
            k4 = (k4 * 2n) + BigInt(this.get(this.size-1-x, this.size-1-y));
        }

        if (k2 != k1)
            yield k2;
        if (k3 != k1 && k3 != k2)
            yield k3;
        if (k4 != k1 && k4 != k2 && k4 != k3)
            yield k4;
    }

    getMaxArea()
    {
        let max = 0;

        let calculate = (x, y) =>
        {
            if (! this.get(x, y))
                return 0;

            this.set(x, y, 0);
            return 1 + calculate(x-1, y) + calculate(x+1, y) + calculate(x, y-1) + calculate(x, y+1);
        };

        const old = this.data;
        for(let y = 0; y < this.size; y++)
        for(let x = 0; x < this.size; x++)
        {
            max = Math.max(max, calculate(x, y));
        }
        this.data = old;
        return max;
    }

    dump()
    {
        for(let y = 0; y < this.size; y++)
        {
            let v = [];
            for (let x = 0; x < this.size; x++)
                v.push(this.get(x, y) ? '◼︎' : '◻︎');
            console.log(v.join(''));
        }
        console.log('');
    }

    compare(s2)
    {
        for(let y = 0; y < this.size; y++)
        {
            let v1 = [];
            let v2 = [];
            for (let x = 0; x < this.size; x++)
            {
                v1.push(this.get(x, y) ? '◼︎' : '◻︎');
                v2.push(s2.get(x, y) ? '◼︎' : '◻︎');
            }
            console.log(`${v1.join('')} - ${v2.join('')}`);
        }
        console.log(`${this.count} + ${s2.count} => ${ this.count + s2.count }`);
    }
}

class StateCollection
{
    constructor()
    {
        this.map = new BigMap();
    }

    push(value)
    {
        const uniqueKey = value.uniqueKey;
        if (this.map.has(uniqueKey))
            return;

        // for(let key of value.getAlternateKeys(uniqueKey))
        // {
        //     let s = this.map.get(key);
        //     if (s !== undefined)
        //     {
        //         s.compare(value);

        //         s.count += value.count;
        //         return;
        //     }
        // }

        this.map.set(uniqueKey, value);        
    }

    get length() { return this.map.size };

    *values()
    {
        yield *this.map.values();
    }
}


function solve(size, trace)
{
    let states = new StateCollection();
    states.push(new State().init(size));

    const areas = [];

    for(let i = 0; i < size*size; i++)
    {
        if (trace)
            process.stdout.write(`\r${i}: ${states.length}  `);

        const newStates = new StateCollection();

        for(const state of states.values())
        {
            for(let y = 0; y < size; y++)
            for(let x = 0; x < size; x++)
            {
                if (state.get(x, y) === 0)
                {
                    const state2 = state.clone();
                    state2.set(x, y, 1);
                    newStates.push(state2);
                }
            }   

            const m = state.getMaxArea();
            areas[m] = (areas[m] || 0) + state.count;
        }

        states = newStates;
    }

    for (let state of states.values())
    {
        const m = state.getMaxArea();
        areas[m] = (areas[m] || 0) + state.count;
    }

    if (trace)
        process.stdout.write('\r                 \r');

    let total = 0; 

    const count = areas.reduce((a, c, i) => {
        total += (c * i);
        return a+c;
    }, 0);

    const answer = (total / count).toFixed(8);    
    return +answer;
}

assert.equal(solve(2), 1.875);
assert.equal(solve(3), 3.64453125);
assert.equal(solve(4), 5.76487732);

console.log("Tests passed");

const answer = timeLogger.wrap('', () => solve(5, true)); // 8.14696828
console.log(`Answer is ${answer}`);
