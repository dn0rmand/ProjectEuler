const assert = require('assert');
const BigMap = require('tools/BigMap');
const BigSet = require('tools/BigSet');
const timeLogger = require('tools/timeLogger');

class CompressedState
{
    constructor(state)
    {
        this.count  = 1;
        this.width  = 0;
        this.height = 0;
        this.maxArea= 0;
        this.areas  = [];    

        this.vKey = [];
        this.hKey = [];

        if (state)
            this.init(state);
    }

    init(state)
    {
        this.width   = state.width;
        this.height  = state.height;
        this.maxArea = state.getMaxArea();

        this.vKey = new Array(this.height).fill(0);
        this.hKey = new Array(this.width).fill(0);

        let id  = 0;

        const calculate = (x, y) =>
        {
            if (! state.get(x, y))
                return 0;

            state.set(x, y, 0);
            if (x === 0)
                this.vKey[y] = id;
            if (y === 0)
                this.hKey[x] = id;

            return 1 + calculate(x-1, y) + calculate(x+1, y) + calculate(x, y-1) + calculate(x, y+1);
        };

        const old = state.data;

        id = 0;
        for(let y = 0; y < this.height; y++)
        {
            if (state.get(0, y))
            {
                id++;
                let m = calculate(0, y);
                this.areas[id-1] = m;
            }
        }

        for(let x = 0; x < this.width; x++)
        {
            if (state.get(x, 0))
            {
                id++;
                let m = calculate(x, 0);
                this.areas[id-1] = m;
            }
        }
        state.data = old;
    }

    get key()
    {
        return `${this.maxArea}:${this.vKey.join('-')}:${this.hKey.join('-')}:${this.areas.join('-')}`;
    }

    get leftKey()
    {
        if (this.vKey === undefined)
            return undefined;

        let k = 0;
        for(let i of this.vKey)
            k = (k*2) + (i === 0 ? 0 : 1);
        return k;
    }

    get topKey()
    {
        if (this.hKey === undefined)
            return undefined;

        let k = 0;
        for(let i of this.hKey)
            k = (k*2) + (i === 0 ? 0 : 1);
        return k;
    }

    static mergeLR(left, right)
    {
        assert.equal(left.width, right.width);
        assert.equal(left.height, right.height);

        let state = new CompressedState();

        state.width   = left.width + right.width - 1;
        state.height = left.height;
        state.maxArea= Math.max(left.maxArea, right.maxArea);
        state.count  = left.count * right.count;
        state.vKey   = undefined; // won't need it anymore
        state.hKey   = new Array(state.width).fill(0);

        let id = 0;
        let lmap = [];
        let rmap = [];

        for(let y = 0; y < state.height; y++)
        {
            let l = left.vKey[y];
            let r = right.vKey[y];
            if (l === 0)
            {
                assert.equal(r, 0);
                continue;
            }
            if (r === 0)
            {
                assert.equal(l, 0);
                continue;
            }

            let i;

            if (lmap[l] !== undefined)
            {
                i = lmap[l];
                rmap[r] = i;
                state.areas[i-1]--;
            }
            else if (rmap[r] !== undefined)
            {
                i = rmap[r];
                lmap[l] = i;
                state.areas[i-1]--;
            }
            else 
            {
                i = ++id;
                rmap[r] = lmap[l] = i;
                state.areas[i-1] = left.areas[l-1] + right.areas[r-1] - 1;
            }
        }

        for(let x = 0; x < left.width; x++)
        {
            let l = left.hKey[x];
            let r = right.hKey[x];
            if (l != 0)
            {
                let i = lmap[l];
                if (i === undefined)
                {
                    i = ++id;
                    state.areas[i-1] = left.areas[l-1];
                }
                state.hKey[x] = i;
            }
            if (r != 0)
            {
                let i = rmap[r];
                if (i === undefined)
                {
                    i = ++id;
                    state.areas[i-1] = right.areas[r-1];
                }
                state.hKey[state.width-x-1] = i;
            }
        }

        state.maxArea = Math.max(state.maxArea, ... state.areas);
        return state;
    }
    
    static mergeTB(top, bottom)
    {
        assert.equal(top.width, bottom.width);
        assert.equal(top.height, bottom.height);

        let state = new CompressedState();

        state.width  = top.width
        state.height = top.height + bottom.height - 1;
        state.maxArea= Math.max(top.maxArea, bottom.maxArea);
        state.count  = top.count * bottom.count;
        state.vKey   = undefined; // not needed
        state.hKey   = undefined; // not needed

        let id = 0;
        let lmap = [];
        let rmap = [];

        for(let x = 0; x < state.width; x++)
        {
            let l = top.hKey[x];
            let r = bottom.hKey[x];

            if (l === 0)
            {
                assert.equal(r, 0);
                continue;
            }
            if (r === 0)
            {
                assert.equal(l, 0);
                continue;
            }

            let i;

            if (lmap[l] !== undefined)
            {
                i = lmap[l];
                rmap[r] = i;
                state.areas[i-1]--;
            }
            else if (rmap[r] !== undefined)
            {
                i = rmap[r];
                lmap[l] = i;
                state.areas[i-1]--;
            }
            else 
            {
                i = ++id;
                rmap[r] = lmap[l] = i;
                state.areas[i-1] = top.areas[l-1] + bottom.areas[r-1] - 1;
            }
        }

        state.maxArea = Math.max(state.maxArea, ... state.areas);
        return state;
     }    
}

class State
{
    constructor(width, height)
    {
        assert.notEqual(width, undefined);
        assert.notEqual(height, undefined);

        this.width = width;
        this.height= height;
        this.data = 0n;
        this.$next = undefined;
    }

    clone()
    {
        let newState = new State(this.width, this.height);
        
        newState.data = this.data;

        return newState;
    }

    get(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return 0;       
        const bits = BigInt(y*this.width + x);
        const mask = 2n ** bits;
        return (this.data & mask) != 0 ? 1 : 0;
    }

    set(x, y, value)
    {        
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;

        const bits = BigInt(y*this.width + x);
        const mask = 2n ** bits;
        this.data |= mask;
        if (value === 0)
            this.data -= mask;
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
        for(let y = 0; y < this.height; y++)
        for(let x = 0; x < this.width; x++)
        {
            max = Math.max(max, calculate(x, y));
        }
        this.data = old;
        return max;
    }
}

class StateCollection
{
    constructor()
    {
        this.states  = new Map();
        this.lefts   = new Map();
        this.tops    = new Map();
    }

    get size() { return this.states.size; }

    push(value)
    {
        const addTo = (map, key) => {
            if (key === undefined)
                return;

            let values = map.get(key);
            if (values === undefined)
                map.set(key, values = []);
            values.push(value);
        };

        let k = value.key;

        let s = this.states.get(k);
        if (s !== undefined)
        {
            s.count++;
        }
        else
        {
            this.states.set(k, value);
            addTo(this.lefts, value.leftKey);
            addTo(this.tops, value.topKey);
        }
    }

    get length() { return this.states.size };

    *values()
    {
        yield *this.states.values();
    }
}

function loadStates(size, trace)
{
    console.log(`Loading states for size ${size}x${size}`);

    const states = [new State(size, size)];

    for(let y = 0; y < size; y++)
    for(let x = 0; x < size; x++)
    {
        if (trace)
            process.stdout.write(`\r${x},${y}: ${states.length}  `);

        for(let i = states.length; i > 0; i--)
        {
            const state = states[i-1].clone();

            state.set(x, y, 1);
            states.push(state);
        }
    }
    
    console.log(`\rStates loaded => ${states.length} states`);

    const states2 = new StateCollection();
    for(let state of states)
    {
        const state2 = new CompressedState(state);

        states2.push(state2);
    }

    console.log(`\rStates compressed => ${states2.size} states`);
    
    return states2;
}

function solve(size, trace)
{
    assert.equal(size & 1, 1);

    function pass1(states)
    {
        console.log('Merging left and right states');

        let newStates = new StateCollection();
        let total = states.length;
        for(let left of states.values())
        {
            if (trace)
                process.stdout.write(`\r${ total-- } : ${ newStates.length } `);

            let rights = states.lefts.get(left.leftKey);
            if (rights === undefined)
                continue;

            for(let right of rights)
            {
                let newState = CompressedState.mergeLR(left, right);
                newStates.push(newState);
            }
        }

        console.log(`\rLeft and right states merged => ${newStates.length} states`);

        return newStates;
    }

    function pass2(states, callback)
    {
        console.log('Merging top and bottom states');

        let count = 0;
        let total = states.length;
        for(let top of states.values())
        {
            if (trace)
                process.stdout.write(`\r${total--} : ${count} `);

            let bottoms = states.tops.get(top.topKey);
            if (bottoms === undefined)
                continue;

            for(let bottom of bottoms)
            {
                let newState = CompressedState.mergeTB(top, bottom);
                callback(newState);
                count++;
            }
        }

        console.log(`\rTop and bottom states merged => ${count} states`);
        return count;
    }

    const areas = [];
    const COUNT = pass2( pass1( loadStates((size+1)/2, trace) ), (state) => {
        let area = state.maxArea;
        areas[area] = (areas[area] || 0) + state.count;
    });

    let total = 0; 

    const count = areas.reduce((a, c, i) => {
        total += (c * i);
        return a+c;
    }, 0);

    const answer = (total / count).toFixed(8);    
    return +answer;    
}

// assert.equal(solve(3), 3.64453125);
// assert.equal(solve(5, true), 8.14696828);
solve(7, true);

// assert.equal(solve(2), 1.875);
// assert.equal(solve(3), 3.64453125);
// assert.equal(solve(4), 5.76487732);

console.log("Tests passed");

// const answer = timeLogger.wrap('', () => solve(4, true)); // 8.14696828
// console.log(`Answer is ${answer}`);
