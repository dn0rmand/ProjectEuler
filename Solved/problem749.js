const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

function S(N, trace) 
{
    const MAX = Math.min(Number.MAX_SAFE_INTEGER, (10**N));

    let total = 0;
    let maxK  = 1;

    for (let k = 2; ; k++) {
        if (2 ** k > MAX) {
            maxK = k;
            break;
        }
    }

    function *getSets(current, data) 
    {
        if (data.length === N) {
            yield data.slice();
            return;
        }

        for(let d = current; d < 10; d++) {
            data.push(d);
            yield *getSets(d, data);
            data.pop();
        }
    }

    function validate(digits, sum) 
    {
        if (sum >= MAX)
            return false;

        const digits2 = [];

        let s = sum;
        while (s > 0) {
            const d = s % 10;
            if (! digits.includes(d)) {
                return false;
            }
            digits2.push(d);
            s = (s - d)/10;
        }

        while (digits2.length < N) {
            digits2.push(0)
        }

        digits2.sort((a, b) => a-b);
        for(let i = 0; i < N; i++) {
            if (digits[i] !== digits2[i]) {
                return false;
            }
        }

        total += sum;
        return true;
    }

    function check(digits, k) 
    {
        const sum = digits.reduce((a, v) => a + (v**k), 0);
        if (sum < 10 || sum > MAX) 
            return false;

        return validate(digits, sum-1) || validate(digits, sum+1);
    }

    const tracer = new Tracer(1000, trace);

    tracer.print(_ => "loading digit sets");
    const sets = timeLogger.wrap('', _ => [...getSets(0, [])]);

    for(let i = 0; i < sets.length; i++) {
        tracer.print(_ => sets.length-i);
        const set = sets[i];
        for (let k = 2; k < maxK; k += 2) {
            if (check(set, k)) {
                break;
            }
        }
    }
    tracer.clear();

    return total;
}

// S(16);

timeLogger.wrap('S(2)', _ => assert.strictEqual(S(2), 110));
timeLogger.wrap('S(6)', _ => assert.strictEqual(S(6), 2562701));
console.log('Tests passed');

const answer = timeLogger.wrap('S(16)', _ => S(16, true));
console.log(`Answer is ${answer}`);
