'use strict';

const assert = require('assert');
const { TimeLogger, Tracer, primeHelper } = require('@dn0rmand/project-euler-tools');

const PRIME = 1e9 + 7;
const MODULO = 1e9 + 7;
const MAX = 1e7;

primeHelper.initialize(MAX);

class NUMBER {
    constructor(p, e) {
        this.primes = new Map();
        if (p && e) {
            this.primes.set(p, e);
        }
    }

    times(value) {
        primeHelper.factorize(value, (p, e) => {
            this.primes.set(p, (this.primes.get(p) ?? 0) + e);
        });
        return this;
    }

    lcm(n) {
        for (const [prime, power] of n.primes) {
            this.primes.set(prime, Math.max(this.primes.get(prime) ?? 0, power));
        }
        return this;
    }

    valueOf() {
        let value = 1;
        for (const [prime, power] of this.primes) {
            value = prime.modPow(power, MODULO).modMul(value, MODULO);
        }
        return value;
    }
}

function getFactorial(n, trace) {
    const factorial = new Map();
    const allPrimes = primeHelper.allPrimes();

    function add(primes) {
        for (const { prime, power } of primes) {
            factorial.set(prime, (factorial.get(prime) ?? 0) + power);
        }
    }

    function inner(value, index, primes) {
        if (value >= n) {
            return;
        }

        for (let i = index; i < allPrimes.length; i++) {
            const p = allPrimes[i];
            let v = value * p;
            if (v > n) {
                break;
            }
            const x = { prime: p, power: 1 };
            primes.push(x);
            while (v <= n) {
                add(primes);
                inner(v, i + 1, primes);
                v *= p;
                x.power++;
            }
            primes.pop();
        }
    }

    if (trace) {
        TimeLogger.wrap('Building factorial', () => inner(1, 0, []));
    } else {
        inner(1, 0, []);
    }

    return factorial;
}

function getR(prime, power) {
    if (power > 1) {
        switch (prime) {
            case 2:
                if (power >= 5) {
                    power -= 2;
                } else {
                    power = 2;
                }
                break;
            case 3:
            case 5:
            case 43:
            case 109:
                if (power >= 3) {
                    power--;
                } else {
                    power = 1;
                }
                break;
        }
    }
    if (prime > 11) {
        return new NUMBER(prime, power - 1);
    } else {
        return new NUMBER(prime, power - 1).times(prime - 1);
    }
}

function R(P, N, trace) {
    const primes = getFactorial(N, trace);

    const tracer = new Tracer(trace);
    let result = new NUMBER();
    for (const [prime, power] of primes) {
        tracer.print(() => N - prime);

        const r = getR(prime, power);
        result.lcm(r);
    }
    tracer.clear();
    return result.valueOf();
}

assert.strictEqual(R(7, 4), 2);
assert.strictEqual(R(PRIME, 12), 17280);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => R(PRIME, MAX, true));
console.log(`Answer is ${answer}`);
