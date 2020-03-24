const assert = require('assert');
const BigSet = require('tools/BigSet');

class State
{
    constructor(w, h, map)
    {
        this.width = w;
        this.height= h;
        this.map = map;
    }

    get(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return 0;
        const mask = 2n ** BigInt((this.width * y) + x);
        if (this.map & mask)
            return 1;
        else
            return 0;
    }

    switch(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;
        
        const mask   = 2n ** BigInt((this.width * y) + x);
        this.map ^= mask;
    }

    select(x, y)
    {
        this.switch(x, y);
        this.switch(x+1, y);
        this.switch(x-1, y);
        this.switch(x, y+1);
        this.switch(x, y-1);
    }

    get key()
    { 
        return this.map;
    }
}

function calculate(w, h, trace)
{
    let states      = new BigSet();
    let newStates   = new BigSet();

    const counted   = new BigSet();

    counted.add(0n);
    states.add(0n);

    const state = new State(w, h, 0n);

    while(states.size > 0)
    {
        if (trace)
            process.stdout.write(`\r${states.size} : ${counted.size}   `);

        for(const map of states.keys())
        {
            for(let x = 0; x < w; x++)
            for(let y = 0; y < h; y++)
            {
                state.map = map;
                state.select(x, y);

                const k = state.map;

                if (! counted.has(k))
                {
                    counted.add(k);
                    newStates.add(k);
                }
            }
        }

        [states, newStates] = [newStates, states];
        newStates.clear();
    }

    if (trace)
        process.stdout.write(`\r           \r`);

    return counted.size;
}

assert.equal(calculate(2,1), 2);
assert.equal(calculate(3,3), 512);
assert.equal(calculate(4,4), 4096);

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

console.log('4x5:', calculate(4, 5, true))
console.log('4x7:', calculate(4, 7, true));
console.log('4x8:', calculate(4, 8, true));