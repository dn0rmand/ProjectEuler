const assert = require('assert');

require('tools/numberHelper');

const MODULO = 1000000009;
const MAX_M  = 765432;
const MAX_R  = 234567;

function product(a, b)
{
    let value  = 0;
    let factor = 1;
    while (a > 0 && b > 0) {
        const da = a % 10;
        const db = b % 10;

        const c = (da * db) % 10;

        value += c*factor;
        a = (a - da) / 10;
        b = (b - db) / 10;
        factor *= 10;
    }
    return value;
}

const $sequence = new Map();
let $M = -1;

function F(R, M)
{
    if (M !== $M) {
        $M = M;
        $sequence.clear();
    }

    function sequence(value, remaining)
    {
        if (!remaining) {
            return BigInt(value);
        }

        const k = `${remaining}:${value}`;
        let total = $sequence.get(k);
        if (total !== undefined) {
            return total;
        }

        total = 0n;
        for(let x = 0; x <= M; x++) {
            if (value === undefined) {
                total = (total + sequence(x, remaining-1));
            } else {
                const v = product(x, value);
                total = (total + sequence(v, remaining-1));
            }
        }

        $sequence.set(k, total);
        return total;
    }

    let sum = sequence(undefined, R);
    return sum;
}

class ProductState
{
    constructor(value, count, under)
    {
        this.value = value;
        this.count = count;
        this.under = under;

        this.key = `${this.value}:${this.under}`;
    }

    get sum()
    {
        return this.value.modMul(this.count % MODULO);
    }

    static cases(M, R, maxDigit)
    {
        let states = new Map();
        let newStates = new Map();

        states.set(0, new ProductState(1, 1, -1));

        let count = 1 + (M - (M % 10))/10;
        for(let r = 0; r < R; r++) {
            newStates.clear();
            for(const state of states.values()) { 
                for(let digit = 0; digit < 10; digit++) {
                    const d = (state.value * digit) % 10;
                    const c = state.count.modMul(count, MODULO);
                    const u = digit < maxDigit 
                                ? -1 
                                : digit === maxDigit 
                                    ? state.under
                                    : 1;

                    const newState = new ProductState(d, c, u);
                    const o = newStates.get(newState.key);
                    if (o) {
                        o.count = (o.count + newState.count) % MODULO;
                    } else {
                        newStates.set(newState.key, newState);
                    }
                }
            }
            [states, newStates] = [newStates, states];
        }

        return states.values();
    }
}

class State
{
    constructor(sum, index, under) 
    {
        this.sum   = sum;
        this.under = under;
        this.index = index;
        this.key = `${under?1:0}`;
    }

    add(p) 
    {
        const factor = 10 ** this.index;
        const toAdd  = p.sum.modMul(factor, MODULO);
        const under  = p.under < 0
                          ? true 
                          : (p.under > 0 ? false : this.under);
        const sum    = (this.sum + toAdd) % MODULO;

        return new State(sum, this.index+1, under);
    }
}

function F1(R, M)
{
    const digits = `${M}`.split('').map(v => +v).reverse();
    
    let states    = new Map();
    let newStates = new Map();

    states.set(0, new State(0, 0, true));

    let position  = 0;

    while (position < digits.length) {
        newStates.clear();

        const products = ProductState.cases(M, R, digits[position]);

        for(const state of states.values()) {
            for(const p of products) {
                const newState = state.add(p);
                const old = newStates.get(newState.key);
                if (old) {
                    old.sum = (old.sum + newState.sum) % MODULO;
                } else {
                    newStates.set(newState.key, newState);
                }
            }
        }
        [states, newStates] = [newStates, states];
        position++;
    }

    let total = 0
    states.forEach(({ sum, under }) => {
        if (under) {
            total = (total + sum) % MODULO;
        }
    });

    return total;
}

const values = [];

for(let i = 1; i < 20; i++) {
    values.push(F(i, 999));
}
const LN = require('tools/linearRecurrence');
console.log(LN(values));

assert.strictEqual(product(234, 765), 480);
assert.strictEqual(F1(2, 7), 204);
assert.strictEqual(F(23, 76), 5870548);

console.log('Tests passed');

// const answer = F(234567, 765432);
// console.log(`Answer is ${answer}`);

// 400,1200,400,1200,900,1200,400,1200,400
// 16000, 112000, 16000, 112000, 61000, 112000, 16000, 112000, 16000
