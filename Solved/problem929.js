const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 1e5;
const MODULO = 1111124111;

class Memoize {
    constructor() {
        this.data = new Array(MAX + 1);
    }

    get(remaining, last) {
        return (this.data[remaining] ?? [])[last];
    }

    set(remaining, last, value) {
        this.data[remaining] ??= [];
        this.data[remaining][last] = value;
    }

    setValues(remaining, values) {
        this.data[remaining] = values;
    }
}

const memoize = new Memoize();

function F(max) {
    function inner(remaining, last) {
        if (remaining < 0) {
            return 0;
        }
        if (remaining === 0) {
            return 1;
        }

        if (last > remaining) {
            last = 0;
        }

        let total = memoize.get(remaining, 0);
        if (total !== undefined) {
            if (last !== 0) {
                const offset = memoize.get(remaining, last);
                if (offset === undefined) {
                    throw 'What!!!!';
                }
                return (total + MODULO - offset) % MODULO;
            } else {
                return total;
            }
        }

        total = 0;

        const mem = new Uint32Array(remaining + 1);
        const prev = memoize.data[remaining - 1] ?? [];

        let start = remaining;

        if (remaining > 10) {
            const same = (remaining >> 1) - 1;
            for (let v = 0, i = prev.length - 1; v <= same; v++, i--, start--) {
                mem[start] = prev[i];
                total += mem[start];
            }
        }

        for (let v = start; v > 0; v--) {
            let maxCount = Math.floor(remaining / v);
            if ((maxCount & 1) === 0) {
                maxCount--;
            }

            let subTotal = 0;
            for (let c = maxCount; c > 0; c -= 2) {
                subTotal = (subTotal + inner(remaining - c * v, v)) % MODULO;
            }

            mem[v] = subTotal;
            total = (total + subTotal) % MODULO;
        }
        mem[0] = total;
        memoize.setValues(remaining, mem);
        if (last !== 0) {
            total = (total + MODULO - memoize.get(remaining, last)) % MODULO;
        }
        return total;
    }

    const total = inner(max, 0, []);
    return total;
}

function solve(max, trace) {
    const tracer = new Tracer(trace);
    for (let i = 1; i <= max; i += 1) {
        tracer.print((_) => max - i);
        F(i);
    }
    tracer.clear();
    return F(max);
}

assert.strictEqual(solve(5, false), 10);
assert.strictEqual(solve(100, true), 16557256);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(MAX, true));
console.log(`Answer is ${answer}`);
