const assert = require('assert');
const { primeHelper, Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1e7);

function factorial(n) {
    const primes = [];
    for (let i = 2; i <= n; i++) {
        primeHelper.factorize(i, (p, e) => {
            primes[p] = (primes[p] || 0) + e;
        });
    }

    const factorization = [];

    for (const k of Object.keys(primes)) {
        factorization.push({ prime: +k, power: primes[k] });
    }

    return factorization;
}

function cbrt(factorization) {
    let n = 1;

    for (const { prime, power } of factorization) {
        const v = prime ** (power / 3);
        n *= v;
    }
    return Math.floor(n);
}

function getDivisor(factorisation, callback) {
    function inner(index, value) {
        if (callback(value) === false) {
            return false;
        }

        for (let i = index; i < factorisation.length; i++) {
            const p = BigInt(factorisation[i].prime);
            let v = value;
            for (let e = 1; e <= factorisation[i].power; e++) {
                v *= p;
                if (inner(i + 1, v) === false) {
                    break;
                }
            }
        }
    }

    inner(0, 1n);
}

function ff(factorization, coef, tracer) {
    const divs = [];
    const C = cbrt(factorization);
    const offset = C / coef;
    const MIN_A = Math.floor(C - offset);
    const MAX_A = Math.ceil(C + offset);

    let n = factorization.reduce((a, { prime, power }) => a * BigInt(prime) ** BigInt(power), 1n);

    TimeLogger.wrap('Getting divisors', () =>
        getDivisor(factorization, (div) => {
            if (div > MAX_A) {
                return false;
            }
            if (div >= MIN_A) {
                divs.push(div);
            }
        })
    );

    divs.sort((a, b) => (a < b ? -11 : b > a ? 1 : 0));

    let min = n;
    let best = n + 2n;
    let besty = { a: 1n, b: 1n, c: n };

    for (let i = 0; i < divs.length; i++) {
        tracer.print((_) => `${divs.length - i} : ${best}`);
        const a = divs[i];
        if (a * a * a > n) {
            break;
        }
        for (let j = i; j < divs.length; j++) {
            const b = divs[j];
            const ba = b * a;
            if (ba * b > n) {
                break;
            }
            if (n % ba) {
                continue;
            }
            const c = n / (b * a);
            if (c < b) {
                break;
            }
            const ca = c.divise(a, 15);
            if (ca < min) {
                besty = { a, b, c };
                best = a + b + c;
                min = ca;
            }
        }
    }
    tracer.clear();
    return best;
}

function f(n, coef) {
    if (!Array.isArray(n)) {
        const factorization = [];
        primeHelper.factorize(n, (p, e) => {
            factorization.push({ prime: p, power: e });
        });

        return ff(factorization, 4, new Tracer(false));
    } else {
        return ff(n, coef || 500, new Tracer(true));
    }
}

// console.log('100100 = 2^2 * 5^2 * 7 * 11 * 13');

assert.strictEqual(f(165), 19n);
assert.strictEqual(f(100100), 142n);
assert.strictEqual(f(factorial(20)), 4034872n);
console.log('Tests passed');

const answer = TimeLogger.wrap('', () => f(factorial(43), 2000));
console.log(`Answer is ${answer}`);
