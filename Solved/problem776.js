const assert = require('assert');
const PreciseNumber = require('tools/preciseNumber');

function format(value)
{
    return value.toPrecision(13).replace('e+','e');
}

class State
{
    constructor(sum, digitSum, count, under, index) 
    {
        this.sum        = sum;
        this.digitSum   = digitSum;
        this.count      = count;
        this.under      = under;
        this.index      = index;

        this.key = `${digitSum}:${this.under?1:0}`;
    }

    addDigit(digit, digits) 
    {
        const factor = 10n ** BigInt(this.index);

        const under = digit < digits[this.index]
                        ? true 
                        : (digit > digits[this.index] ? false : this.under );
        const sum = this.sum + this.count*digit*factor;
        const digitSum = this.digitSum + digit;

        return new State(sum, digitSum, this.count, under, this.index+1);
    }
}

function F(N)
{
    N = BigInt(N);

    let states    = new Map();
    let newStates = new Map();
    let position  = 0n;
    states.set(0n, new State(0n, 0n, 1n, true, 0));

    const digits = `${N}`.split('').map(v => +v).reverse();

    while (position < digits.length) {
        newStates.clear();

        for(const state of states.values()) {
            for(let digit = 0n; digit < 10n; digit++) {
                const newState = state.addDigit(digit, digits);
                const old = newStates.get(newState.key);
                if (old) {
                    old.count += newState.count;
                    old.sum   += newState.sum;
                } else {
                    newStates.set(newState.key, newState);
                }
            }
        }
        [states, newStates] = [newStates, states];
        position++;
    }

    let total = PreciseNumber.Zero;
    states.forEach(({ sum, digitSum, under }) => {
        if (sum && digitSum && under) {
            total = total.plus(PreciseNumber.create(sum, digitSum));
        }
    });

    return format(total.valueOf());
}

assert.strictEqual(F(123), "1187.764610390");
assert.strictEqual(F(12345), "4855801.996238");
console.log('Tests passed');

console.log(F(1234567890123456789));
