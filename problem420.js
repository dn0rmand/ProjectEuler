const assert = require('assert');
const {
    TimeLogger
} = require('@dn0rmand/project-euler-tools');

function solve(N) {
    const visited = new Map();
    const types = new Map();

    const add = (a, b, c, d) => {
        if (a + d >= N) {
            return;
        }
        const k = `${a}:${b}:${c}:${d}`;
        visited.set(k, (visited.get(k) || 0) + 1);
        return k;
    }

    const addType = (k, a, b, c, d) => {
        const t = types.get(k) || [];
        t.push({
            a,
            b,
            c,
            d
        });
        types.set(k, t);
    };

    // a^2 + 2bc + d^2 < N

    for (let a = 1;; a++) {
        const ta = a * a;
        if (ta + 3 >= N) {
            break;
        }

        for (let b = 1;; b++) {
            if (ta + 2 * b >= N) {
                break;
            }
            for (let c = 1;; c++) {
                const tc = ta + 2 * b * c;
                if (tc + 1 >= N) {
                    break;
                }

                for (let d = 1;; d++) {
                    const td = tc + d * d;
                    if (td >= N) {
                        break;
                    }

                    const k = add(a * a + b * c, a * c + c * d, b * a + b * d, b * c + d * d);
                    if (k) {
                        addType(k, a, b, c, d);
                    }
                }
            }
        }
    }

    let total = 0;

    const logged = new Set();
    const didLog = (a, b, c, d, g) => {
        const k = `${a}:${b}:${c}:${d}`;
        if (logged.has(k)) {
            return true;
        }
        logged.add(k);
    }

    const simplify = (a, b, c, d) => {
        const g = a.gcd(b).gcd(c).gcd(d);
        a /= g;
        b /= g;
        c /= g;
        d /= g;
        if (!didLog(a, b, c, d, g)) {
            console.log(a, b, c, d, ' - ', g);
        }
    };

    const dump = ({
        a,
        b,
        c,
        d
    }) => {
        if (a === d && b === c) {
            return;
        }
        if (a === b && b === c) {
            return;
        }
        if (a === b && b === d) {
            return;
        }
        if (a === c && c === d) {
            return;
        }
        if (b === c && c === d) {
            return;
        }
        simplify(a, b, c, d);
    }

    visited.forEach((v, k) => {
        if (v === 2) {
            dump(types.get(k)[0]);
            dump(types.get(k)[1]);
            total++;
        }
    });

    return total;
}

assert.strictEqual(solve(50), 7);
assert.strictEqual(TimeLogger.wrap('', _ => solve(1000)), 1019);

console.log('Tests passed');