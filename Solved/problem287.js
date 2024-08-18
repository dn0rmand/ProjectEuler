const assert = require('assert');
const { TimeLogger } = require('@dn0rmand/project-euler-tools');

const testImage = [
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
];
const getIsBlack = (N) => {
    if (N === 2) {
        return (x, y) => {
            return testImage[y][x] === 1;
        };
    } else {
        const V1 = 2 ** (N - 1);
        const V2 = 2 ** (N + N - 2);

        if (V1 > Number.MAX_SAFE_INTEGER || V2 > Number.MAX_SAFE_INTEGER) {
            throw 'Need BigInt';
        }

        return (x, y) => {
            const p1 = x - V1;
            const p2 = y - V1;

            const v = p1 * p1 + p2 * p2;
            if (v > Number.MAX_SAFE_INTEGER) {
                throw 'BigInt Needed';
            }
            return v <= V2;
        };
    }
};

function encode(N) {
    const isBlack = getIsBlack(N);

    function getLength(x, y, size, deep) {
        if (size === 1) {
            return 2;
        }

        if (size & 1) {
            throw 'Error';
        }

        if (deep > 0) {
            const b1 = isBlack(x, y);
            const b2 = isBlack(x + size - 1, y);
            const b3 = isBlack(x + size - 1, y + size - 1);
            const b4 = isBlack(x, y + size - 1);

            if (b1 === b2 && b1 === b3 && b1 === b4) {
                return 2;
            }

            if (size === 2) {
                return 9;
            }
        }

        const size2 = size / 2;
        return (
            1 +
            getLength(x, y, size2, deep + 1) +
            getLength(x + size2, y, size2, deep + 1) +
            getLength(x + size2, y + size2, size2, deep + 1) +
            getLength(x, y + size2, size2, deep + 1)
        );
    }

    const length = getLength(0, 0, 2 ** N, 0);
    return length;
}

assert.strictEqual(encode(2), 16);
console.log('Test passed');

const answer = TimeLogger.wrap('', () => encode(24));

console.log(`Answer is ${answer}`);
