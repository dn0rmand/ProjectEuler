const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const BigSet = require('@dn0rmand/project-euler-tools/src/BigSet');

const MODULO = 2 ** 32;
const MAX = 1E12;

const MAX_PRIME = Math.sqrt(MAX);
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');

primeHelper.initialize(MAX_PRIME);

const {
    factorize,
    isPrime
} = primeHelper;
const allPrimes = primeHelper.allPrimes();

function brute(L) {
    function PHI(n) {
        let x = 1;
        let m = n;

        factorize(n, p => {
            m /= p;
            x *= p - 1;
        });

        m *= x;
        return m;
    }

    function isHamming(n) {
        let hamming = true;

        factorize(n, p => {
            if (p > 5) {
                hamming = false;
                return false;
            }
        });

        return hamming;
    }

    function S(L, trace) {
        const tracer = new Tracer(1, trace);

        let total = 0;
        for (let n = 1; n <= L; n++) {
            tracer.print(_ => L - n);

            const t = PHI(n);

            if (isHamming(t)) {
                total += n;
            }
        }
        tracer.clear();

        return total;
    }

    return S(L);
}

function S(L, trace) {
    const tracer = new Tracer(1, trace);

    const hammings = [];
    const primes = [];
    const products = [];
    const allPrimes = [2, 3, 5];

    function inner1(value, index) {
        hammings.push(value);
        if (isPrime(value + 1)) {
            primes.push(value + 1);
        }

        for (let i = index; i < allPrimes.length; i++) {
            const p = allPrimes[i];
            let v = value * p;
            if (v > L) {
                break;
            }
            while (v <= L) {
                inner1(v, i + 1);
                v = v * p;
            }
        }
    }

    function inner2(value, index) {
        products.push(value);

        for (let i = index; i < primes.length; i++) {
            const p = primes[i];
            const v = value * p;
            if (v > L) {
                break;
            }
            inner2(v, i + 1);
        }
    }

    tracer.print(_ => 'Loading Hammings & Primes');
    inner1(1, 0);

    hammings.sort((a, b) => a - b);
    primes.sort((a, b) => a - b);

    tracer.print(_ => 'Calculating Products');
    inner2(1, 0);

    products.sort((a, b) => a - b);

    let total = 0;
    let visited = new BigSet();

    let count = products.length;
    for (const p of products) {
        tracer.print(_ => count);
        count--;
        for (const h of hammings) {
            const v = h * p;
            if (v > L) {
                break;
            }
            if (visited.has(v)) {
                continue;
            }
            visited.add(v);
            total = (total + v) % MODULO;
        }
    }
    tracer.clear();
    return total;
}

assert.strictEqual(S(100), 3728);

console.log('Test passed');

const answer = timeLogger.wrap('', _ => S(MAX, true));
console.log(`Answer is ${answer}`);