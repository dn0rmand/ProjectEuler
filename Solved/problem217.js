const assert = require("assert");
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 3**15;
 
class State
{
    constructor()
    {
        this.$key = undefined; 
    }

    static startState()
    {
        const state = new State();

        state.leftDigitSum  = 0;
        state.rightDigitSum = 0;
        state.leftSum       = 0;
        state.rightSum      = 0;
        state.count         = 1;

        return state;
    }

    get key() 
    {
        if (this.$key === undefined) {
            this.$key = `${this.leftDigitSum}:${this.rightDigitSum}`;            
        }

        return this.$key;
    }

    get isBalanced()
    {
        return this.leftDigitSum === this.rightDigitSum; 
    }

    clone() 
    {
        const state = new State();

        state.leftDigitSum = this.leftDigitSum;
        state.rightDigitSum= this.rightDigitSum;
        state.leftSum      = this.leftSum;
        state.rightSum     = this.rightSum;
        state.count        = this.count;

        return state;
    }

    add2Digit(leftDigit, rightDigit, factor)
    {
        const state = this.clone();

        state.leftDigitSum  += leftDigit;
        state.rightDigitSum += rightDigit;

        state.leftSum  = (state.leftSum.modMul(10, MODULO) + state.count.modMul(leftDigit, MODULO)) % MODULO;
        state.rightSum = (factor.modMul(rightDigit, MODULO).modMul(state.count, MODULO) + state.rightSum) % MODULO;

        return state;
    }
}

function solve(digits, trace)
{
    let state = State.startState();

    let states = new Map();
    let newStates = new Map();

    states.set(state.key, state);

    let total  = 0;
    let factor = 1;
    let digitCount = 0;

    const tracer = new Tracer(1, trace);

    while (states.size > 0) {
        tracer.print(_ => `${digits-digitCount} - ${states.size}`);

        newStates.clear();
        for(const state of states.values()) {
            if (state.isBalanced) {
                const sum = (state.leftSum.modMul(factor, MODULO) + state.rightSum) % MODULO;
                total = (total + sum) % MODULO;
            }
            
            if (state.isBalanced && digitCount+1 <= digits) {
                for(let digit = 0; digit < 10; digit++) {
                    const left = (state.leftSum.modMul(10, MODULO) + state.count.modMul(digit, MODULO)) % MODULO;
                    const sum = (left.modMul(factor, MODULO) + state.rightSum) % MODULO;
                    total = (total + sum) % MODULO;
                }
            }

            if (digitCount + 2 <= digits) {
                for(let l = factor === 1 ? 1 : 0; l < 10; l++) {
                    for(let r = 0; r < 10; r++) {
                        const newState = state.add2Digit(l, r, factor);
                        const old = newStates.get(newState.key);
                        if (old) {
                            old.leftSum  = (old.leftSum + newState.leftSum) % MODULO;
                            old.rightSum = (old.rightSum + newState.rightSum) % MODULO;
                            old.count    = (newState.count + old.count) % MODULO;
                        } else {
                            newStates.set(newState.key, newState);
                        }
                    }
                }
            }
        }

        digitCount += 2;
        factor      = factor.modMul(10, MODULO);

        [states, newStates] = [newStates, states];
    }

    tracer.clear();
    return total;
}

assert.strictEqual(solve(1), 45);
assert.strictEqual(solve(2), 540);
assert.strictEqual(solve(5), 334795890 % MODULO);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => solve(47, true));
console.log(`Answer is ${answer}`);