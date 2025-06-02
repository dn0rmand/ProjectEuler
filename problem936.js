const assert = require('assert');
const { TimeLogger, Tracer } = require('@dn0rmand/project-euler-tools');

const MAX = 50;

class Tree {
    static nextId = 0;

    constructor(parent, id) {
        this.id = id === undefined ? Tree.nextId++ : id;
        this.nodes = [];
        this.parent = parent;
    }

    render(deep) {
        deep ??= 0;
        if (deep) {
            let prefix = '';
            for (let i = 1; i < deep; i++) {
                prefix += '|   ';
            }
            console.log(prefix + '|');
            console.log(`${prefix}+-- X (${this.degree})`);
        } else {
            console.log(`X (${this.degree})`);
        }
        for (const t of this.nodes) {
            t.render(deep + 1);
        }
    }

    clone(id, parent) {
        const newTree = new Tree(parent, id);
        newTree.nodes = this.nodes.map((n) => n.clone(n.id, newTree));
        return newTree;
    }

    get key() {
        if (this.nodes.length === 0) {
            return '0';
        }
        const keys = [];
        for (const n of this.nodes) {
            keys.push(`${n.key}`);
        }
        keys.sort();
        return `(${keys.join(':')})`;
    }

    get degree() {
        return this.nodes.length + (this.parent ? 1 : 0);
    }

    get isValid() {
        if (this.parent?.degree === this.degree) {
            return false;
        }
        return !this.nodes.some((n) => !n.isValid);
    }

    find(id) {
        if (id === this.id) {
            return this;
        }
        for (const n of this.nodes) {
            const x = n.find(id);
            if (x) {
                return x;
            }
        }
    }

    add(count) {
        for (let i = 0; i < count; i++) {
            this.nodes.push(new Tree(this));
        }
        this.resort();
    }

    resort() {
        this.nodes.sort((a, b) => b.degree - a.degree);
        if (this.parent) {
            this.parent.resort();
        }
    }

    forEach(callback) {
        callback(this);
        for (const t of this.nodes) {
            t.forEach(callback);
        }
    }
}

class State {
    constructor(tree, remaining) {
        this.remaining = remaining;
        this.tree = tree;
    }

    get key() {
        return `${this.remaining}-${this.tree.key}`;
    }

    createNode(parent, count) {
        const nodes = [];
        while (nodes.length !== count) {
            nodes.push(new Tree(parent));
        }
        return nodes;
    }

    add() {
        const states = [];
        const max = Math.min(this.remaining, this.tree.degree || this.remaining / 2);
        this.tree.forEach((node) => {
            if (node.nodes.length === 0) {
                const degree = (node.parent?.degree || 0) + 1;
                for (let i = 1; i <= max; i++) {
                    if (i === degree) {
                        continue;
                    }
                    const nodes = this.createNode(node, i);
                    node.nodes = nodes;
                    const newTree = this.tree.clone(this.tree.id);
                    const newState = new State(newTree, this.remaining - i);
                    states.push(newState);
                    node.nodes = [];
                }
            }
        });
        return states;
    }
}

function P(n) {
    let states = new Map();
    let newStates = new Map();
    let result = new Map();

    states.set('', new State(new Tree(), n - 1));

    while (states.size) {
        newStates.clear();
        for (const state of states.values()) {
            for (const newState of state.add()) {
                if (!newState.tree.isValid) {
                    continue;
                }
                if (newState.remaining === 0) {
                    result.set(newState.tree.key, newState);
                } else {
                    newStates.set(newState.key, newState);
                }
            }
        }
        [states, newStates] = [newStates, states];
    }

    let good = 0;
    for (const k of result.keys()) {
        switch (k) {
            case '(0:0:0:0:0:0)':
            case '((0):0:0:0:0)':
            case '((0):(0):0:0)':
            case '((0:0):0:0:0)':
            case '((0):(0):(0))':
            case '(((0:0)):0:0)':
                good++;
                break;
            default: {
                const n = result.get(k).tree;
                console.log(k);
                n.render();
                console.log();
                break;
            }
        }
    }
    return result.size;
}
/*
GOOD:
0-(0:0:0:0:0:0)
0-((0):0:0:0:0)
0-((0):(0):0:0)
0-((0):(0):(0))
0-(((0:0)):0:0)
0-((0:0):0:0:0)
BAD:
0-(((0:0:0)):0)
0-((0):(0:0):0)
0-(((0):0):0:0)
0-((((0):0)):0)
0-(((0:0)):(0))
*/
function S(max, trace) {
    const tracer = new Tracer(trace);

    let total = 0;
    for (let n = 0; n < max; n++) {
        tracer.print(() => max - n);
        total += P(n);
    }
    tracer.clear();
    return total;
}

assert.strictEqual(P(7), 6);
assert.strictEqual(S(10), 74);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => S(MAX));
console.log(`Answer is ${answer}`);
