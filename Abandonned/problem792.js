const assert = require("assert");
const { TimeLogger, Tracer, linearRecurrence } = require("@dn0rmand/project-euler-tools");

const MAX = 20;
const MAXI = MAX ** 3;

function v2(n) {
    let t = 0;
    while (n && !(n & 1n)) {
        t++;
        n /= 2n;
    }
    return t;
}

let maxu = 0;

function $u(sn) {
    const x = 3n * sn + 4n;
    const v = v2(x);
    maxu = Math.max(maxu, v);
    return v;
}

const [S, u] = TimeLogger.wrap("Loading S", () => {
    const s = [0n];
    const u = [$u(0n)];

    let b = 1n;
    let f = 1n;

    let total = 0n;

    const tracer = new Tracer(true);
    for (let k = 1; k <= MAXI; k++) {
        tracer.print((_) => MAXI - k);
        b = 4n * b - (2n * b) / BigInt(k);

        f *= -2n;
        total += f * b;

        s.push(total);
        u.push($u(total));
        if (u.length === 100) {
            linearRecurrence(u, true);
        }
    }
    tracer.clear();

    return [(k) => s[k], (k) => u[k]];
});

// function u(n) {
//     let x = 3n * S(n) + 4n;
//     const v = v2(x);
//     maxu = Math.max(maxu, v);
//     return v;
// }

function U(n, trace) {
    let total = 0;
    const tracer = new Tracer(trace);
    for (let k = 1; k <= n; k++) {
        tracer.print((_) => n - k);
        const u3 = u(k ** 3);

        total += u3;
    }
    tracer.clear();
    return total;
}

assert.strictEqual(S(4), 980n);
assert.strictEqual(u(4), 7);
assert.strictEqual(u(20), 24);
assert.strictEqual(U(5), 241);

console.log("Tests passed");

// answer = TimeLogger.wrap(`U(${MAX})`, (_) => U(MAX, true));
// console.log(`Answer is ${answer} - ${maxu}`);
