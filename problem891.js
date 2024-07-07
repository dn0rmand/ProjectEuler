const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

class PreciseNumber {
    static Zero = PreciseNumber.create(0, 1);
    static One = PreciseNumber.create(1, 1);

    static create(numerator, divisor) {
        return new PreciseNumber(numerator, divisor);
    }

    constructor(numerator, divisor) {
        this.numerator = numerator;
        this.divisor = divisor;
        this.simplify();
    }

    simplify() {
        if (!this.divisor || !this.numerator) {
            this.numerator = 0;
            this.divisor = 1;
            return;
        }
        if (this.divisor < 0) {
            // It's better is the negative value is the numerator
            this.numerator = -this.numerator;
            this.divisor = -this.divisor;
        }

        let a = Math.abs(this.numerator);
        let b = this.divisor;

        if (a > 1 && b > 1) {
            if (a < b) {
                b = a;
                a = this.divisor;
            }

            while (b !== 0) {
                const c = a % b;
                a = b;
                b = c;
            }

            if (a > 1) {
                this.numerator /= a;
                this.divisor /= a;
            }
        }
    }

    times(value) {
        return new PreciseNumber(this.numerator * value, this.divisor);
    }

    divide(other) {
        return new PreciseNumber(this.numerator * other.divisor, this.divisor * other.numerator);
    }

    times2(other) {
        return new PreciseNumber(this.numerator * other.numerator, this.divisor * other.divisor);
    }

    equals(other) {
        return other.numerator === this.numerator && other.divisor === this.divisor;
    }

    less(other) {
        return this.numerator * other.divisor < this.divisor * other.numerator;
    }

    toString() {
        if (this.divisor == 1) {
            return `${this.numerator}`;
        }
        return `${this.numerator}/${this.divisor}`;
    }
}

const $360 = PreciseNumber.create(360, 1);

const COEF = 1000;
const PRECISION = 1; //36 * COEF;

function MOD(v, m) {
    m = m * v.divisor;
    v = PreciseNumber.create(v.numerator, v.divisor);
    v.numerator %= m;
    v.simplify();
    return v;
}

function PLUS(v1, v2) {
    const d = v1.divisor * v2.divisor;
    if (d > Number.MAX_SAFE_INTEGER) {
        throw 'Too big';
    }

    let n = v1.numerator * v2.divisor + v1.divisor * v2.numerator;
    if (n > Number.MAX_SAFE_INTEGER) {
        throw 'Too big';
    }

    const k = $360.numerator * d;
    if (k > Number.MAX_SAFE_INTEGER) {
        throw 'Too big';
    }

    if (n >= k) {
        n -= k;
    }

    v1.numerator = n;
    v1.divisor = d;
    v1.simplify();

    return v1;
}

function MINUS(v1, v2) {
    const d = v1.divisor * v2.divisor;
    if (d > Number.MAX_SAFE_INTEGER) {
        throw 'Too big';
    }

    let n = v1.numerator * v2.divisor - v1.divisor * v2.numerator;
    if (n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER) {
        throw 'Too big';
    }

    if (n < 0) {
        n += $360.numerator * d;
    }

    return PreciseNumber.create(n, d);
}

class Time {
    static SECOND = 0;
    static MINUTE = 0;
    static HOUR = 0;
    static PRECISION = PRECISION;
    static MAX_TICKS = 0;

    static setup(precision) {
        Time.PRECISION = precision;
        Time.SECOND = $360.divide(PreciseNumber.create(60 * precision, 1));
        Time.MINUTE = Time.SECOND.divide(PreciseNumber.create(60, 1));
        Time.HOUR = Time.MINUTE.divide(PreciseNumber.create(12, 1));
        Time.MAX_TICKS = 12 * 60 * 60 * precision;
    }

    constructor() {
        this.hour = PreciseNumber.create(0, 1);
        this.minute = PreciseNumber.create(0, 1);
        this.second = PreciseNumber.create(0, 1);
        this.ticks = 0;
    }

    toString() {
        return `${this.hour.toString()}:${this.minute.toString()}:${this.second.toString()}`;
    }

    getKey(ref, v1, v2) {
        const a1 = MINUS(v1, ref);
        const a2 = MINUS(v2, ref);
        if (a1.less(a2)) {
            return [a2, a1];
        } else {
            return [a1, a2];
        }
    }

    best(a1, a2, b1, b2) {
        if (a1.less(b1)) {
            return [a1, a2];
        } else if (b1.less(a1)) {
            return [b1, b2];
        } else if (a2.less(b2)) {
            return [a1, a2];
        } else {
            return [b1, b2];
        }
    }

    key() {
        let [a1, a2] = this.getKey(this.minute, this.hour, this.second);
        let [b1, b2] = this.getKey(this.second, this.hour, this.minute);
        let [c1, c2] = this.getKey(this.second, this.minute, this.hour);

        [a1, a2] = this.best(a1, a2, b1, b2);
        [a1, a2] = this.best(a1, a2, c1, c2);

        return [a1, a2];
    }

    tick() {
        this.second = PLUS(this.second, Time.SECOND);
        this.minute = PLUS(this.minute, Time.MINUTE);
        this.hour = PLUS(this.hour, Time.HOUR);
        this.ticks = (this.ticks + 1) % Time.MAX_TICKS;
    }

    equals(t) {
        return this.second.equals(t.second) && this.minute.equals(t.minute) && this.hour.equals(t.hour);
    }

    convert(s, m, h) {
        const k1 = h.divide(Time.HOUR);
        const k2 = m.divide(Time.MINUTE);
        const k3 = s.divide(Time.SECOND);

        if (k1.divisor == 1 && k1.numerator == this.ticks) {
            return;
        }
        if (MOD(k1, 60 * 60 * Time.PRECISION).equals(k2) && MOD(k2, 60 * Time.PRECISION).equals(k3)) {
            return k1;
        }
    }

    equivalent(callback) {
        const [a1, a2] = this.key();

        const [s, m, h] = [PreciseNumber.create(0, 1), a1, a2];
        let some = false;

        let k = this.convert(s, m, h);
        if (k) {
            callback(k, 1);
            some = true;
        }
        k = this.convert(s, h, m);
        if (k) {
            callback(k, 2);
            some = true;
        }
        k = this.convert(h, m, s);
        if (k) {
            callback(k, 3);
            some = true;
        }
        k = this.convert(h, s, m);
        if (k) {
            callback(k, 4);
            some = true;
        }
        k = this.convert(m, s, h);
        if (k) {
            callback(k, 5);
            some = true;
        }
        k = this.convert(m, h, s);
        if (k) {
            callback(k, 6);
            some = true;
        }
        if (some) {
            callback(PreciseNumber.create(this.ticks, 1), 7);
        }
    }
}

function toTime(t) {
    t /= PRECISION;
    const seconds = t % 60;
    t = (t - seconds) / 60;
    const minutes = t % 60;
    t = (t - minutes) / 60;

    return `${t}:${minutes}:${seconds}`;
}

function solve1() {
    Time.setup(PRECISION);

    let total = new Set();

    const tracer = new Tracer(true);
    const time = new Time();

    const steps = 1; // Math.max(1, Math.floor(COEF / 100));
    // const offset = Math.floor(Math.random() * steps);

    // for (let i = 0; i < offset; i++) {
    //     time.tick();
    // }

    const speed = 60 * PRECISION;

    for (let h = 0; h < 12; h++) {
        for (let m = 0; m < 60; m++) {
            for (let s = 0; s < speed; s += steps) {
                tracer.print((_) => `${12 - h - 1}:${60 - m - 1}:${speed - s - 1} - ${total.size}`);
                time.tick();
                time.equivalent((k) => {
                    total.add(k.toString());
                });
            }
        }
    }
    tracer.clear();
    return total.size;
}

function solve() {
    Time.setup(PRECISION);

    function isValid(h, m, s) {
        const k1 = h;
        const k2 = m * 60;
        const k3 = s * 600;

        if (k1 === k2 % 60 && k2 === k3 % 60) {
            return 1;
        }
        return 0;
    }

    let total = 0;
    for (let h = 0; h < 360; h++) {
        for (let m = 0; m < 360; m++) {
            for (let s = 0; s < 360; s++) {
                let valid = 0;
                valid += isValid(h, m, s);
                if (!valid) {
                    continue;
                }
                if (
                    isValid(h, s, m) ||
                    isValid(s, h, s) ||
                    isValid(s, m, h) ||
                    isValid(m, h, s) ||
                    isValid(m, s, h)
                ) {
                    total++;
                }
            }
        }
    }

    return total;
}

const answer = TimeLogger.wrap('', (_) => solve());
console.log(`Answer is ${answer}`);
