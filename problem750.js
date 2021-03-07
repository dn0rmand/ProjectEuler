const assert = require('assert')
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

class Stack {
    constructor(position, min, max) {
        if (min > max) { throw "ERROR"; }
        this.position = position;
        this.min = min;
        this.max = max;
    }
}

class State {
    constructor(stacks, dragMoves) 
    {
        stacks.sort((s1, s2) => s1.position - s2.position);
        this.stacks = stacks;
        this.dragMoves  = dragMoves || 0;
        this.$key = undefined
    }

    get key() 
    { 
        if (this.$key === undefined) 
        {
            let s = '';//this.dragMoves;
            let previous = undefined;

            for (const stack of this.stacks) 
            {
                if (previous === undefined) {
                    s += `/${0}:${stack.min}:${stack.max}`;
                } else {
                    s += `/${stack.position-previous.position}:${stack.min}:${stack.max}`;
                }
                previous = stack;
            }
            this.$key = s;
        }
        return this.$key;
    }

    moves(maxMove, callback) {
        for(let i = 0; i < this.stacks.length; i++) {
            const si = this.stacks[i];

            for (let j = i+1; j < this.stacks.length; j++) {
                const sj = this.stacks[j];

                const drag = Math.abs(si.position-sj.position);
                if (drag > maxMove) {
                    break;
                }

                if (si.min === sj.max+1) {
                    const newStacks = this.stacks.slice();
                    newStacks[i] = new Stack(si.position, sj.min, si.max);
                    newStacks.splice(j, 1);
                    callback(new State(newStacks, this.dragMoves+drag));
                } else if (sj.min === si.max+1) {
                    const newStacks = this.stacks.slice();
                    newStacks[j] = new Stack(sj.position, si.min, sj.max);
                    newStacks.splice(i, 1);
                    callback(new State(newStacks, this.dragMoves+drag));
                }
            }
        }
    }
}

function arrangeCards(N)
{
    N = BigInt(N);
    const cards = [];

    // card(n) = 3^n % (N+1), 1 <= n <= N

    const visited = [];

    for (let i = 1n; i <= N; i++) {
        const card = Number((3n**i) % (N+1n));
        if (visited[card] !== undefined) {
            return [];
        }
        visited[card] = 1;
        cards.push(new Stack(Number(i-1n), card, card));
    }

    return cards
}

function G(N, trace)
{
    const startState = new State(arrangeCards(N));
    if (startState.stacks.length === 1) {
        return 0;
    }

    let states = new Map();
    let newStates = new Map();

    states.set(startState.key, startState);

    let result = Number.MAX_SAFE_INTEGER;

    const maxMove = N/2;

    const tracer = new Tracer(1000, trace);
    let stacks = N+1;
    while (states.size > 0) 
    {
        stacks--;

        newStates.clear();

        let count = states.size
        for(const state of states.values()) {

            tracer.print(_ => `${count} - ${newStates.size} - ${stacks}`);
            count--

            state.moves(maxMove, newState => {
                if (newState.stacks.length === 1) {
                    result = Math.min(result, newState.dragMoves);
                } else if (newState.dragMoves < result) {
                    const old = newStates.get(newState.key);
                    if (old === undefined || newState.dragMoves < old.dragMoves) {
                        newStates.set(newState.key, newState);
                    }
                }
            });
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    return result;
}

timeLogger.wrap('Testing', _ => {
    assert.strictEqual(G(6), 8);
    assert.strictEqual(G(16), 47);
    assert.strictEqual(G(18), 57);
    // assert.strictEqual(G(28), 149); // 39 seconds
    // assert.strictEqual(G(30), 154); // 14 minutes
});

let answer = timeLogger.wrap('G(30)', _ => G(30, true));
console.log(`Answer is ${answer}`);
