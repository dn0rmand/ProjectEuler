const assert = require('assert');
const linearRecurrence = require('tools/linearRecurrence');
const timeLogger = require('tools/timeLogger');

const MODULO = 1E9 + 7;
const MAX = 1E14;

class Sequence 
{
    static recurrences = [ linearRecurrence({ factors: [-1n, 2n], divisor: 1n }) ];

    static getRecurrence(index) {
        if (Sequence.recurrences[index]) {
            return Sequence.recurrences[index];
        }       

        const f = Sequence.getRecurrence(index-1).factors;
        const factors = [-f[0]];
        for(let i = 1; i < f.length; i++) {
            factors.push(f[i-1] - f[i]);
        }
        factors.push(f[f.length-1]+1n);

        const recurrence = linearRecurrence({ factors, divisor: 1n });
        Sequence.recurrences[index] = recurrence;

        return recurrence;
    }

    constructor(index) 
    {
        this.recurrence = Sequence.getRecurrence(index);
        this.values = [];
        this.data   = [];
        this.length = this.recurrence.factors.length;
        this.count  = this.length;
        this.index  = this.count;
    }

    set(idx, value) {
        if (this.data[idx] !== undefined) {
            return; // already set
        }
        this.data[idx] = value;
        if (this.count && idx < this.length) {
            this.count--;
            this.values[idx] = value;
        }
    }

    get(idx) {
        if (this.data[idx] !== undefined) {
            return this.data[idx];
        }
        if (this.count) {
            return undefined;
        }
        while(this.data[idx] === undefined) {
            this.values = this.recurrence.next(this.values, MODULO);
            this.data[this.index++] = Number(this.values[this.length-1]);
        }
        return this.data[idx];
    }
}

class Cache 
{
    constructor() {
        this.data = [];
    }

    get(k, index) {
        const b = this.data[index];
        if (b) {
            return b.get(k);
        }
    }

    set(k, index, value) {
        let b = this.data[index];
        if (! b) {
            b = this.data[index] = new Sequence(index);
        }
        b.set(k, value);
    }
}

function F(m, n)
{
    const digits = n.toString(m).split('').map(d => +d).reverse();
    const $sum = new Cache();

    function sum(k, index)
    {
        if (index < 0)
            return 1;
            
        let total = $sum.get(k, index);
        if (total !== undefined) {
            return total;
        }
        total = 0;
        const end = digits[index] + m*k;
        if (index === 0) {
            total = (end+1) % MODULO;
        } else {
            for(let kr = 0; kr <= end; kr++) {
                total = (total + sum(kr, index-1)) % MODULO;
            }
        }
        $sum.set(k, index, total);

        return total;
    }

    let total = 0;
    const end = digits[digits.length-1];
    for(let k = 0; k <= end; k++) {
        total = (total + sum(k, digits.length-2)) % MODULO;
    }

    return total;
}

function solve(n)
{
    let total = 0;
    for(let k = 2; k <= 10; k++) {
        total = (total + F(k, n, true)) % MODULO;
    }
    return total;
}

assert.strictEqual(F(7, 700), 215882);

assert.strictEqual(F(5, 10), 18);
assert.strictEqual(F(7, 100), 1003);
assert.strictEqual(timeLogger.wrap('', _ => F(2, 1000)), 264830889564 % MODULO);

console.log('Tests passed');

const answer = timeLogger.wrap('1E14', _ => solve(MAX));

console.log(`Answer is ${answer}`);
