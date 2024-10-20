const assert = require('assert');
const {
    TimeLogger,
    Tracer
} = require('@dn0rmand/project-euler-tools');

const SIZE = 50515093;
const MAX_T = 1E5;
const CLOCKS = new Map();

const S = TimeLogger.wrap('Loading Sequence', _ => {
    const s = [290797];
    const tracer = new Tracer(true);

    let previous = s[0];
    for (let t = 1; t < 4 * MAX_T; t++) {
        tracer.print(_ => 4 * MAX_T - t);
        previous = previous.modMul(previous, SIZE);
        s.push(previous);
    }

    return s;
});

class Rectangle {
    constructor(x1, x2, y1, y2) {
        if (x1 > x2) {
            [x1, x2] = [x2, x1];
        }
        if (y1 > y2) {
            [y1, y2] = [y2, y1];
        }
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    intersect(r) {
        if (this.x2 < r.x1 || this.x1 > r.x2 ||
            this.y2 < r.y1 || this.y1 > r.y2) {
            return;
        }
        const x1 = Math.max(this.x1, r.x1);
        const x2 = Math.min(this.x2, r.x2);
        const y1 = Math.max(this.y1, r.y1);
        const y2 = Math.min(this.y2, r.y2);

        return new Rectangle(x1, x2, y1, y2);
    }
}

class RectangleCollection {
    constructor() {
        this.rects = [];
    }

    get isEmpty() {
        return this.rects.length === 0;
    }

    add(rect) {
        this.rects.push(rect);
    }

    optimize() {
        console.log('To be implemented');
    }
}

class State {
    constructor(value) {
        this.rects = [];
        this.value = value;
    }

    static start() {
        const s = new State(12);
        s.rects.add(new Rectangle(0, SIZE, 0, SIZE));
        return s;
    }

    * intersect(rectangle) {
        for (let r of this.rects) {

        }
    }

    add(rectangle) {

    }

    remove(rectangle) {

    }

    merge() {

    }
}

function C(T) {
    let values = [];
    values[12] = State.start();

    const tracer = new Tracer(true);
    for (let t = 1; t <= T; t++) {
        tracer.print(_ => T - t);

        const R = new Rectangle(S[4 * t - 4], S[4 * t - 3], S[4 * t - 2], S[4 * t - 1]);
        const newValues = [];
        for (const value of values) {
            if (!value) {
                continue;
            }

            const newValue = new State((value.value % 12) + 1);
            for (const r of value.intersect(rectangle)) {
                newValue.add(r);
            }
            newValue.merge(newValues[newValue.value]);
            newValues[newValue.value] = newValue;

            // Remove from old Value
            value.remove(rectangle);
            value.merge(newValues[value.value]);
            newValues[value.value] = value;
        }

        value = newValues;
    }

    tracer.clear();
    return 0n;
}

assert.strictEqual(C(0), 30621295449583788n);
assert.strictEqual(C(1), 30613048345941659n);

console.log('Tests passed');