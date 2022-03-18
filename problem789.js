const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const Tracer = require('tools/tracer');
const BigSet = require('tools/BigSet');

require('tools/numberHelper');

const MAX_PRIME = 104729; 
const TARGET = 2000000011; 
const THRESHOLD = 30;

function preloadInverse(prime) {
    const results = new Map();

    for(let i = 1; i < prime; i++) {
        if (results[i]) {
            continue;
        }
        const v = i.modInv(prime);
        results.set(i, v);
        results.get(v, i);
    }

    return results;
}

const MOD_INV = (prime) => {
    if (prime === MAX_PRIME) {
        return value => value.modInv(prime);
    } else {
        const $cache = preloadInverse(prime);
        return value => $cache.get(value); 
        // return value => value.modInv(prime);
    }
};
const MOD_MUL = (prime) => (a, b) => a.modMul(b, prime);

let inverse;
let multiply;

class State {
    constructor(free, current, cost, product) {
        this.current = current;
        this.free    = free;
        this.cost    = cost;
        this.product = product;
    }

    static start(prime, tracer) {
        const used = new BigSet();

        const current = [1, prime-1];
        const cost    = prime - 1 + (prime-3)/2;
        const product = prime-1;
        const free    = [];

        for(let i = 2; i < prime-1; i++) {
            tracer.print(_ => prime-1-i);

            if (used.has(i)) {
                continue;
            }
            const inv = inverse(i);
            free.push(i);
            used.add(i);
            used.add(inv);
        }

        return new State(free, current, cost, product);
    }

    get key() {
        const a = this.current.map(v => v.toString(36)).join(':');
        const b = this.free.map(v => v.toString(36)).join(':');
        return a+'-'+b;
    }

    createState(a1, a2, free) {
        const [left, right] = this.current;
        const diff = multiply(left, right);

        const newCost = this.cost - 1 - diff + multiply(a1, left) + multiply(a2, right);
        const newProd = (this.product / diff) * multiply(a1, left) * multiply(a2, right);

        return new State(free, [a2, right], newCost, newProd);
    }

    next(bestCost, callback) {
        for(const a1 of this.free) {
            const newFree = this.free.filter(a => a !== a1);
            const a2 = inverse(a1);

            const s1 = this.createState(a1, a2, newFree);
            const s2 = this.createState(a2, a1, newFree);

            const s = s1.cost > s2.cost ? s2 : s1;
            if (s.cost <= bestCost()) {
                callback(s);
            } else {
                callback();
            }
            // if (s1.cost <= bestCost()) {
            //     callback(s1);
            // }
            // if (s2.cost <= bestCost()) {
            //     callback(s2);
            // }
        }
    }
}

function solve(prime, trace)
{
    const tracer = new Tracer(1, trace);

    inverse = MOD_INV(prime);
    multiply = MOD_MUL(prime);

    const startState = State.start(prime, tracer);
    
    let states = new Map();
    let newStates = new Map();

    states.set(startState.key, startState);

    let best = startState;

    let count = startState.free.length;

    const bestCost = () => best.cost+THRESHOLD;

    while(states.size > 0) {
        newStates.clear();
        let size = states.size*count;

        for(const state of states.values()) {
            if (state.cost > bestCost()) {
                size -= count;
                continue;
            }
            state.next(bestCost, newState => {
                tracer.print(_ => `${count} - ${size} - ${newStates.size}`);
                size--;
                if (! newState) {
                    return;
                }
                if (newState.cost < best.cost) {
                    best = newState;                    
                }
                if (newState.free.length === 0) {
                    return;
                }
                const k = newState.key;
                const o = newStates.get(k);
                if (!o || o.cost > newState.cost) {
                    newStates.set(k, newState);
                }                
            });
        }

        [states, newStates] = [newStates, states];
        count--;
    }
    tracer.clear();

    // console.log(`Cost for ${prime} is ${best.cost}`);
    return best.product;
}

assert.strictEqual(solve(23), 45);
assert.strictEqual(solve(5), 4);
assert.strictEqual(solve(11), 10);
assert.strictEqual(solve(13), 12);

assert.strictEqual(timeLogger.wrap('53', _ => solve(53, true)), 1536); // 29

assert.strictEqual(timeLogger.wrap('43', _ => solve(43, true)), 128);
assert.strictEqual(timeLogger.wrap('73', _ => solve(73, true)), 72);
assert.strictEqual(timeLogger.wrap('97', _ => solve(97, true)), 96);
assert.strictEqual(timeLogger.wrap('113', _ => solve(113, true)), 112);

console.log('Tests passed');

// console.log(13431419535872807041n / 2000000011n);

const answer = timeLogger.wrap(`${MAX_PRIME}`, _ => solve(MAX_PRIME, true));
console.log(`Answer is ${answer}`);

// answer is k*p - 1
