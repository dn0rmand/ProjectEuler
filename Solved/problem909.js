const assert = require("assert");
const { TimeLogger, Tracer } = require("@dn0rmand/project-euler-tools");

const MODULO = 1e9;

class L {
    constructor() {}

    get key() {
        return "";
    }

    get value() {
        throw "Not implemented";
    }

    transform() {
        return this;
    }

    get isSZ() {
        return false;
    }
}

class N extends L {
    constructor(value) {
        super();
        this.$value = value % MODULO;
    }

    get key() {
        return "?";
    }

    get value() {
        return this.$value;
    }
}

class A extends L {
    constructor() {
        super();
    }

    get key() {
        return "A";
    }
}

class Z extends L {
    constructor() {
        super();
    }

    get key() {
        return "Z";
    }
}

class S extends L {
    constructor() {
        super();
    }

    get key() {
        return "S";
    }
}

const $knownPattern = {};

class Pair extends L {
    constructor(u, v) {
        super();
        this.u = u;
        this.v = v;
        this.$key = `${u.key}(${v.key})`;
    }

    get key() {
        return this.$key;
    }

    get isSZ() {
        return this.u instanceof S && this.v instanceof Z;
    }

    static create(u, v) {
        if (u instanceof N) {
            throw "Error";
        }
        v = v.transform();
        u = u.transform();
        if (u.isSZ) {
            return v;
        }
        return new Pair(u, v);
    }

    findNumber(node) {
        if (node instanceof Pair) {
            let v = this.findNumber(node.v); // more likely to be on the right
            if (v === undefined) {
                v = this.findNumber(node.u);
            }
            return v;
        } else if (node instanceof N) {
            return node.value;
        }
    }

    transform() {
        if (this.u.isSZ) {
            return this.v.transform();
        }

        if (this.v instanceof N) {
            const pattern = this.key;
            const action = $knownPattern[pattern];
            if (action) {
                const v = action(this.v.value);
                return new N(v);
            }
        }

        if (this.u instanceof A) {
            return new N(this.v.value + 1);
        } else if (this.u instanceof Pair) {
            if (this.u.u instanceof Z) {
                return this.v;
            } else if (this.u.u instanceof Pair && this.u.u.u instanceof S) {
                const u = this.u.u.v;
                const v = this.u.v;
                const w = this.v;
                return Pair.create(v, Pair.create(Pair.create(u, v), w));
            } else {
                return Pair.create(this.u, this.v);
            }
        } else {
            return this;
        }
    }

    get value() {
        const pattern = this.key;
        const from = this.findNumber(this);
        const action = $knownPattern[pattern];

        if (action) {
            return action(from) % MODULO;
        }

        let e = this.transform();
        while (true) {
            if (e instanceof Pair && e.v instanceof N) {
                break;
            } else if (e instanceof Pair) {
                e = e.transform();
            } else if (e instanceof N) {
                break;
            }
        }

        const to = e.value;
        const diff = (to + MODULO - from) % MODULO;
        $knownPattern[pattern] = (v) => (v + diff) % MODULO;

        return to;
    }
}

function parse(expression) {
    const tokens = expression.split("");
    const stack = [];
    let opened = 0;

    while (tokens.length > 0) {
        const t = tokens.shift();
        switch (t) {
            case "0":
                stack.push(new N(0));
                break;
            case "A":
                stack.push(new A());
                break;
            case "Z":
                stack.push(new Z());
                break;
            case "S":
                stack.push(new S());
                break;
            case "(":
                opened++;
                break;
            case ")": {
                if (!opened || stack.length < 2) {
                    throw "Syntax error";
                }
                const v = stack.pop();
                const u = stack.pop();
                stack.push(Pair.create(u, v));
                opened--;
                break;
            }
            default:
                throw `Invalid token ${t}`;
        }
    }

    if (opened || stack.length !== 1) {
        throw "Syntax error";
    }

    return stack.pop();
}

function solve(expression) {
    let e = parse(expression);
    while (!(e instanceof N)) {
        e = e.transform();
    }
    return e.value;
}

assert.strictEqual(solve("S(Z)(A)(0)"), 1);
console.log("Test 1 passed");

assert.strictEqual(solve("S(S)(S(S))(S(Z))(A)(0)"), 6);
console.log("Test 2 passed");

const answer = TimeLogger.wrap("", () => solve("S(S)(S(S))(S(S))(S(Z))(A)(0)"));
console.log(`Answer is ${answer}`);
