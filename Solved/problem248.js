const { primeHelper, divisors, Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');
const Sorted = require('sorted');

const INDEX = 150000;

const fact13 = (function () {
    let v = 1;
    for (let i = 2; i <= 13; i++) {
        v *= i;
    }
    return v;
})();

const MAX_PRIME = Math.floor(Math.sqrt(fact13)) + 1;

primeHelper.initialize(MAX_PRIME);

function getCandidates() {
    const candidates = Sorted([], (a, b) => a - b);

    for (const d of divisors(fact13)) {
        if (primeHelper.isPrime(d + 1)) {
            candidates.push(d);
        }
    }
    // candidates.sort((a, b) => a - b);
    return candidates.toArray();
}

function solve() {
    const candidates = getCandidates();
    let results = Sorted([], (a, b) => a - b);

    function tooBig(phi, value) {
        return phi > fact13 || (results.length >= INDEX && value > results.get(INDEX - 1));
    }

    const tracer = new Tracer(true);

    function inner(index, value, phi) {
        if (tooBig(phi, value)) {
            return false;
        }
        if (phi === fact13) {
            results.push(value);
            if (results.length > INDEX) {
                results.pop();
            }
            return false;
        }

        tracer.print(() =>
            results.length >= INDEX
                ? `${results.get(0)} to ${results.get(INDEX - 1)}`
                : `Found ${results.length}`
        );

        for (let i = index; i < candidates.length; i++) {
            const phi0 = candidates[i];
            const p = phi0 + 1;

            let v = value * p;
            let newPhi = phi * phi0;
            if (tooBig(newPhi, v)) {
                break;
            }

            while (!tooBig(newPhi, v)) {
                inner(i + 1, v, newPhi);
                v *= p;
                newPhi *= p;
            }
        }
    }

    inner(0, 1, 1);

    tracer.clear();

    return results.get(INDEX - 1);
}

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer}`);
