const assert = require('assert');
const { Tracer, TimeLogger, chineseRemainder } = require('@dn0rmand/project-euler-tools');

const lowPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

function final(options) {
    const used = new Uint8Array(100);

    function inner(index) {
        if (index >= options.length) {
            return true;
        }
        for (let i of options[index].indexes) {
            if (used[i]) {
                continue;
            }
            used[i] = true;
            const ok = inner(index + 1);
            used[i] = false;
            if (ok) {
                return true;
            }
        }
        return false;
    }

    options = options.filter((o) => o.indexes.length > 1);
    return inner(0);
}

function shrinkMore(multiples) {
    let done = false;

    while (!done) {
        done = true;
        for (const om of multiples) {
            const { value, indexes } = om;
            const idx = indexes.find(
                (index) => !multiples.some((o) => o.value !== value && o.indexes.includes(index))
            );
            if (idx !== undefined) {
                done = false;
                om.indexes = [idx];
            }
        }
        if (!done) {
            multiples = multiples.filter((o) => o.indexes.length > 1);
        }
    }

    return multiples;
}

function quickCheck(value) {
    for (const p of lowPrimes) {
        if (value % p === 0) {
            return true;
        }
    }
    return false;
}

function getOption(value, length) {
    const indexes = [];
    if (quickCheck(value)) {
        for (let i = 2; i <= length; i++) {
            if (value % i === 0) {
                indexes.push(i - 1);
            }
        }
    }
    return { value, indexes };
}

function getOptions(start, length) {
    const options = [];

    let noOptions = 0;
    let jumpTo = 0;

    for (let n = 0; n < length; n++) {
        const v = n + start;
        const option = getOption(v, length);
        if (option.indexes.length === 0) {
            jumpTo = jumpTo || v + 1;
            noOptions++;
            if (noOptions > 1) {
                return { jumpTo, bad: true };
            }
        }
        options.push(option);
    }

    let done = false;

    while (!done) {
        done = true;
        const oneOptions = options.filter((o) => o.indexes.length === 1);
        for (const { indexes, value } of oneOptions) {
            const idx = indexes[0];
            const others = options.filter((o2) => value !== o2.value && o2.indexes.includes(idx));
            if (others.length > 0) {
                done = false;
                others.forEach((o) => {
                    o.indexes = o.indexes.filter((i) => i !== idx);
                    if (o.indexes.length === 0) {
                        noOptions++;
                    }
                });
                if (noOptions > 1) {
                    return { options, bad: true };
                }
            }
        }
    }

    return { options: options.filter((o) => o.indexes.length > 1), bad: false };
}

function isDivisibleRange(start, length) {
    let { options, jumpTo, bad } = getOptions(start, length);

    if (!options) {
        return -jumpTo;
    }

    if (bad) {
        return 0;
    }

    if (options.length) {
        options = shrinkMore(options);
        if (!options) {
            return 0;
        }
    }

    if (options.length) {
        const result = final(options);
        return result ? 1 : 0;
    }

    return 1;
}

function divisibleRanges(length, end) {
    const ranges = [1];

    let start = 1;
    while (start < end) {
        start++;
        const v = isDivisibleRange(start, length);
        if (v < 0) {
            start = -v - 1;
        } else if (v) {
            ranges.push(start);
        }
    }
    return ranges;
}

function solve(length) {
    if (length & 1) {
        throw 'Only even numbers are supported.';
    }

    const sequence = new Uint8Array(length / 2).map((_, i) => i + 1).reduce((a, b) => a.lcm(b), 1);
    const miniRanges = divisibleRanges(length / 2, sequence);
    const ranges = [];

    const tracer = new Tracer(true);

    for (let idx = 0, offset = 0; ranges.length < length; idx++, offset += sequence) {
        tracer.print((_) => `${idx}: ${length - ranges.length}`);

        miniRanges.forEach((range) => {
            const start = range + offset;
            if (isDivisibleRange(2 * start - 1, length) > 0) {
                ranges.push(2 * start - 1);
            }
            if (isDivisibleRange(2 * start, length) > 0) {
                ranges.push(2 * start);
            }
        });
    }
    tracer.clear();

    return ranges[length - 1];
}

function time(length, expected) {
    assert.strictEqual(
        TimeLogger.wrap(`${length}`, () => solve(length)),
        expected
    );
}

assert.strictEqual(solve(4), 6);
time(22, 942457);
time(24, 11832490);
time(26, 62162072);
console.log('Test passed');

const answer = TimeLogger.wrap('', (_) => solve(36));
console.log(`Answer is ${answer}`);
