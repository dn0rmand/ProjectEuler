const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

class Queue {
    constructor() {
        this.first = { cost: 1, count: 1, next: { cost: 4, count: 1 } };
        this.count = 2;
    }

    pop(maxCount) {
        const count = Math.min(this.first.count, maxCount);
        const cost = this.first.cost;
        this.first.count -= count;
        this.count -= count;
        if (!this.first.count) {
            this.first = this.first.next;
        }
        return { cost, count };
    }

    push(cost, count) {
        this.count += count;
        if (cost < this.first.cost) {
            this.first = { cost, count, next: this.first };
            return;
        } else if (cost === this.first.cost) {
            this.first.count += count;
            return;
        }

        let ptr = this.first;
        let previous = this.first;
        while (ptr && cost > ptr.cost) {
            previous = ptr;
            ptr = ptr.next;
        }
        if (!ptr) {
            previous.next = { cost, count };
        } else if (cost === ptr.cost) {
            ptr.count += count;
        } else {
            previous.next = { cost, count, next: previous.next };
        }
    }
}

function solve(length, trace) {
    const codes = new Queue();

    const tracer = new Tracer(trace);
    let totalCost = 5;
    while (codes.count < length) {
        tracer.print(() => length - codes.count);
        const { cost, count } = codes.pop(length - codes.count);
        codes.push(cost + 1, count);
        codes.push(cost + 4, count);
        totalCost += (cost + 5) * count;
    }
    tracer.clear();
    return totalCost;
}

assert.strictEqual(solve(6), 35);
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(1e9, true));
console.log(`Answer is ${answer}`);
