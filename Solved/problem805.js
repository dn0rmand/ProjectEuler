const assert = require('assert');
const {
    TimeLogger,
    Tracer,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(200);

const MODULO = 1000000007;
const MODULO_N = BigInt(1000000007);

const $digits = TimeLogger.wrap('Load digits', _ => {

    const digits = [];

    for (let u = 0; u < 10; u++) {
        const du = digits[u] = [];
        for (let l = 0; l < 10; l++) {
            const dl = du[l] = [];
            for (let cu = 0; cu < 10; cu++) {
                dl[cu] = -1;
                for (let k = 0; k < 10; k++) {
                    const x = (k * u + cu) % 10;
                    if (x === l) {
                        dl[cu] = k;
                        break;
                    }
                }
            }
        }
    }

    return digits;
});

function* coPrimes(M) {
    for (let u = 1; u <= M; u++) {
        for (let v = u + 1; v <= M; v++) {
            if (u.gcd(v) === 1) {
                yield {
                    u,
                    v
                };
            }
        }
    }
}

function S(n) {
    if (n < 10) {
        return n;
    }

    const digits = [];

    let v = n;
    while (v > 0) {
        const d = v % 10;
        v = (v - d) / 10;
        digits.push(d);
    }
    const last = digits.pop();
    v = 0;
    for (let i = digits.length - 1; i >= 0; i--) {
        v = v * 10 + digits[i];
    }
    v = v * 10 + last;

    return v;
}

class VisitedSet {
    constructor() {
        this.data = [
            new Map(), // 0
            new Map(), // 1
            new Map(), // 2
            new Map(), // 3
            new Map(), // 4
            new Map(), // 5
            new Map(), // 6
            new Map(), // 7
            new Map(), // 8
            new Map(), // 9
        ];
    }

    has(state) {
        let m = this.data[state.k].get(state.cu);
        if (m) {
            return m.has(state.cv);
        }
    }

    add(state) {
        let m = this.data[state.k];
        let n = m.get(state.cu);
        if (!n) {
            n = new Set();
            m.set(state.cu, n);
        }
        n.add(state.cv);
    }
}

class State {
    constructor(d, u, v, cu, cv, value) {
        this.digits = $digits[u % 10];

        this.is5 = (u % 5 === 0);
        this.is2 = (u % 2 === 0);

        this.d = d;
        this.k = d;
        this.u = u;
        this.v = v;
        this.cv = cv;
        this.cu = cu;
        this.value = value;
        this.factor = 1;
    }

    update(k, cu, cv) {
        this.k = k;
        this.cv = cv;
        this.cu = cu;
        this.value = (this.value + (k * this.factor)) % MODULO;
        this.factor = (this.factor * 10) % MODULO;
    }

    get success() {
        return (this.k === this.d && this.cu === this.cv);
    }

    isValid(k, cu, cv) {
        if (k === this.d && cu === cv) {
            return true;
        }
        const l = (this.v * k + cv) % 10;
        return this.digits[l][cu % 10] >= 0;
    }

    next() {
        const ll = (this.v * this.k + this.cv);
        const l = ll % 10;
        let k = this.digits[l][this.cu % 10];
        if (k < 0) {
            return false;
        }
        let cv2 = (ll - l) / 10;
        let cu2 = (k * this.u + this.cu - l) / 10;

        if (this.isValid(k, cu2, cv2)) {
            this.update(k, cu2, cv2);
            return true;
        }

        if (k < 5 && this.is2) {
            cu2 += this.u / 2;

            if (this.isValid(k + 5, cu2, cv2)) {
                this.update(k + 5, cu2, cv2);
                return true;
            }
        }
        if (this.is5) {
            const ofs = this.u / 5;

            while (k < 8) {
                cu2 += ofs;
                k += 2;
                if (this.isValid(k, cu2, cv2)) {
                    this.update(k, cu2, cv2);
                    return true;
                }
            }
        }
        return false;
    }
}

function N(u, v, trace) {
    if (u === 2 && v === 1) {
        return 0;
    }
    if (v === 1 && u !== 3) {
        return 0;
    }

    let answer;

    const tracer = new Tracer(trace);

    let maxSteps = Number.MAX_SAFE_INTEGER;

    for (let digit = 1; digit < 10; digit++) {
        tracer.print(_ => digit);

        const visited = new VisitedSet();

        let state = new State(digit, u, v, 0, 0, 0);
        let step = 1;
        while (!visited.has(state)) {
            if (step % 100 === 0) {
                visited.add(state);
            }

            if (!state.next()) {
                break;
            }

            step++;
            if (step >= maxSteps) {
                break;
            }

            if (state.success) {
                answer = state;
                maxSteps = step;
                break;
            }
        }
    }

    tracer.clear();
    if (answer) {
        return answer.value;
    }

    return 0;
}

function T(M, trace) {
    let total = 1; // N(1, 1) = 1

    const tracer = new Tracer(trace);

    for (const {
            u,
            v
        } of coPrimes(M)) {
        tracer.print(_ => `(${u} , ${v})`);
        const top = u ** 3;
        const bottom = v ** 3;

        const v1 = N(top, bottom, trace);
        const v2 = N(bottom, top, trace);

        total = (total + v1) % MODULO;
        total = (total + v2) % MODULO;
    }
    tracer.clear();
    return total;
}

TimeLogger.wrap('Testing', _ => {
    assert.strictEqual(S(142857), 428571);

    assert.strictEqual(N(3, 1), 142857);
    assert.strictEqual(N(1, 10), 10);
    assert.strictEqual(N(1, 8), Number(1012658227848n % MODULO_N));
    assert.strictEqual(N(27, 8), Number(1509433962264n % MODULO_N));
    assert.strictEqual(N(1, 27), 587146882);
    assert.strictEqual(N(2, 1), 0);

    assert.strictEqual(T(3), 262429173);
});

console.log('Tests passed');

const answer = TimeLogger.wrap('', _ => T(200, true));
console.log(`Answer is ${answer}`);