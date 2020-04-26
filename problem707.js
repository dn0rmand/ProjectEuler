const assert = require('assert');
const BigSet = require('tools/BigSet');

require('tools/bigintHelper');

const MODULO = 1000000007n;

class State
{
    constructor(w, h, map)
    {
        this.width = w;
        this.height= h;
        this.map   = map;
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
        
        const mask  = 2n ** BigInt((this.width * y) + x);
        this.map   ^= mask;
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

const memoize = {};

function calculate(w, h, trace)
{
    let k1 = `${w}x${h}`;
    let k2 = `${h}x${w}`;
    if (memoize[k1] || memoize[k2])
        return memoize[k1] || memoize[k2];

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

                const k = state.key;

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
        process.stdout.write(`\r                     \r`);

    memoize[k1] = counted.size;
    return counted.size;
}

function solve(width, power, increases)
{
    let pos       = 1;
    let index     = 0;

    while (pos++ < width)
    {
        power += increases[index];
        index  = (index+1) % increases.length;
    }
    // let value = 2n;
    // value = value.modPow(power, MODULO);
    // return Number(value);
    return power;
}

assert.equal(calculate(2,1), 2);
assert.equal(calculate(3,3), 512);
assert.equal(calculate(4,4), 4096);

console.log("Tests passed");

console.log('199x1 =>', solve(199, 1n, [0n, 2n, 1n]));
console.log('199x2 =>', solve(199, 1n, [3n, 0n, 4n, 1n]));
console.log('199x3 =>', solve(199, 3n, [1n, 5n, 3n, 0n, 4n, 3n]));
console.log('199x4 =>', solve(199, 4n, [4n, 4n, 0n, 8n]));

process.exit(0);
// console.log('199x:1', calculate(199, 1, true));
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
4x6: 16777216
`);

console.log(`
5x1: 16
5x2: 512
5x3: 4096
5x4: 1048576
5x5: 8388608
`)
// console.log('4x7:', calculate(4, 7, true));
// console.log('4x8:', calculate(4, 8, true));

/*

 1 =>     2,        2,       8,       16,      16,       64,     128,     128,    512,    1024,    1024,     4096, 8192, 8192, 32768, 65536
 2 =>     2,       16,      16,      256,     512,     4096,    4096,   65536, 131072, 1048576, 1048576, 16777216
 3 =>     8,       16,     512,     4096,    4096,   262144, 2097152, 4194304
 4 =>    16,      256,    4096,     4096, 1048576, 16777216
 5 =>    16,      512,    4096,  1048576, 8388608 
 6 =>    64,     4096,  262144, 16777216
 7 =>   128,     4096, 2097152
 8 =>   128,    65536, 4194304
 9 =>   512,   131072
10 =>  1024,  1048576
11 =>  1024,  1048576
12 =>  4096, 16777216
13 =>  8192
14 =>  8192
15 => 32768

*/
