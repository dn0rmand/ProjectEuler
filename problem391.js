// Hopping Game
// ------------
// Problem 391 
// -----------
// Let sk be the number of 1’s when writing the numbers from 0 to k in binary.
// For example, writing 0 to 5 in binary, we have 0, 1, 10, 11, 100, 101. There are seven 1’s, so s5 = 7.
// The sequence S = {sk : k ≥ 0} starts {0, 1, 2, 4, 5, 7, 9, 12, ...}.

// A game is played by two players. Before the game starts, a number n is chosen. A counter c starts at 0. 
// At each turn, the player chooses a number from 1 to n (inclusive) and increases c by that number. 
// The resulting value of c must be a member of S. If there are no more valid moves, the player loses.

// For example:
// Let n = 5. c starts at 0.
// Player 1 chooses 4, so c becomes 0 + 4 = 4.
// Player 2 chooses 5, so c becomes 4 + 5 = 9.
// Player 1 chooses 3, so c becomes 9 + 3 = 12.
// etc.
// Note that c must always belong to S, and each player can increase c by at most n.

// Let M(n) be the highest number the first player can choose at her first turn to force a win, 
// and M(n) = 0 if there is no such move. For example, M(2) = 2, M(7) = 1 and M(20) = 4.

// Given Σ(M(n))3 = 8150 for 1 ≤ n ≤ 20.

// Find Σ(M(n))3 for 1 ≤ n ≤ 1000.

const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const BigMap = require('tools/BigMap');
const BigSet = require('tools/BigSet');

const MAX   = 1000;
const MAX_S = 1E6;

const $S = new BigMap();
const $SS = new BigSet();

let $maxS  = 0;
let $maxN = 0;

function S(n)
{
    if (n < 1) {
        return 0;
    }

    let s = $S.get(n)
    if (s !== undefined) {
        return s;
    }

    if (n & 1) {
        const m = (n-1)/2;
        s = 2*S(m) + m + 1;
    } else {
        const m = n / 2;
        s = S(m) + S(m-1) + m;
    }

    if (n > $maxN) {
        if (s > Number.MAX_SAFE_INTEGER) {
            throw "TOO BIG";
        }
        $maxS = s;
        $maxN = n;
    }

    $S.set(n, s);
    $SS.add(s);

    return s;
}

function isValid(c)
{
    if (c > $maxS) {
        while ($maxS < c) {
            const s = S($maxN+1);
            if (s === c) {
                return true;
            }
        }
        return false;
    } else {
        return $SS.has(c);
    }
}

function M(max, trace)
{
    class State {
        constructor(position, player)
        {
            this.position = position;
            this.player   = player;
            this.key      = position * player; 
        }

        *moves(direction = -1) {
            for(let i = 1; i <= max; i++) {
                const p = this.position + i*direction;
                if (isValid(p)) {
                    yield new State(p, -this.player); 
                }
            }
        }
    }

    // let idx = 1;

    // if (trace) {
    //     timeLogger.wrap('calculating start position', _ => {
    //         const t = new Tracer(1000, trace);
    //         let maxDiff = 0;
    //         // Find winning target
    //         while (S(idx+1)-S(idx) <= max) {
    //             maxDiff = Math.max(maxDiff, S(idx+1)-S(idx));
    //             idx++;
    //             t.print(_ => `${idx} - ${maxDiff}`);
    //         }
    //         t.clear();
    //     });
    // } else {
    //     while (S(idx+1)-S(idx) <= max) {
    //         idx++;
    //     }
    // }

    // const P1 = S(idx);
    const p = (2**max) * (max+1) - (max+1);

    let visited = new Set();
    let minVisited = p+1;

    let states = new Map();
    let newStates = new Map();
    let best = 0;

    const s = new State(p, -1);

    states.set(s.key, s);

    const tracer = new Tracer(10000, trace);
    while(states.size > 0) {
        tracer.print(_ => minVisited);

        newStates.clear();

        states.forEach(state => {
            if (state.player === 1) {
                visited.add(state.key);
                if (state.key < minVisited) {
                    minVisited = state.key;
                }
            }
        });

        if (visited.size > 1E4) {
            // Filter visited to last max values
            const maxVisited = minVisited + max + 1;

            let newVisited = new Set();
            visited.forEach(v => {
                if (v <= maxVisited) {
                    newVisited.add(v);
                }
            });

            visited = newVisited;
        }

        for(const state of states.values()) {
            if (state.player === -1 && state.position <= max && state.position > best) {
                best = state.position;
            }

            for(const newState of state.moves(-1)) {
                let good = true;
                if (newState.player === -1) {
                    for(const forward of newState.moves(1)) {
                        if (! visited.has(forward.key)) {
                            good = false;
                            break;
                        }
                    }
                }
                if (good) {
                    newStates.set(newState.key, newState);
                }
            }
        }

        [states, newStates] = [newStates, states];
    }
    tracer.clear();
    return best;
}

function solve(value)
{
    let total = 0;
    for(let n = value; n >= 1; n--)
    {
        process.stdout.write('\r'+n);
        let v = M(n);
        total += (v*v*v);
    }
    console.log('');
    return total;
}

const values = [0, 2, 1, 4, 2, 2, 1, 7, 5, 5, 7, 4, 13, 7, 15, 2, 9, 1, 7, 4, 15, 5, 9];
for(let i = values.length-1; i > 0; i--) {
    const v = values[i];
    const b = {};
    for(let mask = 1; mask <= i; mask *= 2) {
        if (i & mask) {
            b[mask] = values[mask];
        }
    }
    console.log(`M(${i})=${v} -> ${JSON.stringify(b)}`);
}
console.log(values.join(', '));

assert.strictEqual(M(2), 2);
assert.strictEqual(M(7), 1);
assert.strictEqual(M(4), 4);
assert.strictEqual(timeLogger.wrap('M(20)', _ => M(20, true)), 4);

// console.log(timeLogger.wrap('M(22)', _ => M(22, true)));
// console.log(timeLogger.wrap('M(22)', _ => M(22, false)));

// assert.strictEqual(solve(10), 683);
// assert.strictEqual(solve(13), 3287);
// assert.strictEqual(solve(20), 8150);

console.log('Tests passed');

// let answer = solve(MAX);

// console.log("Answer is " + answer + " (61029882288)");
// console.log('Done');

/*
0,2,1,4,2,2,1,7,5,5,7,4,13,7,15,2,9,1,7,4


0, 1, 2, 4, 5, 7, 9, 12, 13, 15, 17, 20, 22, 25, 28, 32, 33, 35, 37, 40, 42, 45, 48, 52, 54, 57, 60, 64, 67, 71, 75, 80

1
     L    W    L
0 -> 1 -> 2 -> 3
               true 
*/