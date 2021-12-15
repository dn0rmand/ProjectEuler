const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const linearRecurrence = require('tools/linearRecurrence');
const BigMap = require('tools/BigMap');
const BigSet = require('tools/BigSet');

const MODULO = 1E9;
const MAX = 10000;

class State
{
    static LIMIT = 32;
    static MAX_KEY = 1200n;
    static _keys = new BigMap();
    static _nextKey = 0n;

    static clearKeys()
    {
        State._nextKey = 0n;
        State._keys.clear();
    }

    static mapKey(key)
    {
        let k = State._keys.get(key);
        if (! k) {
            k = ++State._nextKey;
            if (k >= State.MAX_KEY) {
                throw "Too many keys";
            }
            State._keys.set(key, k);
        }
        return k;
    }

    constructor(previous)
    {
        this.map = new BigSet();
        if (previous) {
            previous.map.forEach(v => this.map.add(v));
            this.count = previous.count;
        } else {
            this.set(0, 0, 0, 1);
            this.count = 1;
        }        
    }

    decode(k) {
        const x = k % State.LIMIT;
        k = (k-x) / State.LIMIT;
        const y = k % State.LIMIT;
        const z = (k-y) / State.LIMIT;
        return {x, y, z };
    }

    encode(x, y, z) {
        return x + (y + z * State.LIMIT) * State.LIMIT;
    }

    static sort(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    get key() { 
        const keysA = [...this.map.values()].map(k => State.mapKey(k));
        return keysA.sort(State.sort)
                    .reduce((a, v) => a*State.MAX_KEY + v);
    }

    get keys() { 
        const values = [...this.map.values()]; 
        const keysA = values.map(k => State.mapKey(k))
                            .sort(State.sort)
                            .reduce((a, v) => a*State.MAX_KEY + v);
        const keysC = []; 
        const keysB = values.map(v => {
            const { x, y, z } = this.decode(v);
            keysC.push(this.encode(z, x, y));
            return this.encode(y, z, x);
        }).map(k => State.mapKey(k))
          .sort(State.sort)
          .reduce((a, v) => a*State.MAX_KEY + v);

        return [
            keysA, 
            keysB, 
            keysC.map(k => State.mapKey(k))
                 .sort(State.sort)
                 .reduce((a, v) => a*State.MAX_KEY + v)
        ];
    }

    get(x, y, z) {
        if (x > State.LIMIT || y > State.LIMIT || z > State.LIMIT) {
            throw "Growing too big"
        }
        const k = this.encode(x, y, z);
        return this.map.has(k);
    }

    set(x, y, z, value) {
        if (x > State.LIMIT || y > State.LIMIT || z > State.LIMIT) {
            throw "Growing too big"
        }
        const k = this.encode(x, y, z);
        if (value === 0)
            this.map.delete(k);
        else
            this.map.add(k);
    }

    canMove(x, y, z) {
        if (this.get(x+1, y, z) || this.get(x, y+1, z) || this.get(x, y, z+1))
            return false;
        return true;
    }

    next(callback)
    {
        this.map.forEach(k => {
            const {x, y, z} = this.decode(k);

            if (this.canMove(x, y, z)) {
                const newState = new State(this);
                newState.set(x+1, y, z, 1);
                newState.set(x, y+1, z, 1);
                newState.set(x, y, z+1, 1);
                newState.set(x, y, z, 0);

                callback(newState);
            }
        });
    }
}

function D(N, trace, callback)
{
    let states = new BigMap();
    let newStates = new BigMap();

    states.set(0, new State());

    const tracer = new Tracer(1, trace);
    while (N--) {
        tracer.print(_ => N+1);
        newStates.clear();
        State.clearKeys();

        let s = states.size;
        const tracer2 = new Tracer(10000, trace);
        for(let state of states.values()) {
            tracer2.print(_ => s);
            s--;
            state.next(newState => {
                // const [keya, keyb, keyc] = newState.keys;
                let old = newStates.get(keya);
                if (! old) {
                    old = newStates.get(keyb);
                }
                if (! old) {
                    old = newStates.get(keyc);
                }
                if (old) {
                    if (keya === keyb && keya === keyc) {
                        old.count = 1;
                    } else {
                        old.count = 3;
                    }
                } else {
                    newStates.set(keya, newState);
                }
            });
        }
        tracer2.clear();
        [states, newStates] = [newStates, states];
        if (callback) {
            tracer.clear();
            let total = 0;
            for(s of states.values())
                total += s.count;
            callback(total);
        }
    }
    tracer.clear();

    let total = 0;
    for(s of states.values())
        total += s.count;
    return total;
}

function analyze()
{
    const values = [];

    C(18, size => { 
        values.push(size); 
    });

    values.shift();
    console.log(values.join(', '));
    const { factors, divisor } = linearRecurrence(values);

    console.log(factors, divisor);
}

// function D(N)
// {
//     if (N < 8) {
//         return C0(N);
//     }

//     const factors = [4, -2, 4, -5, -3, -1, 2,  2];
//     const M = Matrix.fromRecurrence(factors);
//     const I = new Matrix(M.rows, 1);

//     for(let r = 0; r < M.rows; r++) {
//         I.set(M.rows-1-r, 0, C0(2+r));
//     }

//     const m = M.pow(N-2, MODULO);
//     const result = m.multiply(I, MODULO);

//     return result.get(m.rows-1, 0);
// }

assert.strictEqual(D(2), 3);

const values = [];
D(20, true, size => {
    values.push(size);
    console.log(values.join(', '));
});

values.shift();
values.shift();
const ln = linearRecurrence(values);
console.log(ln);

assert.strictEqual(timeLogger.wrap('', _ => D(10)), 44499);
console.log(timeLogger.wrap('D(14)', _ => D(14, true)));

console.log('Tests passed');

// const answer = C(MAX);
// console.log(`Answer is ${answer}`);

// 1, 3, 9, 30, 99, 336, 1134, 3855, 13086, 44499, 151263, 514419, 1749267, 5949063, 20231571, 68805717