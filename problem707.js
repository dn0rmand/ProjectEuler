const assert = require('assert');
const BigSet = require('tools/BigSet');
const BigMap = require('tools/BigMap');

class State
{
    static pool = [];

    constructor(w, h, map)
    {
        this.width = w;
        this.height= h;
        if (map)
        {
            this.map = map.slice();
        }
        else
        {
            this.map = new Array(h);
            this.map.fill(0n);
        }
    }

    static create(from)
    {
        if (State.pool.length > 0)
        {
            const s = State.pool.pop();

            s.width  = from.width;
            s.height = from.height;
            s.map    = from.map.slice();

            return s;
        }
        else
        {
            return new State(from.width ,from.height, from.map);
        }
    }

    release()
    {
        if (State.pool.length < 1000)
            State.pool.push(this);
    }

    get(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return 0;
        const mask = 2n ** BigInt(x);
        if (this.map[y] & mask)
            return 1;
        else
            return 0;
    }

    switch(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;
        
        const mask   = 2n ** BigInt(x);
        this.map[y] ^= mask;
    }

    select(x, y)
    {
        let n = State.create(this);

        n.switch(x, y);

        n.switch(x+1, y);
        n.switch(x-1, y);

        n.switch(x, y+1);
        n.switch(x, y-1);

        return n;
    }

    get key()
    {                
        let k = 0n;
        let w = BigInt(this.width);
        for(let r of this.map)
        {
            k = (k << w) + r;
        }
        return k;
    }

    get shortKey()
    {
        let w = BigInt(this.width);

        return (this.map[0] << w) + this.map[this.height-1];
    }
}

function calculate(w, h, trace)
{
    let states      = new BigMap();
    let newStates   = new BigMap();

    const counted     = new BigSet();
    const shortStates = new BigMap();

    counted.add(0n);

    states.set(0n, new State(w, h));
    shortStates.set(0n, 1n);

    while(states.size > 0)
    {
        if (trace)
            process.stdout.write(`\r${states.size}    `);

        for(const state of states.values())
        {
            for(let x = 0; x < w; x++)
            for(let y = 0; y < h; y++)
            {
                const n = state.select(x, y);
                const k = n.key;

                if (! counted.has(k))
                {
                    counted.add(k);
                    newStates.set(k, n);

                    // const k2 = n.shortKey;
                    // shortStates.set(k2, (shortStates.get(k2) || 0n)+1n);
                }
                else
                    n.release();
            }
            state.release();
        }

        [states, newStates] = [newStates, states];
        newStates.clear();
    }

    if (trace)
        process.stdout.write(`\r           \r`);

    for(const s of states.values())
        s.release();

    // let BITS = BigInt(w);
    // let m1 = (2n ** BITS) - 1n;
    // let m2 = m1 << BITS;

    // let total = 0n;

    // for(let k1 of shortStates.keys())
    // {
    //     let c1 = shortStates.get(k1);
    //     let kk1 = k1 & m1;
    //     for(let k2 of shortStates.keys())
    //     {
    //         let c2 = shortStates.get(k2);
    //         let kk2 = (k2 & m2) >> BITS;
    //         if (kk1 == kk2)
    //             total += c1*c2;
    //     }
    // }

    return {count: counted.size } ;//, short: total};
}

assert.equal(calculate(2,1).count, 2);
assert.equal(calculate(3,3).count, 512);
assert.equal(calculate(4,4).count, 4096);

console.log("Tests passed");

console.log(`
2x1: 2
2x2: 16
2x3: 16
2x4: 256
2x5: 512
2x6: 4096
2x7: 4096
2x8: 65536
`);

console.log(`
3x1: 8     
3x2: 16    
3x3: 512   
3x4: 4096  
3x5: 4096  
3x6: 262144
3x7: 2097152
3x8: 4194304
`);

console.log(`
4x1: 16    
4x2: 256   
4x3: 4096  
4x4: 4096  
4x5: 1048576
4x6: 16777216`);

console.log('4x3:', calculate(4, 3, true).count)
console.log('4x7:', calculate(4, 7, true).count);
console.log('4x8:', calculate(4, 8, true).count);