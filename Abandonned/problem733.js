const assert = require('assert');

const {
    Tracer,
    TimeLogger: timeLogger,
} = require('@dn0rmand/project-euler-tools');

const MODULO = 1000000007;
const MAX = 1E3;

function* sequence() {
    const modulo = 10000019;

    let value = 1;
    while (true) {
        value = (value * 153) % modulo;
        yield value;
    }
}

function getValues(n) {
    const values = [];
    for (const v of sequence()) {
        values.push(v);
        if (values.length === n)
            break;
    }
    // values.sort((a, b) => a-b);
    return values;
}

// function prepare(values, trace)
// {
//     const map = [];

//     const tracer = new Tracer(trace, "Preparing");
//     for(let i = 0; i < values.length; i++)
//     {
//         tracer.print(_ => values.length-i);
//         const v = values[i];
//         const bigger = [];

//         for(let j = i+1; j < values.length; j++)
//         {
//             if (values[j] > v)
//                 bigger.push(values[j]);
//         }

//         map[v] = bigger;
//     }
//     tracer.clear();
//     return map;
// }

function S(n, trace) {
    const counts = [];
    const allValues = getValues(n);
    // const valuesMap = prepare(allValues, trace);

    const sequence = [];

    let total = 0;

    function process() {
        for (const v of sequence) {
            counts[v] = (counts[v] || 0) + 1;
        }

        const s = (sequence[0] + sequence[1] + sequence[2] + sequence[3]) % MODULO;
        total = (total + s) % MODULO;
    }

    function inner(index, count, previous) {
        if (count === 4) {
            process();
            return;
        }

        const tracer = new Tracer(trace);

        for (let i = index; i < allValues.length; i++) {
            tracer.print(_ => allValues.length - i);
            const v = allValues[i];
            if (v <= previous)
                continue;

            sequence[count] = v;
            inner(i + 1, count + 1, v);
        }

        tracer.clear();
    }

    inner(0, 0, 0);

    const c = allValues.map(v => `${v} = ${counts[v] || 0}`);
    console.log(c.join(', '));
    return total;
}

assert.strictEqual(S(6), 94513710);
assert.strictEqual(S(100), 4465488724217 % MODULO);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);