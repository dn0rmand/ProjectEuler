const assert = require('assert');
const {
    TimeLogger,
    Tracer,
    primeHelper,
    BigMap,
} = require('@dn0rmand/project-euler-tools');

const MAX_PRIME = 2000000011;

TimeLogger.wrap('Loading primes', _ => primeHelper.initialize(Math.min(1E8, MAX_PRIME)));

let inverse;
let multiply;
let prime;

function prepare($prime) {
    if ($prime !== prime) {
        prime = $prime;
        multiply = (a, b) => a.modMul(b, prime);
        inverse = value => value.modInv(prime);
    }
}

const isPrime = v => v === 1 || primeHelper.isPrime(v);

class State {
    constructor(current, cost, product) {
        this.current = current;
        this.cost = cost;
        this.product = product;
    }

    get key() {
        return this.current;
    }

    static start(prime) {
        const cost = prime - 1 + (prime - 3) / 2;
        const product = BigInt(prime - 1);

        return new State(1, cost, product);
    }

    split(a1, a2) {
        const costA = multiply(this.current, a1);
        if (isPrime(costA)) {
            const diff = multiply(this.current, prime - 1);
            const costB = multiply(a2, prime - 1);

            const newCost = this.cost - 1 - diff + costA + costB;
            const newProd = (this.product / BigInt(diff)) * BigInt(costA) * BigInt(costB);

            const state = new State(a2, newCost, newProd);

            return state;
        }
    }
}

function solve(prime, trace) {
    const tracer = new Tracer(trace);

    prepare(prime);

    const startState = State.start(prime);

    let states = new BigMap();

    states.set(startState.key, startState);

    const THRESHOLD = (prime + 1) / 2;
    let best = startState;
    let isGoodCost = cost => cost <= (best.cost + THRESHOLD);

    const add = newState => {
        if (!newState || !isGoodCost(newState.cost)) {
            return;
        }

        if (newState.cost < best.cost) {
            best = newState;
        }

        const old = states.get(newState.key);
        if (old) {
            if (old.cost > newState.cost) {
                states.set(newState.key, newState);
            }
        } else {
            states.set(newState.key, newState);
        }
    }

    for (let steps = (prime - 1) / 2, a1 = 2; a1 < prime - 1; steps--, a1++) {
        const a2 = inverse(a1);
        tracer.print(_ => `${steps}: ${states.size}`);

        if (a2 > a1) {
            states.forEach(state => {
                if (state.current !== a2) {
                    const left = state.split(a1, a2);
                    add(left, states);
                }
            });
        }
    }

    tracer.clear();

    return best.product;
}


assert.strictEqual(TimeLogger.wrap('5', _ => solve(5)), 4n);
assert.strictEqual(TimeLogger.wrap('11', _ => solve(11)), 10n);
assert.strictEqual(TimeLogger.wrap('13', _ => solve(13)), 12n);
assert.strictEqual(TimeLogger.wrap('23', _ => solve(23)), 45n);
assert.strictEqual(TimeLogger.wrap('43', _ => solve(43)), 128n);
assert.strictEqual(TimeLogger.wrap('53', _ => solve(53)), 105n);
assert.strictEqual(TimeLogger.wrap('73', _ => solve(73)), 72n);
assert.strictEqual(TimeLogger.wrap('97', _ => solve(97)), 96n);
assert.strictEqual(TimeLogger.wrap('113', _ => solve(113)), 112n);

console.log('Tests passed');

const answer = TimeLogger.wrap(`${MAX_PRIME}`, _ => solve(MAX_PRIME, true));
console.log(`Answer is ${answer}`);