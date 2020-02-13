const assert = require('assert');
// const BigMap = require('tools/BigMap');
// const BigSet = require('tools/BigSet');
const timeLogger = require('tools/timeLogger');

const DEBUG = 0

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

    sort()
    {
        if (! DEBUG)
            return;

        if (this.areas.length <= 1)
            return;

        let m = this.areas.map((value, index) => { return { value, index: index+1} })
                          .sort((a, b) => a.value - b.value)
                          .reduce((a, v, index) => { a[v.index] = index+1; return a; }, [0]);

        this.areas.sort((a, b) => a - b);

        if (this.vKey)
            for(let k = 0; k < this.vKey.length; k++)
            {
                this.vKey[k] = m[this.vKey[k]];
            }

        if (this.hKey)
            for(let k = 0; k < this.hKey.length; k++)
            {
                this.hKey[k] = m[this.hKey[k]];
            }
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
        
        if (DEBUG)
        {
            this.$state = state;
        }
        state.sort;
    }

    get key()
    {
        let extra = '';
        if (DEBUG)
            extra = `${this.$state.data}:`
        if (this.vKey && this.hKey)
            return `${extra}${this.maxArea}:${this.vKey.join('-')}:${this.hKey.join('-')}:${this.areas.join('-')}`;
        else if (this.vKey)
            return `${extra}${this.maxArea}:${this.vKey.join('-')}:${this.areas.join('-')}`;
        else if (this.hKey)
            return `${extra}${this.maxArea}:${this.hKey.join('-')}:${this.areas.join('-')}`;
        else
            return `${extra}${this.maxArea}:${this.areas.join('-')}`;
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

    static stitchLR(left, right)
    {
        const h = left.height;
        const w = left.width + right.width - 1;

        const S = new State(w, h);

        for(let y = 0; y < h; y++)
        {
            for(let x = 0; x < left.width; x++)
            {
                S.set(x, y, left.get(left.width-1-x, y));
            }
            assert.equal(S.get(left.width-1, y), right.get(0, y));
            for(let x = 1; x < left.width; x++)
            {
                S.set(left.width-1+x, y, right.get(x, y));
            }
        }

        return S;
    }

    static stitchTB(top, bottom)
    {
        const h = top.height + bottom.height - 1;
        const w = top.width;

        const S = new State(w, h);

        for(let x = 0; x < w; x++)
        {
            let y = 0;
            for(; y < top.height; y++)
            {
                S.set(x, y, top.get(x, top.height-1-y));
            }
            assert.equal(S.get(x, y-1 ), bottom.get(x, 0));
            for(let i = 1; i < top.height; i++, y++)
            {
                S.set(x, y, bottom.get(x, i));
            }
        }

        return S;
    }

    static mergeLR(left, right)
    {        
        assert.equal(left.width, right.width);
        assert.equal(left.height, right.height);

        const state = new CompressedState();

        state.width  = left.width + right.width - 1;
        state.height = left.height;
        state.maxArea= Math.max(left.maxArea, right.maxArea);
        state.count  = left.count * right.count;
        state.vKey   = undefined; // won't need it anymore
        state.hKey   = new Array(state.width).fill(0);

        let id = 0;
        const lmap = [];
        const rmap = [];

        for(let y = 0; y < state.height; y++)
        {
            const l = left.vKey[y];
            const r = right.vKey[y];
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
                if (rmap[r] === undefined)
                {
                    state.areas[i-1] += right.areas[r-1];
                }
                else if (rmap[r] != i)
                {                
                    state.areas[i-1] += state.areas[rmap[r]-1];
                    state.areas[rmap[r]-1] = 0; // To fix key
                }
    
                rmap[r] = i;
                state.areas[i-1]--;
            }
            else if (rmap[r] !== undefined)
            {
                i = rmap[r];
                if (lmap[l] === undefined)
                {
                    state.areas[i-1] += left.areas[l-1];
                }
                else if (lmap[l] != i)
                {                    
                    state.areas[i-1] += state.areas[lmap[l]-1];
                    state.areas[lmap[l]-1] = 0; // To fix key
                }
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
            const l = left.hKey[x];
            const r = right.hKey[x];
            if (l != 0)
            {
                let i = lmap[l];
                if (i === undefined)
                {
                    i = ++id;
                    state.areas[i-1] = left.areas[l-1];
                    lmap[l] = i;
                }
                state.hKey[left.width-1 - x] = i;
            }
            if (r != 0)
            {
                let i = rmap[r];
                if (i === undefined)
                {
                    i = ++id;
                    state.areas[i-1] = right.areas[r-1];
                    rmap[r] = i;
                }
                state.hKey[left.width-1 + x] = i;
            }
        }

        state.maxArea = Math.max(state.maxArea, ... state.areas);

        if (DEBUG)
        {
            state.$state = CompressedState.stitchLR(left.$state, right.$state);

            if (state.maxArea != state.$state.getMaxArea() ||
                (state.areas.length > 1 && state.areas[0] === state.areas[1] && state.hKey.join('') === "00012"))
            {
                state.$state.dump();
                console.log(state.maxArea, state.$state.getMaxArea(), ': ', state.hKey.join(''), ' - ', state.areas.join(','));
                console.log(left.maxArea, right.maxArea);
                console.log(left.vKey.join(''), left.areas.join(', '));
                console.log(right.vKey.join(''), right.areas.join(', '));
                left.$state.dump();
                right.$state.dump();

                CompressedState.mergeLR(left, right);
            }
        }

        state.sort();
        return state;
    }
    
    static mergeTB(top, bottom)
    {
        assert.equal(top.width, bottom.width);
        assert.equal(top.height, bottom.height);

        const state = new CompressedState();

        state.width  = top.width
        state.height = top.height + bottom.height - 1;
        state.maxArea= Math.max(top.maxArea, bottom.maxArea);
        state.count  = top.count * bottom.count;
        state.vKey   = undefined; // not needed
        state.hKey   = undefined; // not needed

        let id = 0;
        const tmap = [];
        const bmap = [];

        for(let x = 0; x < state.width; x++)
        {
            const t = top.hKey[x];
            const b = bottom.hKey[x];

            if (t === 0)
            {
                assert.equal(b, 0);
                continue;
            }
            if (b === 0)
            {
                assert.equal(t, 0);
                continue;
            }

            let i;

            if (tmap[t] !== undefined)
            {
                i = tmap[t];
                if (bmap[b] === undefined)
                {
                    state.areas[i-1] += bottom.areas[b-1];
                }
                else if (bmap[b] != i)
                {                    
                    state.areas[i-1] += state.areas[bmap[b]-1];
                    state.areas[bmap[b]-1] = 0; // To fix key
                }
                bmap[b] = i;
                state.areas[i-1]--;
            }
            else if (bmap[b] !== undefined)
            {
                i = bmap[b];
                if (tmap[t] === undefined)
                {
                    state.areas[i-1] += top.areas[t-1];
                }
                else if (tmap[t] != i)
                {                    
                    state.areas[i-1] += state.areas[tmap[t]-1];
                    state.areas[tmap[t]-1] = 0; // To fix key
                }
                tmap[t] = i;
                state.areas[i-1]--;
            }
            else 
            {
                i = ++id;
                bmap[b] = tmap[t] = i;
                state.areas[i-1] = top.areas[t-1] + bottom.areas[b-1] - 1;
            }
        }

        state.maxArea = Math.max(state.maxArea, ... state.areas);

        if (DEBUG)
        {
            state.$state = CompressedState.stitchTB(top.$state, bottom.$state);

            if (state.maxArea != state.$state.getMaxArea())
            {
                state.$state.dump();
                console.log(state.maxArea, state.$state.getMaxArea());
                console.log(top.maxArea, bottom.maxArea);
                console.log(top.hKey.join(''), top.areas.join(', '));
                console.log(bottom.hKey.join(''), bottom.areas.join(', '));
                top.$state.dump();
                bottom.$state.dump();

                CompressedState.mergeTB(top, bottom);
            }
        }

        state.sort();
        return state;
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

    dump()
    {
        console.log('');
        for(let y = 0; y < this.height; y++)
        {
            const v = [];
            for (let x = 0; x < this.width; x++)
                v.push(this.get(x, y) ? '◼︎' : '◻︎');
            console.log(v.join(''));
        }
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
    if (trace)
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
    
    if (trace)
        console.log(`\rStates loaded => ${states.length} states`);

    const states2 = new StateCollection();
    for(let state of states)
    {
        const state2 = new CompressedState(state);

        states2.push(state2);
    }

    if (trace)
        console.log(`\rStates compressed => ${states2.size} states`);
    
    return states2;
}

function solve(size, trace)
{
    assert.equal(size & 1, 1);

    const MAX_AREA = size*size;

    function pass1(states)
    {
        if (trace)
            console.log('Merging left and right states');

        const newStates = new StateCollection();
        let total = states.length;
        for(let left of states.values())
        {
            if (trace)
                process.stdout.write(`\r${ total-- } : ${ newStates.length } `);

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
            console.log(`\rLeft and right states merged => ${newStates.length} states`);

        return newStates;
    }

    function pass2(states, callback)
    {
        if (trace)
            console.log('Merging top and bottom states');

        let count = 0;
        let total = states.length;
        let traceCount = 0;

        for(let top of states.values())
        {
            if (trace)
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
                const newState = CompressedState.mergeTB(top, bottom);
                callback(newState);
                count++;
            }
        }

        if (trace)
            console.log(`\rTop and bottom states merged => ${count} states`);
        return count;
    }

    const areas = [];
    let ignoredAreas = [];
    let ignoredCount= 0;

    pass2( pass1( loadStates((size+1)/2, trace) ), (state) => {
        const area = state.maxArea;
        if (area > MAX_AREA)
        {
            if (DEBUG)
                throw "ERROR";
            else
            {
                ignoredAreas[area-MAX_AREA-1] = (ignoredAreas[area-MAX_AREA-1] || 0) + area;
                ignoredCount += state.count;

                return; // IGNORE
            }
        }
        areas[area] = (areas[area] || 0) + state.count;
    });

    let total = 0; 

    const count = areas.reduce((a, c, i) => {
        total += (c * i);
        return a+c;
    }, 0);

    if (count > Number.MAX_SAFE_INTEGER || total > Number.MAX_SAFE_INTEGER)
        throw "ERROR";

    if (size == 7)
    {
        if (count != 2**49)
            console.log(`MISSING = ${ 2**49 - count} `);
        console.log(`Actual answer = ${ total / count }`);
        if (ignoredCount > 0)
        {
            console.log(`Ignored Count = ${ ignoredCount }`);
            console.log(`Ignored Areas = ${ ignoredAreas.join(', ') }`);
        }

        const expected = [
            1,
            1280128949,
            176229287225,
            2370172541160,
            9326182280866,
            19456218353604,
            29180787054751,
            36097936854979,
            39770482398634,
            40623636302296,
            39600310721716,
            37509706588390,
            34927356524950,
            32178686371964,
            29421912139916,
            26746561753300,
            24218963812296,
            21883682102512,
            19749565785812,
            17795455788742,
            15990850820922,
            14307976499256,
            12723830222506,
            11220743506424,
            9787395461370,
            8419384731456,
            7118865766410,
            5893497890598,
            4755089510429,
            3718037391496,
            2797571528190,
            2007848049708,
            1359698792275,
            857702706964,
            496867869514,
            260563213706,
            122088582016,
            50569493669,
            18367605400,
            5814206412,
            1595064629,
            376790971,
            75969780,
            12911930,
            1817335,
            206449,
            18212,
            1172,
            49,
            1
        ];
        
        for(let i = 0; i <= MAX_AREA; i++)
        {
            let v = areas[i] || 0;
            if (v != expected[i])
                console.log(`${i}: ${v} instead of ${expected[i]}`);
        }
    }

    const answer = (total / count).toFixed(8);

    if (DEBUG)
        console.log(areas.join(', '));

    return +answer;
}

assert.equal(solve(3), 3.64453125);
assert.equal(solve(5), 8.14696828);

console.log("Tests passed");

const answer = timeLogger.wrap('', () => solve(7, true));
console.log(`Answer is ${answer}`);
