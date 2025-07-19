// TOO SLOW and give bad result so switched to plain C

// Gcd sum
// Problem 625

// G(N)= ∑j=1->N ∑i=1->j gcd(i,j)

// You are given: G(10)=122
// Find G(10^11). Give your answer modulo 998244353

const { primeHelper, TimeLogger, BitArray, Tracer } = require('@dn0rmand/project-euler-tools');

const MODULO = 998244353;

const MAX = 1e11;
const MAX_PRIME = 1e7;

primeHelper.initialize(MAX_PRIME);
const allPrimes = primeHelper.allPrimes();

const $cache = BitArray(MAX + 1);

function g(n, e) {
    if (e === 1) {
        return (n + n - 1) % MODULO;
    }

    if (e !== undefined) {
        const k = ((n - 1).modMul(e, MODULO) + n) % MODULO;
        return n.modPow(e - 1, MODULO).modMul(k, MODULO);
    }

    const primes = [];
    primeHelper.factorize(n, (p, power) => {
        primes.push({ prime: p, power });
    });

    const total = primes.reduce((a, { prime, power }) => a.modMul(g(prime, power), MODULO), 1);
    return total;
}

function seed(max, tracer) {
    let total = 1;
    let remaining = max;

    $cache.set(1, true);

    function add(index, value) {
        total = (total + value) % MODULO;
        $cache.set(index, true);
        remaining--;
        tracer.print(() => remaining);
    }

    function inner(pi, factor, value, index) {
        if (index >= max) {
            return;
        }

        const prime = allPrimes[pi];

        const newValue = value.modMul(g(prime, factor), MODULO);
        add(index, newValue);

        // Use same prime ( special case )
        let idx = index * prime;
        let f = factor;
        if (idx >= max) {
            return;
        }

        while (idx < max) {
            f++;

            const v = value.modMul(g(prime, f), MODULO);
            add(idx, v);

            for (let pj = pi + 1; pj < allPrimes.length; pj++) {
                let p = allPrimes[pj];
                let i = idx * p;
                if (i >= max) {
                    break;
                }
                inner(pj, 1, v, i);
            }

            idx *= prime;
        }

        // use other primes
        for (let pj = pi + 1; pj < allPrimes.length; pj++) {
            // only primes not already used
            let p = allPrimes[pj];
            idx = index * p;
            if (idx >= max) {
                break;
            }
            inner(pj, 1, newValue, idx);
        }
    }

    for (let pi = 0; pi < allPrimes.length; pi++) {
        inner(pi, 1, 1, allPrimes[pi]);
    }

    for (let i = 2; i < max; i++) {
        if (!$cache.get(i)) {
            // Some verification
            if ((i & 1) === 0) {
                // even !!!!
                throw i + ' is not a prime!!!';
            }

            let v = g(i, 1);

            add(i, v);

            for (let pi = 0; pi < allPrimes.length; pi++) {
                let idx = i * allPrimes[pi];
                if (idx >= max) {
                    break;
                }
                inner(pi, 1, v, idx);
            }
        }
    }

    return total;
}

function solve() {
    const tracer = new Tracer(true);
    const result = seed(MAX, tracer);
    tracer.clear();
    return result;
}

const answer = TimeLogger.wrap('Solving', () => solve());
console.log(`Answer is ${answer}`);
