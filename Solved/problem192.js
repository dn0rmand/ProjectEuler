const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');
const BigNumber = require('decimal.js');

BigNumber.set({ precision: 60 });

/*
| 1 0 | | a  b | | 1 1 |   | a a+b |
| 1 1 | | c  d | | 0 1 | = | c c+d |
*/
class Node {
    constructor(s, bound) {
        this.a = 1;
        this.b = Math.max(s - 1, 0);
        this.c = 0;
        this.d = 1;
        this.bound = bound;
    }

    get numerator() {
        return this.a + this.b;
    }

    get denominator() {
        return this.c + this.d;
    }

    goLeft() {
        const d = this.c + this.d + this.d;
        if (d > this.bound) {
            return false;
        }
        this.a += this.b;
        this.c += this.d;
        return true;
    }

    goRight() {
        const d = this.c + (this.d + this.c);
        if (d > this.bound) {
            return false;
        }
        this.b += this.a;
        this.d += this.c;
        return true;
    }

    valueOf() {
        return BigNumber(this.numerator).dividedBy(this.denominator);
    }
}

function findBest(n, d) {
    n = BigNumber(n).sqrt();

    const current = new Node(Math.floor(n.toNumber()), d);

    const offset = (_) => n.minus(current.valueOf()).abs();

    let best = current.denominator;
    let bestOffset = offset();

    while (true) {
        const v = current.valueOf();
        const o = offset();

        if (o.lt(bestOffset)) {
            best = current.denominator;
            bestOffset = o;
        }

        if (v.eq(n)) {
            throw 'Error';
        }

        if (v.lt(n)) {
            if (!current.goRight()) {
                break;
            }
        } else if (!current.goLeft()) {
            break;
        }
    }

    return best;
}

function solve(N, d) {
    let total = 0n;

    const tracer = new Tracer(true);
    for (let i = 2; i <= N; i++) {
        tracer.print((_) => N - i);
        const v = Math.sqrt(i);
        if (v !== Math.floor(v)) {
            total += BigInt(findBest(i, d));
        }
    }
    tracer.clear();
    return total;
}

assert.strictEqual(findBest(13, 20), 5);
assert.strictEqual(findBest(13, 30), 28);
assert.strictEqual(findBest(13, 1e12), 393637139280);

console.log('Tests passed');

const answer = TimeLogger.wrap('', (_) => solve(100000, 1e12));
console.log(`Answer is ${answer}`);
