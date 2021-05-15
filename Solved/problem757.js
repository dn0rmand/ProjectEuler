const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');
const { quickSort } = require('sort-algorithms-js');

const MAX = 1E14;

function count(max, trace)
{
    const values = [];

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

    tracer.print(_ => `Sorting ... ${values.length} items`);
    const sorted = values.sort((a, b) => a-b);

    tracer.print(_ => 'Counting ...');
    let previous = 0;

    let answer = 0;
    for(const v of sorted) {
        if (v !== previous) {
            answer++;
            previous = v;
        }
    }

    tracer.clear();

    return answer;
}

assert.strictEqual(count(1E6), 2851);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => count(MAX, true));
console.log(`Answer is ${answer}`);
