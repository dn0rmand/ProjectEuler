const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

class CompressedState
{
    constructor(state)
    {
        this.count  = 1;
        this.width  = 0;
        this.height = 0;
        this.maxArea= 0;
        this.areas  = [];    

        this.vKey = undefined;
        this.hKey = undefined;

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
                this.areas[id-1] = calculate(x, 0);
            }
        }
        state.data = old;
    }

    get key()
    {
        if (this.vKey && this.hKey)
            return `${this.maxArea}:${this.vKey.join('-')}:${this.hKey.join('-')}:${this.areas.join('-')}`;
        else if (this.vKey)
            return `${this.maxArea}:${this.vKey.join('-')}:${this.areas.join('-')}`;
        else if (this.hKey)
            return `${this.maxArea}:${this.hKey.join('-')}:${this.areas.join('-')}`;
        else
            return `${this.maxArea}:${this.areas.join('-')}`;
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

    fixHKey()
    {
        let used = [];
        let pos  = [];

        for(let p in this.hKey)
        {
            p = +p;
            let i = this.hKey[p];

            if (i > 0 && used[i-1] === undefined)
            {
                pos[i-1]  = p;
                used[i-1] = i-1;
            }
        }

        // Remove unused areas and sort 

        let changed = false;

        used = used.sort((a, b) => {
            if (a === undefined)
                return b === undefined ? 0 : 1;
            else if (b === undefined)
                return 1;
            let s = this.areas[a]-this.areas[b]; 
            if (s === 0)
                return pos[a]-pos[b];
            else
                return s;
        });
        
        used = used.reduce((a, v, i) => { 
            a[v] = i; 
            if (i !== v)
                changed = true;
            return a; 
        }, []);

        if (! changed)
        {
            if (used.length < this.areas.length)
                this.areas.length = used.length;

            return;
        }

        for(let i = 0; i < this.hKey.length; i++)
        {
            if (this.hKey[i])
            {
                this.hKey[i] = used[this.hKey[i]-1]+1;
            }
        }

        const oldAreas = [... this.areas];
        this.areas.fill(0);

        for(let i = 0; i < used.length; i++)
            if (used[i] !== undefined)
                this.areas[used[i]] = oldAreas[i];

        while (this.areas.length > 0 && this.areas[this.areas.length-1] === 0)
            this.areas.pop();
    }

    static mergeLR(left, right)
    {        
        assert.equal(left.width, right.width);
        assert.equal(left.height, right.height);

        const width = left.width + right.width - 1;

        const connections = {};

        for(let x = 0; x < left.width; x++)
        {
            const l = left.vKey[x];
            const r = right.vKey[x];

            if (l === 0 || r === 0)
            {
                assert.equal(l, r);
                continue;
            }
            const k = `${l}_${r}`;
            connections[k] = 1 + (connections[k] || 0);
        }

        const lmap        = [];
        const rmap        = [];
        const leftAreas   = [0, ... left.areas];   // copy and make it starts at index 1
        const rightAreas  = [0, ... right.areas];  // copy and make it starts at index 1
        const areas       = new Array(width+1).fill(0);
        const hKey        = new Array(width).fill(0);

        let id = 1;

        for(let k in connections)
        {
            const l = +(k[0]);
            const r = +(k[2]);
            const points = connections[k];

            let i;

            if (lmap[l])
            {
                i = lmap[l];
                if (rmap[r])
                {
                    // add bmap[b] to area
                    areas[i] += areas[rmap[r]] - points;
                    areas[rmap[r]] = 0;

                    rmap[r] = i;
                }
                else
                {
                    assert.notEqual(rightAreas[r], 0);

                    areas[i] += rightAreas[r] - points;
                    rmap[r] = i;
                    rightAreas[r] = 0; // mark as used
                }
            }
            else if (rmap[r])
            {
                i = rmap[r];

                assert.notEqual(leftAreas[l], 0);

                areas[i] += leftAreas[l] - points;
                lmap[l] = i;
                leftAreas[l] = 0; // Mark as used
            }
            else
            {
                i = id++;
                assert.notEqual(leftAreas[l], 0);
                assert.notEqual(rightAreas[r], 0);

                rmap[r]  = lmap[l] = i;
                areas[i]+= leftAreas[l] + rightAreas[r] - points;

                leftAreas[l] = rightAreas[r] = 0; // Mark as used
            }
        }

        // Build new Key

        for(let x = 0; x < left.width; x++)
        {
            const l = left.hKey[x];
            
            if (l != 0)
            {
                let i = lmap[l];
                if (i === undefined)
                {
                    i = id++;
                    areas[i] = leftAreas[l];
                    lmap[l] = i;
                }
                hKey[left.width-1 - x] = i;
            }

            const r = right.hKey[x];

            if (r != 0)
            {
                let i = rmap[r];
                if (i === undefined)
                {
                    i = id++;
                    areas[i] = rightAreas[r];
                    rmap[r] = i;
                }
                hKey[left.width-1 + x] = i;
            }
        }

        // Trim areas

        areas.shift(); // remove prefix 0
        while (areas.length > 0 && areas[areas.length-1] === 0)
            areas.pop();

        const state = new CompressedState();
        state.maxArea = Math.max(left.maxArea, right.maxArea, ... areas);
        state.areas   = areas;
        state.width   = width;
        state.height  = left.height;
        state.count   = left.count * right.count;
        state.hKey    = hKey;

        state.fixHKey();

        return state;
    }

    static mergeTB(top, bottom, callback)
    {
        assert.equal(top.width, bottom.width);

        const topAreas    = [0, ... top.areas];     // copy and make it starts at index 1
        const bottomAreas = [0, ... bottom.areas];  // copy and make it starts at index 1

        const topKey    = [... top.hKey];
        const bottomKey = [... bottom.hKey];

        const followBottomTop = (id) =>
        {
            let area = 0;

            for(let i = 0; i < bottomKey.length; i++)
            {
                if (bottomKey[i] === id)
                {
                    const id2 = topKey[i];

                    assert.notEqual(id2, 0);

                    area     += topAreas[id2] + bottomAreas[id] - 1;
                    topKey[i] = bottomKey[i] = 0; // processed;
                    topAreas[id2] = bottomAreas[id] = 0; // already counted
                    area += followTopBottom(id2)
                }
            }

            return area;
        };

        const followTopBottom = (id) =>
        {
            let area = 0;

            for(let i = 0; i < topKey.length; i++)
            {
                if (topKey[i] === id)
                {
                    const id2 = bottomKey[i];

                    assert.notEqual(id2, 0);

                    area     += topAreas[id] + bottomAreas[id2] - 1;
                    topKey[i] = bottomKey[i] = 0; // processed;
                    topAreas[id] = bottomAreas[id2] = 0; // already counted

                    area += followBottomTop(id2)
                }
            }

            return area;
        };

        let maxArea  = Math.max(top.maxArea, bottom.maxArea);

        for(let id of topKey)
        {
            if (id !== 0)
            {
                const area = followTopBottom(id);
                if (area > maxArea)
                    maxArea = area;
            }
        }

        callback(maxArea, top.count * bottom.count);
    }

    static mergeTB_V1(top, bottom, callback)
    {
        assert.equal(top.width, bottom.width);
        assert.equal(top.height, bottom.height);

        const width  = top.width
        const tmap = [];
        const bmap = [];
        const areas= [0];

        let id = 0;

        const updateMaps = (from, to) => {
            tmap.reduce((a, v, i) => {
                if (v === from)
                    tmap[i] = to;
                return a;
            }, 0);
            bmap.reduce((a, v, i) => {
                if (v === from)
                    bmap[i] = to;
                return a;
            }, 0);
        };

        for(let x = 0; x < width; x++)
        {
            const t = top.hKey[x];
            const b = bottom.hKey[x];

            if (t === 0 || b === 0)
            {
                assert.equal(b, 0);
                continue;
            }

            let i;

            if (tmap[t] !== undefined)
            {
                i = tmap[t];
                if (bmap[b] === undefined)
                {
                    areas[i] += bottom.areas[b-1];
                }
                else if (bmap[b] != i)
                {                    
                    areas[i] += areas[bmap[b]];
                    areas[bmap[b]] = 0; // To fix key

                    updateMaps(bmap[b], i);
                }
                bmap[b] = i;
                areas[i]--;
            }
            else if (bmap[b] !== undefined)
            {
                i = bmap[b];
                if (tmap[t] === undefined)
                {
                    areas[i] += top.areas[t-1];
                }
                else if (tmap[t] != i)
                {                    
                    areas[i] += areas[tmap[t]];
                    areas[tmap[t]] = 0; // To fix key

                    updateMaps(tmap[t], i);
                }
                tmap[t] = i;
                areas[i]--;
            }
            else 
            {
                i = ++id;
                bmap[b] = tmap[t] = i;
                areas[i] = top.areas[t-1] + bottom.areas[b-1] - 1;
            }
        }

        const maxArea = Math.max(top.maxArea, bottom.maxArea, ... areas);
        callback(maxArea, top.count * bottom.count);
    }
}

class State
{
    constructor(width, height, data)
    {
        assert.notEqual(width, undefined);
        assert.notEqual(height, undefined);

        this.width = width;
        this.height= height;
        this.data  = data || 0n ;
    }

    clone()
    {
        const newState = new State(this.width, this.height);
        
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

        const calculate = (x, y) =>
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

        const k = value.key;

        const s = this.states.get(k);
        if (s !== undefined)
        {
            s.count += value.count;
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
    if (trace && trace !== 10)
        console.debug(`Loading states for size ${size}x${size}`);

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
    
    if (trace)
        console.debug(`\rStates loaded => ${states.length} states`);

    const states2 = new StateCollection();
    for(let state of states)
    {
        const state2 = new CompressedState(state);

        states2.push(state2);
    }

    if (trace)
        console.debug(`\rStates compressed => ${states2.size} states`);
    
    return states2;
}

function solve(size, trace)
{
    assert.equal(size & 1, 1);

    function pass1(states)
    {
        if (trace)
            console.debug('Merging left and right states');

        const newStates = new StateCollection();
        let todo = states.length;

        let traceCount = 0;
        for(let left of states.values())
        {
            if (trace)
            {
                if (traceCount === 0)
                    process.stdout.write(`\r${ todo } : ${ newStates.length } `);

                if (++traceCount >= 500)
                    traceCount = 0;

                todo--;
            }
            const rights = states.lefts.get(left.leftKey);
            if (rights === undefined)
                continue;

            for(let right of rights)
            {
                const newState = CompressedState.mergeLR(left, right);
                newStates.push(newState);
            }
        }

        if (trace)
            console.info(`\rLeft and right states merged => ${newStates.length} states`);

        return newStates;
    }

    function pass2(states, callback)
    {
        if (trace)
            console.debug('Merging top and bottom states');

        let count = 0;
        let total = states.length;
        let traceCount = 0;

        for(let top of states.values())
        {
            if (trace && trace !== 10)
            {
                total--;
                if (traceCount === 0)
                    process.stdout.write(`\r${total} : ${count} `);
                if (++traceCount >= 1000)
                    traceCount = 0;
            }

            const bottoms = states.tops.get(top.topKey);
            if (bottoms === undefined)
                continue;

            for(let bottom of bottoms)
            {
                CompressedState.mergeTB_V1(top, bottom, callback);
                count++;
            }
        }

        if (trace)
            console.debug(`\rTop and bottom states merged => ${count} states`);
        return count;
    }

    let totalArea = 0;
    let totalCount = 0;

    pass2( pass1( loadStates((size+1)/2, trace) ), (area, count) => {
        totalArea += area * count;
        totalCount += count;
    });

    const answer = (totalArea / totalCount).toFixed(8);

    return +answer;
}

assert.equal(solve(3), 3.64453125);
assert.equal(solve(5), 8.14696828);

console.debug("Tests passed");

const answer = timeLogger.wrap('', () => solve(7, true)); // 13.510998363327158
console.info(`Answer is ${answer}`);
