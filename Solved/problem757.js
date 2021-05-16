const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const DistinctCollection = require('tools/distinctCollection');

const MAX = 1E14;

function count(max, trace)
{
    const values = new DistinctCollection();

    const tracer = new Tracer(1, trace);
    const m = Math.floor(Math.sqrt(max));

    for(let x = 1; ; x++) {
        const p1 = x*(x+1);
        const n1 = p1*p1;

        if (n1 > max) break;

        tracer.print(_ => m-p1);
        values.push(n1)

        for(let y = x+1; ; y++) {            
            const n2 = p1 * y * (y+1);
            if (n2 > max) break;

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
