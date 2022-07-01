const {
    TimeLogger,
    Tracer,
    primeHelper
} = require('@dn0rmand/project-euler-tools');

const P47 = 47;
primeHelper.initialize(P47, true);

const LIMIT = 1109496723126; // A002072(15)+1 : 47 is 15th prime

function getSmoothNums(tracer) {
    const smoothNums = [1];

    for (const p of primeHelper.allPrimes()) {
        tracer.print(_ => p);
        const l = smoothNums.length;
        for (let i = 0; i < l; i++) {
            const n = smoothNums[i];
            let v = n * p;
            if (n > LIMIT) {
                break;
            }
            while (v <= LIMIT) {
                smoothNums.push(v);
                v *= p;
            }
        }
        smoothNums.sort((a, b) => a - b);
    }

    return smoothNums;
}

function solve() {
    let total = 0

    const tracer = new Tracer(true);
    const smoothNums = getSmoothNums(tracer);

    for (let i = 0; i < smoothNums.length; i++) {
        tracer.print(_ => smoothNums.length - i);
        if (smoothNums[i] + 1 === smoothNums[i + 1]) {
            total += smoothNums[i];
        }
    }

    tracer.clear();
    return total
}

const answer = TimeLogger.wrap('Solving', _ => solve());

console.log(`Answer is ${answer}`);