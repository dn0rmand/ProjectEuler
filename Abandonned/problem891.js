const { TimeLogger, Tracer, BigMap } = require('@dn0rmand/project-euler-tools');

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

    plus(other) {
        const d = this.divisor * other.divisor;
        if (d > Number.MAX_SAFE_INTEGER) {
            throw 'Too big';
        }

        const n = this.numerator * other.divisor + this.divisor * other.numerator;
        if (n > Number.MAX_SAFE_INTEGER) {
            throw 'Too big';
        }

        return new PreciseNumber(n, d);
    }

    minus(other) {
        const d = this.divisor * other.divisor;
        if (d > Number.MAX_SAFE_INTEGER) {
            throw 'Too big';
        }

        const n = this.numerator * other.divisor - this.divisor * other.numerator;
        if (n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER) {
            throw 'Too big';
        }

        return PreciseNumber.create(n, d);
    }

    modulo(value) {
        value *= this.divisor;
        if (this.numerator < 0) {
            return new PreciseNumber((this.numerator % value) + value, this.divisor);
        } else {
            return new PreciseNumber(this.numerator % value, this.divisor);
        }
    }

    toString() {
        if (this.divisor == 1) {
            return `${this.numerator}`;
        }
        return `${this.numerator}/${this.divisor}`;
    }
}

const $360 = PreciseNumber.create(360, 1);

const PRECISION = 59 * 7;

class Time {
    static SECOND = 0;
    static MINUTE = 0;
    static HOUR = 0;
    static PRECISION = PRECISION;

    static setup(precision) {
        Time.PRECISION = precision;
        Time.SECOND = $360.divide(PreciseNumber.create(60 * Time.PRECISION, 1));
        Time.MINUTE = Time.SECOND.divide(PreciseNumber.create(60, 1));
        Time.HOUR = Time.MINUTE.divide(PreciseNumber.create(12, 1));
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
        const a1 = v1.minus(ref).modulo(360);
        const a2 = v2.minus(ref).modulo(360);
        if (a1.less(a2)) {
            return [a1, a2];
        } else {
            return [a2, a1];
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
        let [c1, c2] = this.getKey(this.hour, this.minute, this.second);

        [a1, a2] = this.best(a1, a2, b1, b2);
        [a1, a2] = this.best(a1, a2, c1, c2);

        return [a1, a2];
    }

    tick() {
        this.second = this.second.plus(Time.SECOND).modulo(360);
        this.minute = this.minute.plus(Time.MINUTE).modulo(360);
        this.hour = this.hour.plus(Time.HOUR).modulo(360);
        this.ticks = this.ticks + 1;
    }

    equals(t) {
        return this.second.equals(t.second) && this.minute.equals(t.minute) && this.hour.equals(t.hour);
    }

    convert(s, m, h) {
        let k1 = h.divide(Time.HOUR);
        let k2 = m.divide(Time.MINUTE);
        let k3 = s.divide(Time.SECOND);

        // if (k1.divisor !== 1 || k2.divisor !== 1 || k3.divisor !== 1) {
        //     const factor = k1.divisor.lcm(k2.divisor).lcm(k3.divisor);
        //     k1 = k1.times(factor);
        //     k2 = k2.times(factor);
        //     k3 = k3.times(factor);
        // }

        if (k1.divisor == 1 && k1.numerator == this.ticks) {
            return;
        }
        if (k1.modulo(60 * 60 * Time.PRECISION).equals(k2) && k2.modulo(60 * Time.PRECISION).equals(k3)) {
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
    const other = t % Time.PRECISION;
    const p = PreciseNumber.create(other, Time.PRECISION);
    t = (t - other) / PRECISION;
    const seconds = t % 60;
    t = (t - seconds) / 60;
    const minutes = t % 60;
    t = (t - minutes) / 60;

    return `${t}:${minutes}:${seconds}.${p.toString()}`;
}

function solve() {
    Time.setup(PRECISION);

    let total = new Set();

    const tracer = new Tracer(true);
    const time = new Time();

    const speed = 60 * Time.PRECISION;

    // const map = new BigMap();

    for (let h = 0; h < 12; h++) {
        for (let m = 0; m < 60; m++) {
            for (let s = 0; s < speed; s++) {
                tracer.print((_) => `${12 - h - 1}:${60 - m - 1}:${speed - s - 1} - ${total.size}`);
                time.tick();
                time.equivalent((k) => {
                    total.add(k.toString());
                });
                // const [a1, a2] = time.key();
                // const key = `${a1}:${a2}`;
                // const old = map.get(key);
                // if (old) {
                //     old.count++;
                // } else {
                //     map.set(key, { count: 1 });
                // }
            }
        }
    }

    // let total = 0;
    // map.forEach((value) => {
    //     if (value.count > 1) {
    //         total += value.count;
    //     }
    // });
    // tracer.clear();
    // return total;
    return total.size;
}

function solve2() {
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
