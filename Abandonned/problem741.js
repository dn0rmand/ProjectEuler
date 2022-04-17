const assert = require('assert');
const {
    Tracer,
    TimeLogger: timeLogger,
    BigMap
} = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007;

class State {
    constructor(width, cols, count) {
        this.count = count || 1;
        this.cols = cols || new Uint8Array(width);
        this.rows = [];
        this.width = width;
        this.$key = undefined;
    }

    get key() {
        if (this.$key === undefined) {
            this.$key = this.cols.reduce((a, v) => a * 4 + v, 0);
            if (this.$key > Number.MAX_SAFE_INTEGER)
                throw "TOO BIG";
        }
        return this.$key;
    }

    clone(i, j) {
        const state = new State(this.width, Uint8Array.from(this.cols), this.count);

        state.cols[i]++;
        state.cols[j]++;

        const row = 2 ** i + 2 ** j;

        state.rows = [...this.rows, row];

        return state;
    }

    get invalid() {
        return this.cols.some(v => v !== 2);
    }

    * add() {
        for (let i = 0; i < this.width; i++) {
            if (this.cols[i] + 1 > 2)
                continue;
            for (let j = i + 1; j < this.width; j++) {
                if (this.cols[j] + 1 > 2)
                    continue;

                yield this.clone(i, j);
            }
        }
    }

    get(x, y, rotation, flipped) {
        if (flipped) {
            x = this.width - 1 - x;
        }

        switch (rotation) {
            case 1: {
                [x, y] = [this.width - 1 - y, x];
                break;
            }
            case 2:
                x = this.width - 1 - x;
                y = this.width - 1 - y;
                break;
            case 3: {
                [x, y] = [y, this.width - 1 - x];
                break;
            }
        }

        const mask = 2 ** x;
        return (this.rows[y] & mask) === 0 ? 0 : 1;
    }

    dump() {
        console.log('');
        for (const r of this.rows) {
            let s = r.toString(2);
            while (s.length !== this.width)
                s = '0' + s;
            console.log(s)
        }
    }

    * getKeys() {
        const statuses = [{
                rotation: 0,
                flipped: false
            },
            {
                rotation: 1,
                flipped: false
            },
            {
                rotation: 2,
                flipped: false
            },
            {
                rotation: 3,
                flipped: false
            },

            {
                rotation: 0,
                flipped: true
            },
            {
                rotation: 1,
                flipped: true
            },
            {
                rotation: 2,
                flipped: true
            },
            {
                rotation: 3,
                flipped: true
            },
        ];

        const self = this;

        function getKey({
            rotation,
            flipped
        }) {
            let value = 0n;
            for (let y = 0; y < self.width; y++) {
                for (let x = 0; x < self.width; x++) {
                    value = value << 1n | BigInt(self.get(x, y, rotation, flipped));
                }
            }
            return value
        }

        for (const status of statuses) {
            yield getKey(status);
        }
    }
}

function g(n) {
    let states = new BigMap();
    let newStates = new BigMap();

    states.set(0, new State(n));

    const tracer = new Tracer(true);
    for (let i = 0; i < n; i++) {
        tracer.print(_ => `${n-i} - ${states.size}`);
        newStates.clear();
        let keys = 0
        for (const state of states.values()) {
            for (const newState of state.add()) {
                const key = keys++; // newState.key;
                newState.$key = key;
                // const old = newStates.get(key);
                // if (old) 
                // {
                //     old.count = (old.count + newState.count) % MODULO;
                //     old.parents = [...old.parents, ...newState.parents];
                // } 
                // else 
                {
                    newStates.set(key, newState);
                }
            }
        }
        [newStates, states] = [states, newStates];
    }
    tracer.clear();

    const used = new Set();

    let total = 0;

    const tracer2 = new Tracer(true);

    for (const state of states.values()) {
        tracer2.print(_ => total);
        const keys = state.getKeys();
        const data = keys.next();
        if (!used.has(data.value)) {
            tracer.clear();
            state.dump();
            total++;
            used.add(data.value);
            for (const key of keys) {
                used.add(key);
            }
        }
    }

    tracer2.clear();

    return total;
}

const $factorial = [1n, 1n];

function factorial(n) {
    if ($factorial[n])
        return $factorial[n];
    let result = 1n;
    for (let i = 2n; i <= n; i++) {
        result = result.modMul(i, MODULO);
        $factorial[i] = result;
    }
    return result;
}

// http://oeis.org/A001499
// a(n) = 4^(-n) * n!^2 * sum(i=0..n, (-2)^i * (2*n-2*i)! / (i!*(n-i)!^2)) )

function f(n) {
    n = BigInt(n);
    const modulo = BigInt(MODULO);

    const FOUR = 4n;
    const divisor = FOUR.modPow(n, modulo);
    const A2 = factorial(n).modPow(2n, modulo);
    let A3 = 0n;
    let a3 = 1n;
    let div = 1n;
    for (let i = 0n; i <= n; i++) {
        const f1 = a3.modMul(factorial(2n * (n - i)), modulo);
        const f2 = factorial(i).modMul(factorial(n - i).modPow(2n, modulo), modulo);

        A3 = A3.modMul(f2, modulo);
        A3 = (A3 + modulo + f1.modMul(div, modulo)) % modulo;
        div = div.modMul(f2, modulo);
        a3 *= -2n;
    }

    const result = A2.modMul(A3, modulo).modDiv(divisor.modMul(div, modulo), modulo);

    return Number(result);
}

// const values = [0, 1, 2, 20, 288, 8791, 390816, 23462347];

g(3);

assert.strictEqual(f(4), 90);
assert.strictEqual(f(7), 3110940);
assert.strictEqual(f(8), 187530840);

assert.strictEqual(g(4), 20);
assert.strictEqual(g(7), 390816);
// assert.strictEqual(g(8), 23462347);

const X = 13;
console.log(`f(${X}) =`, timeLogger.wrap(`f(${X})`, _ => fastF(X)));
console.log(`f(${X}) =`, timeLogger.wrap(`f(${X})`, _ => f(X)));

console.log('Tests passed');