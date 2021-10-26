const assert = require('assert');
const timeLogger = require('tools/timeLogger');

const MAX = 1E8;
const MODULO = 1000000007n;

class Sequence
{
    constructor(size) 
    {
        let total = 0n;
        let last = 0n;
        let sequence = [0n];

        for(let i = 1; i < size; i++) {
            last = (last*last + 45n) % MODULO;
            total += last;

            sequence.push(last);
            while (sequence.length > 3) {
                const p3 = sequence[sequence.length-1];
                const p2 = sequence[sequence.length-2];
                const p1 = sequence[sequence.length-3];

                if (p1 < p2 && p2 > p3) {
                    sequence.pop();
                    sequence.pop();
                    sequence.pop();
                    sequence.push(p1-p2+p3);
                } else {
                    break;
                }
            }
        }

        this.sequence = sequence;
        this.total    = total;
        this.step     = 1n;
        this.left     = 0;        
        this.right    = sequence.length-1;
    }

    get finished() { return this.left > this.right; }

    next()
    {
        let delta;
        if (this.sequence[this.left] > this.sequence[this.right]) {
            delta = this.sequence[this.left] * this.step;
            this.step = -this.step;
            this.left++;
        } else {
            delta = this.sequence[this.right] * this.step;
            this.step = -this.step;
            this.right--;
        }
        return delta;
    }
}

function F(n, trace)
{    
    const sequence = 
        trace ? timeLogger.wrap(`Building Sequence of size ${n}`, _ => new Sequence(n))
              : new Sequence(n);

    let total = sequence.total;

    while (! sequence.finished) {
        total += sequence.next();
    }

    return total / 2n;
}

assert.strictEqual(F(2), 45n);
assert.strictEqual(F(4), 4284990n);
assert.strictEqual(F(100), 26365463243n);
assert.strictEqual(F(10000, true), 2495838522951n);

console.log('Tests passed');

const answer = F(MAX, true);
console.log(`Answer is ${answer}`);
