const { TimeLogger, PreciseNumber, Tracer } = require('@dn0rmand/project-euler-tools');

const EXPECTED = 20101196798; // I know the answer so use it for progress

PreciseNumber.setUseBigInt(false);

function generate(digits, callback) {
    const v = digits.reduce((a, b) => a * 10 + b, 0);
    callback(new PreciseNumber(v, 1));

    const left = [];
    const right = [...digits];
    while (true) {
        left.push(right.shift());
        if (right.length === 0) {
            break;
        }
        const lValues = [];
        const rValues = [];

        generate(left, (v) => lValues.push(v));
        generate(right, (v) => rValues.push(v));

        for (const l of lValues) {
            for (const r of rValues) {
                callback(l.plus(r));
                callback(l.minus(r));
                callback(l.times(r));
                if (!r.equals(PreciseNumber.Zero)) {
                    callback(l.divide(r));
                }
            }
        }
    }
}

function solve() {
    const visited = new Set();
    let total = 0;
    const tracer = new Tracer(true);
    generate([1, 2, 3, 4, 5, 6, 7, 8, 9], (v) => {
        tracer.print(() => EXPECTED - total);

        if (v.divisor === 1 && v.numerator > 0) {
            const value = v.valueOf();
            if (!visited.has(value)) {
                visited.add(value);
                total += value;
            }
        }
    });

    tracer.clear();
    return total;
}

const answer = TimeLogger.wrap('Solving', () => solve());
console.log(`Answer is ${answer}`);
