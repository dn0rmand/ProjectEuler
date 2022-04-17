const assert = require('assert');
const {
    TimeLogger,
    Tracer,
    BigSet,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const MAX_PRIME = 2000000011;
const THRESHOLD = 30;
const BIG_THRESHOLD = Math.floor(Math.sqrt(MAX_PRIME)) * 10;

primeHelper.initialize(BIG_THRESHOLD);

function preloadInverse(prime, tracer) {
    const results = new Map();

    for (let i = 1; i < prime; i++) {
        tracer.print(_ => prime - i);
        if (results[i]) {
            continue;
        }
        const v = i.modInv(prime);
        results.set(i, v);
        results.get(v, i);
    }

    return results;
}

let inverse;
let multiply;
let prime;

function prepare($prime, $tracer) {
    if ($prime === prime) {
        return;
    }
    prime = $prime;
    multiply = (a, b) => a.modMul(b, prime);

    if (prime > 1E7) {
        inverse = value => value.modInv(prime);
    } else {
        const $cache = preloadInverse(prime, $tracer);

        inverse = value => $cache.get(value);
    }
}

const comparer = (a, b) => a - b;
const toBase36 = a => [...a].sort(comparer).map(v => v.toString(36)).join(':');
const isPrime = v => v === 1 || primeHelper.isPrime(v);

class MySet {
    constructor(current) {
        this.current = current;
    }

    has(value) {
        for (let c = this.current; c; c = c.next) {
            if (value === c.value) {
                return true;
            }
        }
        return false;
    }

    add(value) {
        this.current = {
            value: value,
            next: this.current
        }
    }

    * values() {
        for (let c = this.current; c; c = c.next) {
            yield c.value;
        }
    }

    clone() {
        return new MySet(this.current);
    }
}

class State {
    constructor(used, current, cost, product) {
        this.current = current.sort((a, b) => a - b);
        this.pairs = used;

        this.cost = cost;
        this.product = product;
    }

    static start(prime) {
        const used = new MySet();
        const current = [1, prime - 1];
        const cost = prime - 1 + (prime - 3) / 2;
        const product = BigInt(prime - 1);

        return new State(used, current, cost, product);
    }

    get key() {
        const a = toBase36(this.current);
        const b = toBase36(this.used.values());
        return a + '-' + b;
    }

    next(a1, a2, callback) {
        if (this.used.has(a1)) {
            return;
        }

        const [left, right] = this.current;

        const costA = multiply(left, a1);
        if (isPrime(costA)) {
            const diff = multiply(left, right);
            const costB = multiply(a2, right);

            const newCost = this.cost - 1 - diff + costA + costB;
            const newProd = (this.product / BigInt(diff)) * BigInt(costA) * BigInt(costB);

            const newUsed = this.used.clone();
            newUsed.add(a1);

            const state = new State(newUsed, [a2, right], newCost, newProd);

            callback(state);
        }
    }
}

function solve(prime, trace) {
    const tracer = new Tracer(trace);

    prepare(prime, tracer);

    const startState = State.start(prime, tracer);

    let states = new Map();
    let newStates = new Map();

    states.set(startState.key, startState);

    let best = startState;

    const threshold = prime === MAX_PRIME ? BIG_THRESHOLD : THRESHOLD;
    const isGoodCost = (cost) => true; //cost <= (best.cost + threshold);

    while (states.size > 0) {
        newStates.clear();

        for (let a1 = 2; a1 < prime - 1; a1++) {
            const a2 = inverse(a1);
            if (a2 < a1) {
                continue;
            }

            for (const state of states.values()) {
                tracer.print(_ => `${prime-a1} - ${states.size} - ${newStates.size}`);

                state.next(a1, a2, newState => {
                    if (newState && isGoodCost(newState.cost)) {
                        if (newState.cost < best.cost) {
                            best = newState;
                        }
                        const k = newState.key;
                        const o = newStates.get(k);
                        if (o) {
                            if (o.cost > newState.cost) {
                                o.cost = newState.cost;
                                o.product = newState.product;
                            }
                        } else {
                            newStates.set(k, newState);
                        }
                    }
                });
            }
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();

    if (prime === MAX_PRIME) {
        console.log(`Cost for ${prime} is ${best.cost}`);
    }
    return best.product;
}

assert.strictEqual(TimeLogger.wrap('5', _ => solve(5, true)), 4n);
assert.strictEqual(TimeLogger.wrap('11', _ => solve(11, true)), 10n);
// assert.strictEqual(TimeLogger.wrap('13', _ => solve(13, true)), 12n);
assert.strictEqual(TimeLogger.wrap('23', _ => solve(23, true)), 45n);
assert.strictEqual(TimeLogger.wrap('43', _ => solve(43, true)), 128n);
// assert.strictEqual(TimeLogger.wrap('53', _ => solve(53, true)), 1536n);
assert.strictEqual(TimeLogger.wrap('73', _ => solve(73, true)), 72n);
assert.strictEqual(TimeLogger.wrap('97', _ => solve(97, true)), 96n);
assert.strictEqual(TimeLogger.wrap('113', _ => solve(113, true)), 112n);

console.log('Tests passed');

// console.log(13431419535872807041n / 2000000011n);

const answer = TimeLogger.wrap(`${MAX_PRIME}`, _ => solve(MAX_PRIME, true));
console.log(`Answer is ${answer}`);