const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/numberHelper');
    
class PreciseNumber
{
    static Infinity = new PreciseNumber(Infinity);
    static Zero = new PreciseNumber();

    constructor(value)
    {
        if (value === undefined) {
            this.numerator = 0;
            this.divisor = 1;
        } else if (value === Infinity) {
            this.numerator = Infinity;
            this.divisor   = 1;
        } else if (value instanceof PreciseNumber) {
            this.numerator = value.numerator;
            this.divisor   = value.divisor;
        } else {
            value = +value;
            if (isNaN(value)) {
                throw "Not a valid number";
            }
            this.numerator = +value;
            this.divisor   = 1;
        }
    }

    simplify()
    {
        if (this.divisor === 0) {
            this.numerator = 0;
            this.divisor   = 0;
            return; 
        }
        if (this.numerator === 0) {
            this.divisor   = 1;
            this.numerator = 0;
            return;
        } 
        if (this.divisor < 0) {
            // It's better is the negative value is the numerator
            this.numerator = -this.numerator;
            this.divisor   = -this.divisor;
        }

        const g = Math.abs(this.numerator.gcd(this.divisor));
        if (g !== 1) {
            this.numerator /= g;
            this.divisor   /= g;
        }
    }

    plus(other) 
    {
        if (! (other instanceof PreciseNumber)) {
            other = new PreciseNumber(other);
        }

        const state = new PreciseNumber();

        state.numerator = this.numerator * other.divisor + this.divisor * other.numerator;
        state.divisor   = this.divisor * other.divisor;
        
        state.simplify();
        return state;
    }

    minus(other) 
    {
        if (! (other instanceof PreciseNumber)) {
            other = new PreciseNumber(other);
        }
        const state = new PreciseNumber();

        state.numerator = this.numerator * other.divisor - this.divisor * other.numerator;
        state.divisor   = this.divisor * other.divisor;
        
        state.simplify();
        return state;
    }

    times(other)
    {
        if (! (other instanceof PreciseNumber)) {
            other = new PreciseNumber(other);
        }
        const state = new PreciseNumber();

        state.divisor   = this.divisor * other.divisor;
        state.numerator = this.numerator * other.numerator;

        state.simplify();
        return state;
    }

    divide(other)
    {
        if (! (other instanceof PreciseNumber)) {
            other = new PreciseNumber(other);
        }
        const state = new PreciseNumber();

        state.divisor   = this.divisor * other.numerator;
        state.numerator = this.numerator * other.divisor;

        state.simplify();
        return state;
    }

    get valid() 
    {
        return this.divisor !== 0;
    }

    equals(other) 
    {
        if (! (other instanceof PreciseNumber)) {
            other = new PreciseNumber(other);
        }
        return other.numerator === this.numerator && other.divisor === this.divisor;
    }

    less(other)
    {
        if (this.equals(other)) { return false; }

        const diff = this.minus(other);
        return (diff.numerator < 0);
    }

    greater(other)
    {
        if (this.equals(other)) { return false; }
        return other.less(this);
    }

    toString() {
        return `${this.numerator}/${this.divisor}`;
    }

    get isInfinity()
    {
        return this.numerator === Infinity;
    }

    valueOf()
    {
        if (this.isInfinity && this.divisor === 0) {
            return Infinity;
        }

        return this.numerator/this.divisor;
    }
}

class Point
{
    constructor(x, y) {
        this.x = new PreciseNumber(x);
        this.y = new PreciseNumber(y);
    }

    in(segment) 
    {
        if (segment.vertical) {
            return (this.x.equals(segment.pt1.x));
        }

        if (segment.horizontal) {
            return (this.y.equals(segment.pt1.y));
        }

        if (! segment.includes(this)) {
            return false;
        }

        const yy = segment.a.times(this.x).plus(segment.b);
        return yy.equals(this.y);
    }

    toString() {
        return `${this.x.toString()}-${this.y.toString()}`;
    }

    equals(other) {
        return this.x.equals(other.x) && this.y.equals(other.y);
    }
}

class Segment
{
    constructor(x1, y1, x2, y2) 
    {
        if (x1 <= x2) {
            this.pt1 = new Point(x1, y1);
            this.pt2 = new Point(x2, y2);    
        } else {
            this.pt2 = new Point(x1, y1);
            this.pt1 = new Point(x2, y2);    
        }
        this.initialize();
    }

    compare(other) {
        const v = this.pt1.x.valueOf() - other.pt1.x.valueOf();
        if (v == 0)
            return this.pt2.x.valueOf() - other.pt2.x.valueOf();
        return v;
    }

    initialize()
    {
        const { pt1: { x: x1, y: y1 }, pt2: { x: x2, y: y2 } } = this;

        if (x1.equals(x2)) {
            this.a = PreciseNumber.Infinity;
            this.b = PreciseNumber.Zero;
            // this.vertical = true;
            return;
        } 

        const a = y1.minus(y2).divide(x1.minus(x2));
        const b = x1.times(y2).minus(x2.times(y1)).divide(x1.minus(x2));

        this.a = a;
        this.b = b;
    }

    get horizontal() { return this.a.equals(PreciseNumber.Zero); }
    get vertical()   { return this.a.isInfinity; }

    Y(x) 
    {
        return this.a.times(x).plus(this.b);
    }

    static inZone(x, x1, x2)
    {
        if (x1.equals(x) || x2.equals(x)) {
            return true;
        }
        else if (x1.less(x2)) {
            return x1.less(x) && x.less(x2);
        } else {
            return x2.less(x) && x.less(x1);
        }        
    }

    includes(point) 
    {
        if(Segment.inZone(point.x, this.pt1.x, this.pt2.x) && Segment.inZone(point.y, this.pt1.y, this.pt2.y)) {
            return !point.equals(this.pt1) && !point.equals(this.pt2);
        } else {
            return false;
        }
    }

    parallel(other)
    {
        if (this.vertical) {
            return other.vertical;
        }
        return this.a.equals(other.a);
    }

    intersection(other)
    {
        if (this.parallel(other)) { 
            return; 
        }
    
        if (this.vertical) {
            const x = this.pt1.x;
            const pt = new Point(x, other.Y(x));
            if (this.includes(pt) && other.includes(pt)) {
                return pt;
            }
            return;
        }

        if (other.vertical) {
            const x = other.pt1.x;
            const pt = new Point(x, this.Y(x)); 
            if (this.includes(pt) && other.includes(pt)) {
                return pt;
            }
            return;
        }
    
        const A = this.a.minus(other.a);
        const B = other.b.minus(this.b);
    
        const x   = B.divide(A);
        const pt  = new Point(x, this.Y(x));
    
        if (! this.includes(pt) || ! other.includes(pt)) {
            return; // not part of those segments    
        }
    
        return pt;
    }    
}

function *generator()
{
    const MODULO_S = 50515093;
    const MODULO_T = 500;
    const S0 = 290797;
    let s1 = S0.modMul(S0, MODULO_S);

    while (true) {
        yield s1 % MODULO_T;
        
        s1 = s1.modMul(s1, MODULO_S);
    }
}

function getSegments()
{
    const numbers = generator();
    const segments = [];

    while (segments.length !== 5000) {
        const segment = new Segment(numbers.next().value, numbers.next().value, numbers.next().value, numbers.next().value);
        segments.push(segment);
    }

    return segments;
}

function getT(s1, s2)
{
    if (s2.pt1.in(s1) || s2.pt2.in(s1) || s1.pt1.in(s2) || s1.pt2.in(s2)) {
        return;
    }

    const T = s1.intersection(s2);

    return T;
}

function solve(segments, trace)
{
    segments = segments.sort((s1, s2) => s1.compare(s2));

    const visited = new Set();

    const tracer = new Tracer(1, trace);
    for (let i = 0; i < segments.length; i++) {
        tracer.print(_ => segments.length-i);

        const s1 = segments[i];

        for (let j = i+1; j < segments.length; j++) {
            const s2 = segments[j];
            if (s1.pt2.x.less(s2.pt1.x)) {
                break;
            }

            const T = getT(s1, s2);
            if (T) {
                const key = T.toString();
                visited.add(key);
            }
        }
    }

    tracer.clear();
    return visited.size;
}

const segments = getSegments();

assert.strictEqual(segments[0].pt1.equals(new Point(12, 232)), true);
assert.strictEqual(segments[0].pt2.equals(new Point(27, 144)), true);

assert.strictEqual(solve([
    new Segment(27, 44, 12, 32),
    new Segment(46, 53, 17, 62), 
    new Segment(46, 70, 22, 40), 
]), 1);

console.log('Tests passed');
const answer = timeLogger.wrap('', _ => solve(segments, true));
console.log(`Answer is ${answer}`);