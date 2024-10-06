const MODULO = 1e9;

let szCount = 0;

class L {
    constructor() {
        this.locked = false;
    }

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
            return node;
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
                return new N(action(this.v.value));
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
                w.locked = false;
                v.locked = false;
                u.locked = false;
                const e = Pair.create(v, Pair.create(Pair.create(u, v), w));
                return e;
            } else {
                if (this.locked) {
                    return this;
                }
                const e = Pair.create(this.u, this.v);
                if (e.key === this.key) {
                    e.locked = true;
                }
                return e;
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
            return action(from.value) % MODULO;
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
        const diff = (to + MODULO - from.value) % MODULO;
        $knownPattern[pattern] = (v) => (v + diff) % MODULO;

        return to;
    }
}

function parse(expression) {
    const stack = [];
    let opened = 0;

    function isDigit(index) {
        const t = expression[index];
        return t >= "0" && t <= "9";
    }

    const toSkip = "(Z)(S)(S)";
    function skip(index) {
        const s = expression.substring(index, index.toSkip.length);
        if (s === "(Z)(S)(S)") {
            return tru;
        }
    }

    function getNumber(index) {
        let value = 0;
        index--;
        while (isDigit(++index)) {
            value = value * 10 + +expression[index];
        }
        return [index - 1, value];
    }

    for (let i = 0; i < expression.length; i++) {
        // if (expression.substring(i, i + toSkip.length) === toSkip) {
        //     stack.push(new S());
        //     i += toSkip.length - 1;
        // } else
        if (isDigit(i)) {
            let value;
            [i, value] = getNumber(i);
            stack.push(new N(value));
        } else {
            switch (expression[i]) {
                case "^": {
                    const [i2, power] = getNumber(i + 1);
                    i = i2;
                    const u = stack.pop();
                    u.power = power;
                    stack.push(u);
                    break;
                }

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
                    stack.push(new Pair(u, v));
                    opened--;
                    break;
                }
                default:
                    throw `Invalid token ${expression[i]}`;
            }
        }
    }

    if (opened || stack.length !== 1) {
        throw "Syntax error";
    }

    return stack.pop();
}

function evaluate(expression) {
    let e = parse(expression);

    while (!(e instanceof N)) {
        e = e.transform();
    }
    return e.value;
}

module.exports = {
    parse,
    evaluate,
};
