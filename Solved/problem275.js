const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

const GC = {
    collect: () => {
        if (global.gc)
            global.gc();
    }
}

let MAX_WIDTH = 3;
const A_CODE  = 33;

class BigMap
{
    static maxSize = (2**24 - 100);
    static pool = [];

    static createMap()
    {
        if (BigMap.pool.length > 0)
        {
            const m = BigMap.pool.pop();
            return m;
        }
        else
            return new Map();
    }

    constructor()
    {
        this.maps = [];
        this.map  = BigMap.createMap();
    }

    has(key)
    {
        if (this.map.has(key))
            return true;
        for (let m of this.maps)
            if (m.has(key))
                return true;
    }

    set(key, value)
    {
        this.map.set(key, value);
        if (this.map.size >= BigMap.maxSize)
        {
            console.log('... New map needed');
            this.maps.push(this.map);
            this.map = BigMap.createMap();
        }
    }

    clear()
    {
        for(let m of this.maps)
        {
            m.clear();
            BigMap.pool.push(m);
        }

        this.maps = [];
        this.map.clear();
    }

    *values(autoClear)
    {
        for (let m of this.maps)
        {
            yield *m.values();
            if (autoClear)
            {
                m.clear();
                BigMap.pool.push(m);
            }
        }
        if (autoClear && this.maps.length > 0)
            this.maps = [];

        yield *(this.map.values());
        if (autoClear)
            this.map.clear();
    }

    get size()
    {
        return this.maps.reduce((a, m) => a+m.size, this.map.size);
    }
}

class State
{
    static pool = [];

    static create(parent, x, y)
    {
        if (State.pool.length > 0)
        {
            const state  = State.pool.pop();

            state.data   = { xy: State.getXY(x, y), parent: parent.data };
            state.maxX   = Math.max(x, parent.maxX);
            state.minX   = Math.min(x, parent.minX)
            state.level  = parent.level + x;

            return state;
        }
        else
            return new State(parent, x, y);
    }

    release()
    {
        this.data = undefined;
        if (State.pool.length < 1000) // Don't keep too many
            State.pool.push(this);
    }

    static splitXY(xy)
    {
        if (xy < 0)
        {
            xy = -xy;
            const y = xy % 100;
            const x = -((xy - y) / 100);

            return {x, y};
        }
        else
        {
            const y = xy % 100;
            const x = (xy - y) / 100;
            return {x, y};
        }
    }

    static getXY(x, y)
    {
        if (x < 0)
            return -(y - x*100);
        else
            return  (y + x*100);
    }
    constructor(parent, x, y)
    {
        if (parent === undefined)
        {
            this.data  = { xy: 0 };
            this.minX  = 0;
            this.maxX  = 0;
            this.level = 0;
        }
        else
        {
            this.data   = { xy: State.getXY(x, y) , parent: parent.data };
            this.maxX   = Math.max(x, parent.maxX);
            this.minX   = Math.min(x, parent.minX)
            this.level  = parent.level + x;
        }
    }

    getKey()
    {
        let key1 = [];
        let key2 = [];

        for (let node = this.data; node !== undefined; node = node.parent)
        {
            const {x, y} = State.splitXY(node.xy);

            let cy = 18*y;
            if (x === 0)
            {
                cy = String.fromCharCode(A_CODE + cy);
                key1.push(cy);
                key2.push(cy);
            }
            else
            {
                if (y === 0)
                    throw "ERROR";

                const cx = x + MAX_WIDTH;
                const Cx = MAX_WIDTH - x;

                key1.push(String.fromCharCode(A_CODE + cx+cy));
                key2.push(String.fromCharCode(A_CODE + Cx+cy));
            }
        }

        key1 = key1.sort().join('');
        key2 = key2.sort().join('');

        return { key1, key2 };
    }

    isUsed(x, y)
    {
        if (y <= 0)
            return true;

        if (x > MAX_WIDTH || x < -MAX_WIDTH)
            return true;

        const xy = State.getXY(x, y);

        for (let node = this.data; node !== undefined; node = node.parent)
        {
            if (xy === node.xy)
                return true;
        }

        return false;
    }

    neighbors(callback)
    {
        const visited = [];

        const isValid = (x, y) =>
        {
            const k = (x+100) + 100*y;
            if (visited[k])
                return false;
            visited[k] = true;
            return ! this.isUsed(x, y);
        }

        for (let node = this.data; node !== undefined; node = node.parent)
        {
            const {x, y} = State.splitXY(node.xy);

            if (y > 0 && isValid(x-1, y))
            {
                callback(State.create(this, x-1, y));
            }
            if (y > 0 && isValid(x+1, y))
            {
                callback(State.create(this, x+1, y));
            }
            if (isValid(x, y+1))
            {
                callback(State.create(this, x, y+1));
            }
            if (y > 1 && isValid(x, y-1))
            {
                callback(State.create(this, x, y-1));
            }
        }
    }
}

function solve(n, trace)
{
    MAX_WIDTH = Math.floor(n / 2);

    let states    = new BigMap();
    let newStates = new BigMap();

    states.set('A', new State());

    while (n--)
    {
        const length = states.size;

        let traceCount = 0;
        let gcCount = 0;

        let i = 0;
        for (let state of states.values(true)) // true to clear/release maps as we go
        {
            if (trace)
            {
                if (traceCount === 0)
                {
                    process.stdout.write(`\r${n}:${length-i} - ${newStates.size}    `);
                }
                if (++traceCount >= 10000)
                    traceCount = 0;

                i++;
            }

            state.neighbors((newState) =>
            {
                if (++gcCount >= 2000000)
                {
                    gcCount = 0;
                    GC.collect();
                }

                if (n === 0 && newState.level != 0)
                {
                    newState.release();
                    return;
                }
                if (newState.level > 0)
                {
                    let level = newState.level;
                    level += (n * newState.minX) - ((n*(n+1)) / 2);
                    if (level > 0)
                    {
                        newState.release();
                        return; // No chance
                    }
                }
                else if (newState.level < 0)
                {
                    let level = newState.level;
                    level += (n * newState.maxX) + ((n*(n+1)) / 2);
                    if (level < 0)
                    {
                        newState.release();
                        return; // No chance
                    }
                }

                const {key1, key2} = newState.getKey();
                if (newStates.has(key1) || newStates.has(key2))
                {
                    newState.release();
                    return;
                }

                if (n === 0)
                {
                    // Don't add but mark a ok to reuse because there won't be another loop
                    newState.release();
                    newStates.set(key1, undefined);
                }
                else
                    newStates.set(key1, newState);
            });

            state.release();
        }

        [states, newStates] = [newStates, states];
        newStates.clear();
        GC.collect();
        gcCount = 0;
    }

    if (trace)
        console.log('');
        
    return states.size;
}

timeLogger.wrap('', () => {
    assert.equal(solve(6), 18);
    assert.equal(solve(10), 964);
    assert.equal(solve(15, true), 360505);
    console.log("Tests passed");
});

const answer = timeLogger.wrap('', () => solve(18, true));
console.log('Answer is', answer);