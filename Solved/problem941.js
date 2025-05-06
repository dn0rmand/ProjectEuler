const assert = require('assert');
const { TimeLogger, Tracer, digits: getDigits } = require('@dn0rmand/project-euler-tools');

const MAX = 1e7;
const MODULO = 1234567891;

const A = TimeLogger.wrap('Building A sequence', () => {
    const a = [];
    const tracer = new Tracer(true);

    for (let p = 0, i = 1; i <= MAX; i++) {
        tracer.print(() => MAX - i);
        p = (p.modMul(920461, 1e12) + 800217387569) % 1e12;
        a.push(p);
    }
    tracer.clear();
    return a;
});

function getNextWord(word) {
    while (word.length < 12) {
        word = [...word, ...word];
    }
    word = word.slice(0, 12);
    while (word[word.length - 1] === 9) {
        word.pop();
    }
    word[word.length - 1]++;
    if (word.length == 12) {
        return word;
    }
    return getNextWord(word);
}

function getLyndonWord(value) {
    let min = value;

    for (let i = 1; i <= 12; i++) {
        const d = value % 10;
        value = (value - d) / 10 + 1e11 * d;
        if (value < min) {
            min = value;
        }
    }
    return min;
}

function isLyndonWord(value) {
    if (Array.isArray(value)) {
        value = value.reduce((a, v) => a * 10 + v, 0);
    }

    let min = value;

    for (let i = 1; i < 12; i++) {
        const d = value % 10;
        value = (value - d) / 10 + 1e11 * d;
        if (value <= min) {
            return false;
        }
    }
    return true;
}

function decrement(w, index) {
    if (w[index] === 0) {
        w[index] = 9;
        return decrement(w, index - 1);
    } else {
        w[index]--;
        return index;
    }
}

const FOUND = 1;
const IMPOSSIBLE = -1;
const CONTINUE = 0;

function findIndex(part1, part2, digits) {
    const length = 24;
    const get = (index) => {
        if (index < 12) {
            return part1[index];
        } else {
            return part2[index - 12];
        }
    };
    for (let i = 0; i < length; i++) {
        let found = FOUND;
        for (let j = 0; j < digits.length; j++) {
            if (j + i >= length) {
                found = IMPOSSIBLE;
                break;
            }
            if (get(i + j) !== digits[j]) {
                found = CONTINUE;
                break;
            }
        }
        if (found === IMPOSSIBLE) {
            break;
        }
        if (found === FOUND) {
            return i;
        }
    }
    return -1;
}

function asDigits(value) {
    const w = getDigits(value);

    while (w.length < 12) {
        w.unshift(0);
    }

    return w;
}

function getPreviousValue(value) {
    let lyndonValue = getLyndonWord(value);
    let w = asDigits(lyndonValue);

    if (lyndonValue === value) {
        return { previous: lyndonValue, offset: 0 };
    }

    const digits = asDigits(value);

    let w2 = getNextWord(w);
    let offset = findIndex(w, w2, digits);

    let index = 10;

    if (offset >= 0) {
        return { previous: lyndonValue, offset };
    }

    while (true) {
        index = decrement(w, index);
        if (isLyndonWord(w)) {
            w2 = getNextWord(w);
            offset = findIndex(w, w2, digits);

            if (offset >= 0) {
                break;
            }
        }
    }
    return { previous: w.reduce((a, v) => a * 10 + v, 0), offset };
}

function progress(index) {
    index = index % 20;
    if (index > 10) {
        index = 20 - index;
    }
    const s = new Array(11).fill(' ');
    s[index] = '🔴';
    return s.join('');
}

function buildIndexes(length, trace) {
    if (!length) {
        throw 'Error: Missing length';
    }

    const indexes = [];

    const tracer = new Tracer(trace, 'Indexing:');
    for (let i = 0; i < length; i++) {
        tracer.print(() => length - i);
        const value = A[i];
        let { previous, offset } = getPreviousValue(value);

        if (!isLyndonWord(previous)) {
            if (previous !== 9900990099) {
                previous -= previous % 1e6;
            } else {
                offset = -offset;
                previous -= previous % 1e8;
            }
        }

        indexes.push({ value, previous, offset });
    }
    tracer.clear();

    return indexes;
}

function sortIndexes(indexes, trace) {
    const tracer = new Tracer(trace, 'Sorting:');
    tracer.speed = 250;

    let idx = 0;
    indexes.sort((a, b) => {
        tracer.print(() => progress(idx++));
        const diff = a.previous - b.previous;
        if (diff === 0) {
            return a.offset - b.offset;
        }
        return diff;
    });

    tracer.clear();
}

function F(length, trace) {
    const indexes = buildIndexes(length, trace);

    sortIndexes(indexes, trace);

    let total = 0;
    const tracer = new Tracer(trace, 'Adding:');
    for (let i = 0; i < indexes.length; i++) {
        tracer.print(() => indexes.length - i);
        const v = indexes[i].value;
        total = (total + v.modMul(i + 1, MODULO)) % MODULO;
    }
    tracer.clear();

    return total;
}

assert.strictEqual(F(2), 2194210461325 % MODULO);
assert.strictEqual(F(10), 32698850376317 % MODULO);
assert.strictEqual(F(4746), 260537990);
assert.strictEqual(F(4747), 160352362);

const answer = TimeLogger.wrap('', () => F(A.length, true));
console.log(`Answer is ${answer}`);
