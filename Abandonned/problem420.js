const assert = require("assert");
const { TimeLogger, BigMap, BigSet } = require("@dn0rmand/project-euler-tools");

function solve(N) {
    const visited = new BigMap();
    const types = new BigMap();

    const add = (a, b, c, d) => {
        if (a + d >= N) {
            return;
        }
        const k = `${a}:${b}:${c}:${d}`;
        visited.set(k, (visited.get(k) || 0) + 1);
        if (visited.get(k) > 2) {
            return;
        }
        return k;
    };

    const addType = (k, a, b, c, d) => {
        const t = types.get(k) || [];
        t.push({ a, b, c, d });
        types.set(k, t);
    };

    // a^2 + 2bc + d^2 < N

    for (let a = 1; ; a++) {
        const ta = a * a;
        if (ta + 3 >= N) {
            break;
        }

        for (let b = 1; ; b++) {
            if (ta + 2 * b >= N) {
                break;
            }
            for (let c = 1; ; c++) {
                const tc = ta + 2 * b * c;
                if (tc + 1 >= N) {
                    break;
                }

                for (let d = 1; ; d++) {
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

    visited.forEach((v, k) => {
        if (v === 2) {
            total++;
        }
    });

    return total;
}

assert.strictEqual(solve(50), 7);
assert.strictEqual(
    TimeLogger.wrap("", (_) => solve(1000)),
    1019
);

console.log("Tests passed");

const answer = TimeLogger.wrap("", (_) => solve(10000));
console.log(`Answer is ${answer}`);
