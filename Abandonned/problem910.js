// const assert = require("assert");

const MODULO = BigInt(1e9);

let ids = 0;
const $cache = new Map();

const id = (f) => {
    if (typeof f === "bigint") {
        return "?";
    } else if (f.id === undefined) {
        f.id = ++ids;
        return f.id;
    } else {
        return f.id;
    }
};

const withId = (f) => {
    id(f);
    return f;
};

const S = withId((u) => (v) => (w) => {
    if (typeof w === "bigint") {
        const key = `${id(u)}:${id(v)}`;
        let fn = $cache.get(key);
        if (!fn) {
            fn = v(u(v)(w));
            if (typeof fn === "bigint") {
                $cache.set(key, (fn + MODULO - w) % MODULO);
            }
            return fn;
        } else {
            return (w + fn) % MODULO;
        }
    } else {
        return v(u(v)(w));
    }
});

const Z = withId((u) => (v) => v);
const A = withId((x) => (x + 1n) % MODULO);

function C(i) {
    if (i === 0) {
        return Z;
    } else {
        return S(C(i - 1));
    }
}

function D(i) {
    return C(i)(S)(S);
}

function F(a, b, c, d, e) {
    const Da = D(a);
    const Db = D(b);
    const Dc = D(c);
    const Cd = C(d);

    return Da(Db)(Dc)(Cd)(A)(e);
}

console.log(F(1, 3, 1, 1, 0n));
// const v2 = TimeLogger.wrap("", () => F(3, 0, 1, 1, 0n));
// console.log("F(3, 0, 0, 0, 0)");
// console.log(v2);

// const answer = TimeLogger.wrap("", () => F(12, 345678, 9012345, 678, 90));
// console.log(`Answer is ${answer}`);
