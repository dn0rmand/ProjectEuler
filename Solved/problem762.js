const assert = require('assert');
const linearRecurrence = require('tools/linearRecurrence');
const Matrix = require('tools/matrix-small');

const MODULO = 1E9;
const MAX = 100000;

class State
{
    constructor(previous)
    {
        if (previous) {
            this.columns = previous.columns.map(c => c.map(x => x));
        } else {
            this.columns = [[1n, 0n, 0n, 0n]];
        }
        this.$key = undefined;        
    }

    get key() { 
        if (this.$key) return this.$key;
        this.$key = this.columns.reduce((a1, c) => c.reduce((a2, x) => (a2 * 2n) + x, a1), 0n);
        return this.$key;
    }

    get(x, y) {
        if (x >= this.columns.length) {
            return 0;
        }
        return this.columns[x][y % 4];
    }

    set(x, y, value) {
        if (x >= this.columns.length) {
            this.columns.push([0n, 0n, 0n, 0n]);
        }
        this.columns[x][y % 4] = value;
    }

    trim() {
        const c = this.columns[0];
        if (!c[0] && !c[1] && !c[2] && !c[4]) {
            this.columns.shift();
        }
    }

    canMove(x, y) {
        if (! this.get(x, y))
            return false;
        if (this.get(x+1, y) || this.get(x+1, y+1))
            return false;
        return true;
    }

    *next()
    {
        for(let x = 0; x < this.columns.length; x++) {
            for(let y = 0; y < 4; y++) {
                if (this.canMove(x, y)) {
                    const newState = new State(this);
                    newState.set(x+1, y, 1n);
                    newState.set(x+1, y+1, 1n);
                    newState.set(x, y, 0n);
                    newState.trim();
                    yield newState;
                }
            }
        }
    }
}

function C0(N, callback)
{
    let states = new Map();
    let newStates = new Map();

    states.set(0, new State());
    while (N--) {
        newStates.clear();

        for(let state of states.values()) {
            for(let newState of state.next()) {
                newStates.set(newState.key, newState);
            }
        }

        [states, newStates] = [newStates, states];
        if (callback) {
            callback(states.size);
        }
    }

    return states.size;
}

function C(N)
{
    if (N < 8) {
        return C0(N);
    }

    const factors = [4, -2, 4, -5, -3, -1, 2,  2];
    const M = Matrix.fromRecurrence(factors);
    const I = new Matrix(M.rows, 1);

    for(let r = 0; r < M.rows; r++) {
        I.set(M.rows-1-r, 0, C0(2+r));
    }

    const m = M.pow(N-2, MODULO);
    const result = m.multiply(I, MODULO);

    return result.get(m.rows-1, 0);
}

assert.strictEqual(C(2), 2);
assert.strictEqual(C(10), 1301);
assert.strictEqual(C(20), 5895236);
assert.strictEqual(C(100), 125923036);

console.log('Tests passed');

const answer = C(MAX);
console.log(`Answer is ${answer}`);