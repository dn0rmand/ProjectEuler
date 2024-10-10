const assert = require("assert");

const MODULO = 1e9;

let ids = 0;
const $cache = new Map();

const id = (f) => {
    if (typeof f === "number") {
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
    if (typeof w === "number") {
        const key = `${id(u)}:${id(v)}`;
        let fn = $cache.get(key);
        if (!fn) {
            fn = v(u(v)(w));
            if (typeof fn === "number") {
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
const A = withId((x) => (x + 1) % MODULO);

assert.strictEqual(S(Z)(A)(0), 1);
assert.strictEqual(S(S)(S(S))(S(Z))(A)(0), 6);

console.log("Tests passed");

const answer = S(S)(S(S))(S(S))(S(Z))(A)(0);
console.log(`Answer is ${answer}`);
