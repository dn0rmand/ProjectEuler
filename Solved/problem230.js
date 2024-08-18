const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const A =
    '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
const B =
    '8214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196';

class Chain {
    constructor(length) {
        this.length = length;
        this.next = undefined;
    }

    getAt(index, A, B) {
        throw 'Error';
    }

    print(deep) {
        throw 'Error';
    }
}

class LeafChain extends Chain {
    constructor(content, length) {
        super(length);
        this.content = content;
    }

    getAt(index, A, B) {
        if (index < 0 || index >= this.length) {
            throw 'Error';
        }
        if (this.content === 'A') {
            return A[index];
        } else {
            return B[index];
        }
    }

    print(deep) {
        process.stdout.write(this.left);
        if (!deep) {
            process.stdout.write('\n');
        }
    }
}

class PairChain extends Chain {
    constructor(left, right) {
        super(left.length + right.length);
        this.left = left;
        this.right = right;
    }

    getAt(index, A, B) {
        if (index >= this.length) {
            throw 'Error';
        }
        if (index < this.left.length) {
            return this.left.getAt(index, A, B);
        } else {
            return this.right.getAt(index - this.left.length, A, B);
        }
    }

    print(deep) {
        this.left.print(1);
        this.right.print(1);
        if (!deep) {
            process.stdout.write('\n');
        }
    }
}

function D(A, B, index) {
    A = A.toString();
    B = B.toString();

    let a = new LeafChain('A', BigInt(A.length));
    let b = new LeafChain('B', BigInt(B.length));
    while (b.length < index) {
        [a, b] = [b, new PairChain(a, b)];
    }

    const letter = b.getAt(index - 1n, A, B);
    return BigInt(+letter);
}

function solve() {
    let answer = 0n;
    for (let n = 17n; n >= 0n; n--) {
        const index = (127n + 19n * n) * 7n ** n;
        const value = D(A, B, index);
        answer = answer * 10n + value;
    }
    return answer;
}

assert.strictEqual(D(1415926535, 8979323846, 35n), 9n);
console.log('Test passed');

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer}`);
