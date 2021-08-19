const assert = require('assert');
const BigMap = require('tools/BigMap');
const Tracer = require('tools/tracer');
const matrix = require('tools/matrix-small');
const linearRecurrence = require('tools/linearRecurrence');

require('tools/numberHelper');

const MODULO = 1E9;

class State
{
    constructor(other)
    {
        this.max = other.max;
        this.visited = other.visited;
        this.count = other.count;
        this.position = other.position;
    }    

    get key() {
        if (this.$key === undefined) {
            this.$key = `${this.position}:${this.visited}`;
        }

        return this.$key;
    } 

    clone()
    {
        return new State(this);
    }

    get impossible() {
        if (this.position === this.max) {
            return true;
        }
        if (this.position+3 >= this.max) {
            return false;
        }

        return (this.isVisited(this.max-1) && this.isVisited(this.max-2) && this.isVisited(this.max-3));
    }

    isVisited(index) {
        const mask = 2n ** BigInt(index);
        return this.visited & mask;
    }

    setVisited(index) {
        const mask = 2n ** BigInt(index);
        this.visited |= mask;
    }

    jump(distance)
    {
        const target = this.position+distance;
        if (target < 1 || target > this.max) 
            return undefined;

        if (this.isVisited(target))
            return undefined;

        const r = this.clone();
        r.position = target;
        r.setVisited(target);

        return r;
    }
}

const $brute = [0, 1];

function bruteF(n)
{
    if ($brute[n] !== undefined) {
        return $brute[n];
    }
    const start = new State({ max: n, position: 1, visited: 2n, count: 1 });

    let states = new BigMap();
    let newStates = new BigMap();
    let total = 0;

    states.set(start.key, start);

    let steps = n;
    while(states.size > 0) {
        newStates.clear();

        steps--;

        for(const state of states.values()) {
            for(const distance of [-3, -2, -1, 1, 2, 3]) {
                const newState = state.jump(distance);
                if (! newState)
                    continue;

                if (steps === 1) {
                    if (newState.position === n) {
                        total += newState.count;
                    }                    
                } else if (newState.impossible) {
                    continue; // no cigar
                } else {
                    const key = newState.key;
                    const old = newStates.get(key);
                    if (old) {
                        old.count += newState.count;
                    } else {
                        newStates.set(key, newState);
                    }
                }
            }
        }

        [states, newStates] = [newStates, states];
    }

    $brute[n] = total;
    return total;
}

function prepare()
{
    const values = [];

    for(let i = 2; i < 18; i++) 
    {
        values.push(bruteF(i));
    }

    const l = linearRecurrence(values);
    const M = matrix.fromRecurrenceWithSum(l.factors);
    const id = new matrix(M.rows, 1);

    let sum = 0;
    for(let r = 0; r < M.rows-1; r++) {
        const v = bruteF(8-r);
        sum += v;
        id.set(r, 0, v);
    }
    id.set(M.rows-1, 0, sum);
    return { M, id };
}

const { M, id } = prepare();

function calculate(n)
{
    if (n < 8) {
        return { f: bruteF(n) };
    }

    const m = M.pow(n-8, MODULO);
    const result = m.multiply(id, MODULO);

    return { f: result.get(0, 0), sum: result.get(m.rows-1, 0) };
}

function F(n)
{
    return calculate(n).f;
}

assert.strictEqual(calculate(1E6).sum, 76247083);

assert.strictEqual(F(6), 14);
assert.strictEqual(F(10), 254);
assert.strictEqual(F(20), 453355);
assert.strictEqual(F(25), 19138115);
assert.strictEqual(F(30), 807895636);
assert.strictEqual(F(40), 682432976);

console.log('Tests passed');

console.log(F(1E14));