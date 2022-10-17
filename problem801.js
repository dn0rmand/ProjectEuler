const {
    TimeLogger,
    primeHelper,
    linearRecurrence
} = require('@dn0rmand/project-euler-tools');

primeHelper.initialize(1E6);

const log = Math.log;

function baseLog(x, y) {
    return log(y) / log(x);
}

function f(n) {
    const max = n * (n - 1);
    let total = 0;
    const values = []
    for (let x = 1; x <= max; x++) {
        let subTotal = 0;
        for (let y = x + 1; y <= max; y++) {
            let v1 = y.modPow(x, n);
            let v2 = x.modPow(y, n);
            if (v1 === v2) {
                subTotal += 1;
            }
        }
        total += 2 * subTotal + 1;
        values.push(subTotal);
    }
    console.log(values.join(', '));
    return total;
}

console.log(f(5));
// console.log(f(97));

const values = [];

for (const n of primeHelper.allPrimes()) {
    if (n < 50) {
        values.push(f(n));
    }
}

console.log(linearRecurrence(values));