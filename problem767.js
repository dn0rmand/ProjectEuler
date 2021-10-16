const assert = require('assert');
const Tracer = require('tools/tracer');
const BigMap = require('tools/BigMap');

const MODULO = 1000000007;
let HEIGHT = 4

function factorial(n)
{
    let r = 1;
    for(let p = n; p > 1; p--) {
        r *= p;
    }
    return r;
}

function getKeyCount(n)
{
    let top = 1;
    for(let k = 2*n-1; k > n; k--) {
        top *= k;
    }
    let bottom = factorial(n-1);

    const result = top / bottom;

    return result;
}

function getLines(k)
{
    const lines = [];

    const max = 2**k;
    if (max > Number.MAX_SAFE_INTEGER) {
        throw 'Too big';
    }

    for(let i = 0; i < max; i++) {
        let bits = (max+i).toString(2).split('').slice(1).map(b => +b);
        let count = bits.reduce((a, b) => a + b, 0);
        if (! lines[count])
            lines[count] = [bits];
        else
            lines[count].push(bits);
    }

    return lines;
}

function getColumns()
{
    const max = 2**HEIGHT;
    const columns = [];

    for(let i = 0; i < max; i++) {
        let bits = (max+i).toString(2).split('').slice(1).map(b => +b);

        columns.push(bits);
    }

    return columns;
}

class State 
{
    constructor(previous)
    {
        if (previous) {
            this.matrix = [...previous.matrix];
            this.count  = previous.count;
        } else {
            this.matrix = [];
            this.count  = 1;
        }
    }

    clone() {
        const state = new State(this);
        return state;
    }

    key(K) {
        if (K <= 0 || this.matrix.length < K) {
            throw "Error";
        }
        const reverse = this.matrix[0][0] ? [1, 0] : [0, 1];
        let k = 0;
        for(let c = 0; c < K; c++) {
            k = k*2 + reverse[this.matrix[c][0]];
            k = k*2 + reverse[this.matrix[c][1]];
        }
        return k;
    }

    dump(K)
    {
        const reverse = this.matrix[0][0] ? ['#', '.'] : ['.', '#'];
        console.log(`--- ${this.count} ---`);
        for(let r = 0; r < 2; r++) {
            const row = [];            
            for(let c = 0; c < K; c++) {
                row.push(reverse[this.matrix[c][r]]);
            }
            console.log(row.join(''));
        }
        console.log(``);
    }

    addColumn(column, K)
    {
        const state = this.clone();
        state.matrix.push(column);

        for(let c = 1; c < HEIGHT; c++) {
            let sum = 0;
            for(let i = 0; i < K && i < state.matrix.length; i++) {
                let w = state.matrix.length-1-i;
                sum += state.matrix[w][c] + state.matrix[w][c-1];
                if (sum > K) { return; } 
            }
            if (state.matrix.length >= K && sum !== K) {
                return;
            }
        }

        return state;
    }
}

function slowB(k, n)
{
    const columns = getColumns();

    let states = [new State()];

    const tracer = new Tracer(1, true);

    for(let width = 1; width <= n; width++) {
        const newStates = [];
        let s = states.length;
        for(const state of states)
        {
            tracer.print(_ => `${width}: ${s} / ${newStates.length}`);
            s--;
            for(let c = 0; c < columns.length; c++) 
            {
                const column = columns[c];
                const newState = state.addColumn(column, k);
                if (! newState) continue;

                newStates.push(newState);
            }
        } 
        states = newStates;
    }

    tracer.clear();

    const newStates = new Map();
    states.forEach(state => {
        const key = state.key(k);
        const old = newStates.get(key);
        if (old) {
            old.count += state.count;
        } else {
            newStates.set(key, state);
        }
    });

    console.log(`${k} => # of keys = ${newStates.size} - ${getKeyCount(k)}`);
    let total = 0;
    for(const state of [...newStates.values()].sort((a, b) => a.count - b.count)) {
        state.dump(k);
        total += state.count;
    }

    return total;
}

function makeBlocks(lines, k)
{
    const blocks = [];

    for(let top = 0; top <= k; top++) {
        const topRows    = lines[top];
        const bottomRows = lines[k-top];

        for(const v1 of topRows) {
            for(const v2 of bottomRows) {
                const block = { 
                    top: v1, 
                    bottom: v2,
                };
                blocks.push(block);                
            }
        }
    }

    return blocks;
}

function expandBlocks(blocks, index)
{
    const newBlocks = new BigMap();

    const add = block => {
        const key = `${block.top}:${block.bottom}`;
        newBlocks.set(key, block);
    }

    for(let block of blocks.values()) {
        const count = block.top[index] + block.bottom[index];

        if (count === 0) {
            add({
                top: [...block.top, 0],
                bottom: [...block.bottom, 0],
            });
        } else if (count === 2) {
            add({
                top: [...block.top, 1],
                bottom: [...block.bottom, 1],
            });
        } else {
            add({
                top: [...block.top, 0],
                bottom: [...block.bottom, 1],
            });
            add({
                top: [...block.top, 1],
                bottom: [...block.bottom, 0],
            });
        }
    }

    return newBlocks;
}

function B(k, n) 
{
    const lines   = getLines(k);
    const $blocks = makeBlocks(lines, k);
    let blocks    = { 
        values: () => $blocks, 
        forEach: (callback) => $blocks.forEach(callback),
    };

    for(let i = 0, l = k; l < n; i++, l++) {
        blocks = expandBlocks(blocks, i);
    }

    const mainBlocks = new BigMap();
    let states = new BigMap();

    blocks.forEach(block => {
        block.top = block.top.reduce((a, v) => a*2n+BigInt(v), 0n);
        block.bottom = block.bottom.reduce((a, v) => a*2n+BigInt(v), 0n);

        const k = block.bottom;
        const old = mainBlocks.get(k);
        if (old) {
            old.push(block);
        } else {
            mainBlocks.set(k, [block]);
        }

        if (states.has(k)) {
            states.get(k).count++;
        } else {
            states.set(k, { bottom: block.bottom, count: 1n });
        }
    });

    for(let h = 3; h <= HEIGHT; h++) {
        const newStates = new BigMap();

        for(const state of states.values()) {
            const others = mainBlocks.get(state.bottom) || [];
            for(const other of others) {
                const newState = {
                    bottom: other.bottom,
                    count: state.count,
                };

                const old = newStates.get(newState.bottom);
                if (old) {
                    old.count = (old.count + newState.count);
                } else {
                    newStates.set(newState.bottom, newState);
                }
            }
        }

        states = newStates;
    }

    let total = 0n;
    
    states.forEach(state => total = (total + state.count));

    return total;
}

// assert.strictEqual(B(2, 4), 65550n);
// assert.strictEqual(B(3, 9), 87273560n);
// console.log('Test passed');

console.log(slowB(2, 6));
console.log(slowB(3, 9));
console.log(slowB(4, 12));
console.log(slowB(5, 12));
console.log(slowB(6, 12));
console.log(slowB(7, 12));