const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const matrix = require('@dn0rmand/project-euler-tools/src/matrix');
const linearRecurrence = require('@dn0rmand/project-euler-tools/src/linearRecurrence');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1E9;
const MODULO_N = BigInt(1E9);
const MAX = 1E14;

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

    let states = new Map();
    let newStates = new Map();
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

function findRecurrence(start, end, getValue, minSize, trace) 
{
    const values = [];

    for(let n = start; n <= end; n++) {
        values.push(getValue(n));
    }

    const l = linearRecurrence(values, minSize, trace);
    const M = matrix.fromRecurrenceWithSum(l.factors);
    const id = new matrix(M.rows, 1);
    const offset = M.rows-1;

    let sum = 0n;
    for(let r = 0; r < M.rows-1; r++) 
    {
        const v = getValue(offset-r);
        sum += v;
        id.set(r, 0, v);
    }
    id.set(M.rows-1, 0, sum);

    return { M , id };
}

const { M, id } = findRecurrence(2, 18, n => BigInt(bruteF(n)));

function calculate(n)
{
    if (n < 1) {
        return { f: 0n };
    }
    if (n <= 8) {
        return { f: BigInt(bruteF(n)) };
    }

    const offset = M.rows - 1;
    const m = M.pow(n-offset);
    const result = m.multiply(id);

    return { f: result.get(0, 0), sum: result.get(m.rows-1, 0) };
}

function F(n)
{
    const f = calculate(n).f;
    return f;
}

function squares(max)
{
    const { M, id } = findRecurrence(9, 81, n => F(n)**2n, false);

    const OFFSET = M.rows-1;
    const m = M.pow(max-OFFSET, MODULO);
    const result = m.multiply(id, MODULO);

    const x = result.get(0, 0);
    const y = result.get(m.rows-1, 0);  

    console.log(`${x}, ${y}`);
}

function cubes(max)
{
    const { M, id } = timeLogger.wrap('findRecurrence', _ => findRecurrence(100, 500, n => F(n)**3n, true, true));

    const OFFSET = M.rows-1;
    const m = M.pow(max-OFFSET, MODULO);
    const result = m.multiply(id, MODULO);

    const answer = result.get(m.rows-1, 0);  

    return answer;
}

// squares();

function f(n)
{
    const f = Number(calculate(n).f % MODULO_N);
    return f;
}

assert.strictEqual(f(6), 14);
assert.strictEqual(f(10), 254);
assert.strictEqual(f(20), 453355);
assert.strictEqual(f(25), 19138115);
assert.strictEqual(f(30), 807895636);
assert.strictEqual(f(40), 682432976);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => cubes(MAX));
console.log(`Answer is ${answer}`);