const assert = require('assert');
const {
    Tracer,
    TimeLogger,
    primeHelper,
    threading
} = require('@dn0rmand/project-euler-tools');

const MAX = 12345678;
const noThreading = false;

primeHelper.initialize(MAX);

const gcd = (a, b) => a.gcd(b);

function gOdd(n, middle) {
    if (middle < 2) {
        return 1;
    }

    let total = 6 + middle;

    for (let i = 3, j = middle - 4; i < j; i++, j--) {
        const v = n.gcd(i * i);

        if ((i & 1) === 0) {
            total += v;
        } else {
            total += 2 * v;
        }
    }

    return total;
}

function gEven(n, middle) {
    const mi = middle / 2;
    if (mi > 2 && primeHelper.isKnownPrime(mi)) {
        return 2 * (n + 2 * mi - 3);
    }

    // const values = [];
    let total = n;

    for (let i = 1, j = middle - 1, sign = -1; i <= j; i++, j--, sign = -sign) {
        const i2 = i * i;
        let v = gcd(n, i2);
        // values.push(v);
        if (i < j) {
            v += v;
        }
        total += sign * v;
    }

    // console.log(n, middle, middle / 2, values.join(', '));
    return total *= 2;
}

function g(n) {
    const middle = n / 2;
    if (middle & 1) {
        if (primeHelper.isKnownPrime(middle)) {
            return 2 * (middle - 1) + 1;
        }

        return gOdd(n, middle);
    } else {
        return gEven(n, middle);
    }
}

function getDivisors(value, maxDivisor) {
    const divisors = [1];

    if (value > 1 && value <= maxDivisor) {
        divisors.push(value);
    }

    if (!primeHelper.isKnownPrime(value)) {
        let max = Math.min(maxDivisor, Math.floor(Math.sqrt(value))) + 1;

        let start = 2;
        let steps = 1;
        if ((value & 1) !== 0) {
            start = 3;
            steps = 2;
        }

        for (let i = start; i < max; i += steps) {
            if ((value % i) !== 0) {
                continue;
            }

            divisors.push(i);

            let res = value / i;
            if (res > i && res <= maxDivisor)
                divisors.push(res);

            if (res < max)
                max = res;
        }
    }

    divisors.sort((a, b) => a - b);
    return divisors;
}

function calculateDivisors(value, maxDivisor) {
    const i2 = value * value;
    const divs = new Set();
    const divisors = getDivisors(value, maxDivisor);

    for (const d of divisors) {
        divs.add(d);
    }
    for (let i = 1; i < divisors.length; i++) {
        const d1 = divisors[i];
        let added = false;
        for (let j = 1; j <= i; j++) {
            const d2 = divisors[j];
            const d3 = d2 * d1;
            if (d3 > maxDivisor) {
                break;
            }
            if (i2 % d3 === 0 && !divs.has(d3)) {
                divs.add(d3);
                divisors.push(d3);
                added = true;
            }
        }
        if (added) {
            divisors.sort((a, b) => a - b);
        }
    }
    return divisors;
}

function includeExclude(divisors, counts) {
    let subTotal = 0;

    for (let j = divisors.length - 1; j >= 0; j--) {
        const dj = divisors[j];
        for (let k = j - 1; k >= 0; k--) {
            const dk = divisors[k];
            if (dj % dk === 0) {
                counts.set(dk, counts.get(dk) - counts.get(dj));
            }
        }
        subTotal += counts.get(dj) * dj;
    }

    return subTotal;
}

function getCounts(counts, divisors, i, max) {
    counts.clear();

    for (const divisor of divisors) {
        if (divisor > max) {
            break;
        }
        const count = Math.floor(max / divisor) - Math.floor(i / divisor) + (i % divisor ? 0 : 1);
        counts.set(divisor, count);
    }
}

class ReportStatus {
    constructor(enabled) {
        this.enabled = enabled;
        this.lastPrint = undefined;
    }

    print(callback) {
        if (!this.enabled) {
            return;
        }

        const now = Date.now();

        if (this.lastPrint === undefined || (now - this.lastPrint) >= 2000) {
            const value = callback();
            threading.postProgress(value);
            this.lastPrint = now;
        }
    }

    clear() {
        threading.postProgress(0);
    }
}

let MyTracer = Tracer;

if (!threading.isMainThread) {
    MyTracer = ReportStatus;
}

function G_Plus(max, trace) {
    const tracer = new MyTracer(trace);

    let total = 0n;
    const counts = new Map();

    const start = max & 1 ? max - 1 : max;
    for (let i = start; i >= 2; i -= 2) {
        tracer.print(_ => `+${i}`);

        const divisors = calculateDivisors(i, max);

        getCounts(counts, divisors, i, max);

        total += BigInt(includeExclude(divisors, counts));
    }

    tracer.clear();

    return total;
}

function G_Minus(max, trace) {
    const tracer = new MyTracer(trace);

    let total = BigInt(max);
    const counts = new Map();
    const start = max & 1 ? max : max - 1;
    for (let i = start; i >= 3; i -= 2) {
        tracer.print(_ => `-${i}`);

        const divisors = calculateDivisors(i, max);

        getCounts(counts, divisors, i, max);

        total += BigInt(includeExclude(divisors, counts));
    }

    tracer.clear();

    return -total;
}

function G(max, trace) {
    return G_Minus(max, trace) + G_Plus(max, trace);
}

if (threading.isMainThread) {

    assert.strictEqual(g(4), 6);
    assert.strictEqual(G(30), 287n);
    assert.strictEqual(TimeLogger.wrap('', _ => G(1234)), 2194708n);
    assert.strictEqual(TimeLogger.wrap('', _ => G(12345, true)), 359479407n);

    console.log('Tests passed');

    if (noThreading) {
        const answer = G(MAX, true);
        console.log(`Answer is ${answer}`);
    } else {
        async function process() {
            threading.createJob({
                filename: __filename,
                plus: true
            });
            threading.createJob({
                filename: __filename,
                plus: false
            });

            let answer = await TimeLogger.wrapAsync('', async () => {
                let total = 0n;
                await threading.waitJobs((value) => {
                    total += value;
                });
                return total;
            });

            console.log(`Answer is ${answer}`);
        }

        process();
    }
} else {
    const {
        plus
    } = threading.data;

    const result = plus ? G_Plus(MAX, true) : G_Minus(MAX, true);

    threading.postResult(result);
}