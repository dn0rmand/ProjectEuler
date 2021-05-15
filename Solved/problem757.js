const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

const MAX = 1E14;

class DistinctCollection
{
    static HASHCODE = 2**23-1;
    constructor()
    {
        this.length = 0;
        this.buckets = new Array(DistinctCollection.HASHCODE+1);
    }

    push(value) {
        const h = value & DistinctCollection.HASHCODE;
        const b = this.buckets[h];
        if (b === undefined) {
            this.buckets[h] = [value];
            this.length++;
        } else {
            if (! b.includes(value)) {
                b.push(value);
                this.length++;
            }
        }
    }
}

function count(max, trace)
{
    const values = new DistinctCollection();

    const tracer = new Tracer(1, trace);
    const m = Math.floor(Math.sqrt(max));

    for(let x = 1; ; x++) {
        const p1 = x*(x+1);
        const n1 = p1*p1;

        if (n1 > max) {
            break;
        }

        tracer.print(_ => m-p1);
        values.push(n1)

        for(let y = x+1; ; y++) {            
            const p2 = y*(y+1);
            const n2 = p1*p2;
            if (n2 > max) {
                break;
            }

            values.push(n2);
        }
    }

    let answer = values.length;

    tracer.clear();

    return answer;
}

assert.strictEqual(count(1E6), 2851);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => count(MAX, true));
console.log(`Answer is ${answer}`);
