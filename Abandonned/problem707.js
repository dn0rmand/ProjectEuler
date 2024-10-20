const assert = require('assert');
const { BigSet, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007;

class State {
    constructor(w, h, map) {
        this.width = w;
        this.height = h;
        this.map = map;
    }

    get(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 0;
        }
        const mask = 2n ** BigInt(this.width * y + x);
        if (this.map & mask) return 1;
        else return 0;
    }

    switch(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }

        const mask = 2n ** BigInt(this.width * y + x);
        this.map ^= mask;
    }

    select(x, y) {
        this.switch(x, y);
        this.switch(x + 1, y);
        this.switch(x - 1, y);
        this.switch(x, y + 1);
        this.switch(x, y - 1);
    }

    get key() {
        return this.map;
    }
}

const memoize = {};

function calculate(w, h, trace) {
    const k1 = `${w}x${h}`;
    const k2 = `${h}x${w}`;
    if (memoize[k1] || memoize[k2]) {
        return memoize[k1] || memoize[k2];
    }

    let states = new BigSet();
    let newStates = new BigSet();
    const counted = new BigSet();

    counted.add(0n);
    states.add(0n);

    const state = new State(w, h, 0n);
    const tracer = new Tracer(trace);

    while (states.size > 0) {
        tracer.print(() => `${states.size} : ${counted.size}`);

        for (const map of states.keys()) {
            for (let x = 0; x < w; x++)
                for (let y = 0; y < h; y++) {
                    state.map = map;
                    state.select(x, y);

                    const k = state.key;

                    if (!counted.has(k)) {
                        counted.add(k);
                        newStates.add(k);
                    }
                }
        }

        [states, newStates] = [newStates, states];
        newStates.clear();
    }
    tracer.clear();

    memoize[k1] = counted.size;
    return counted.size;
}

function getPower(width, increases) {
    let pos = 1;
    let index = 0;
    let power = 0;

    while (pos++ <= width) {
        power += increases[index];
        index = (index + 1) % increases.length;
    }

    return power;
}

function solve(width, increases) {
    const power = getPower(width, increases);
    return 2n ** BigInt(power);
}

assert.equal(calculate(2, 1), 2);
assert.equal(calculate(3, 3), 512);
assert.equal(calculate(4, 4), 4096);

// assert.equal(calculate(7, 11), 4096);

console.log('Tests passed');

console.log(calculate(5, 6, true));

console.log('7x4 =>', getPower(7, [4, 4, 4, 0, 8]));
console.log('5x5 =>', getPower(5, [4, 5, 3, 8, 3]));

console.log('16x1 =>', solve(16, [1, 0, 2]));
console.log('12x2 =>', solve(12, [1, 3, 0, 4]));
console.log('9x3 =>', solve(9, [3, 1, 5, 3, 0, 6]));
console.log('6x4 =>', solve(6, [4, 4, 4, 0, 8]));

// console.log('199x5 =>', solve(199, 4n, [4n, 4n, 0n, 8n]));

process.exit(0);
// console.log('199x:1', calculate(199, 1, true));

/*

 1 =>     2,        2,         8,       16,      16,       64,     128,     128,       512,    1024,    1024,     4096, 8192, 8192, 32768, 65536
 2 =>     2,       16,        16,      256,     512,     4096,    4096,   65536,    131072, 1048576, 1048576, 16777216
 3 =>     8,       16,       512,     4096,    4096,   262144, 2097152, 4194304, 134217728
 4 =>    16,      256,      4096,     4096, 1048576, 16777216
 5 =>    16,      512,      4096,  1048576, 8388608 
 6 =>    64,     4096,    262144, 16777216
 7 =>   128,     4096,   2097152
 8 =>   128,    65536,   4194304
 9 =>   512,   131072, 134217728
10 =>  1024,  1048576
11 =>  1024,  1048576
12 =>  4096, 16777216
13 =>  8192
14 =>  8192
15 => 32768
16 => 65536
*/

/*
 1 =>   1,   1,   3,   4,   4,   6,   7,   7,   9,  10,  10,  12,  13,  13,  15,  16
 2 =>   1,   4,   4,   8,   9,  12,  12,  16,  17,  20,  20,  24
 3 =>   3,   4,   9,  12,  12,  18,  21,  22,  27
 4 =>   4,   8,  12,  12,  20,  20
 5 =>   4,   9,  12,  20,  23 
 6 =>   6,  12,  18,  24
 7 =>   7,  12,  21
 8 =>   7,  16,  22
 9 =>   9,  17,  27
10 =>  10,  20
11 =>  10,  20
12 =>  12,  24
13 =>  13
14 =>  13
15 =>  15
16 =>  16
*/
