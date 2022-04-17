const assert = require('assert');

const {
    divisors,
    divisorsCount,
} = require('@dn0rmand/project-euler-tools');

function getCount(n) {
    const value = 2 * n * n;

    return divisorsCount(value);
}

function f(n) {
    const value = 2 * n * n;

    let count = 0;
    let isMin = true;

    for (const divisor of divisors(value)) {
        if (isMin) {
            if (divisor > n)
                break;
            count++;
        }
        isMin = !isMin;
    }
    return count;
}

const $F = [];

function F(n) {
    if ($F[n])
        return $F[n];

    let total = 0;

    for (let i = n; i > 0; i--) {
        if ($F[i]) {
            total += $F[i];
            break;
        }
        total += f(i);
    }

    $F[n] = total;

    return total;
}

assert.strictEqual(f(15), 8);
assert.strictEqual(F(15), 63);
assert.strictEqual(F(1000), 15066);

console.log('Tests passed')

const values = [];

for (let i = 1;; i++) {
    const c = divisorsCount(i * i);
    const v = f(i);
    let cc;

    if (c & 1)
        cc = (c + 1) / 2;
    else
        cc = c / 2;

    if (v !== cc) {
        values.push({
            i,
            c,
            f: v,
            cc
        });
        if (values.length === 100)
            break;
    }
}

console.log(values.join(', '));