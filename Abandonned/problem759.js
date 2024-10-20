const assert = require("assert");
const { Tracer, TimeLogger, matrixSmall: Matrix, linearRecurrence } = require("@dn0rmand/project-euler-tools");

const MAX = 1e16;
const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);

function fast(n) {
    const matrix = Matrix.fromRecurrence([262144, -688128, 774144, -488960, 190848, -47712, 7640, -756, 42]);
    const id = new Matrix(9, 1);

    id.set(0, 0, 134814336);
    id.set(1, 0, 13472288);
    id.set(2, 0, 1302064);
    id.set(3, 0, 120064);
    id.set(4, 0, 10336);
    id.set(5, 0, 806);
    id.set(6, 0, 57);
    id.set(7, 0, 5);
    id.set(8, 0, 1);

    const m = matrix.pow(n, MODULO);
    const v = m.multiply(id, MODULO);

    return v.get(m.rows - 1, 0);
}

const MAX_64_BITS = 2n ** 64n;
const MASK_64_BITS = MAX_64_BITS - 1n;

const m1 = 0x5555555555555555n; //binary: 0101...
const m2 = 0x3333333333333333n; //binary: 00110011..
const m4 = 0x0f0f0f0f0f0f0f0fn; //binary:  4 zeros,  4 ones ...
const m8 = 0x00ff00ff00ff00ffn; //binary:  8 zeros,  8 ones ...
const m16 = 0x0000ffff0000ffffn; //binary: 16 zeros, 16 ones ...
const m32 = 0x00000000ffffffffn; //binary: 32 zeros, 32 ones
const h01 = 0x0101010101010101n; //the sum of 256 to the power of 0,1,2,3...

function bitCount(n) {
    const count = n >= MAX_64_BITS ? bitCount(n >> 64n) : 0n;

    n &= MASK_64_BITS;

    n = (n & m1) + ((n >> 1n) & m1); //put count of each  2 bits into those  2 bits
    n = (n & m2) + ((n >> 2n) & m2); //put count of each  4 bits into those  4 bits
    n = (n & m4) + ((n >> 4n) & m4); //put count of each  8 bits into those  8 bits
    n = (n & m8) + ((n >> 8n) & m8); //put count of each 16 bits into those 16 bits
    n = (n & m16) + ((n >> 16n) & m16); //put count of each 32 bits into those 32 bits
    n = (n & m32) + ((n >> 32n) & m32); //put count of each 64 bits into those 64 bits

    return count + n;
}

function f(n) {
    if (n === 0n) {
        return 0;
    }

    let factor = 1n;

    while ((n & 1n) === 0n) {
        factor *= 2n;
        n /= 2n;
    }

    const ones = bitCount(n);
    const total = (ones * n * factor).modPow(2n, MODULO_N);
    return Number(total);
}

function S(max, trace) {
    max = BigInt(max);
    const tracer = new Tracer(trace);

    let power = 0;
    let start = 1n;
    let end = max;

    while (2n * start <= max) {
        power++;
        start *= 2n;
    }

    end = max;

    let part1 = fast(power);
    let part2 = 0;

    for (let i = start + 1n; i <= end; i++) {
        tracer.print((_) => end - i);

        part2 = (part2 + f(i)) % MODULO;
    }

    tracer.clear();
    return (part1 + part2) % MODULO;
}

function test() {
    let values = [];

    for (let i = 1n; values.length < 100; i += 2n) {
        console.log(f(i), f(i + 1n));
    }
    console.log(linearRecurrence(values, true));
    process.exit(1);
}

// test();

assert.strictEqual(S(10), 1530);
assert.strictEqual(S(100), 4798445);
assert.strictEqual(S(2 ** 5), 120064);
assert.strictEqual(S(2 ** 6), 1302064);

console.log("Tests passed");

const answer = TimeLogger.wrap("", (_) => S(MAX, true));

console.log(`Answer is ${answer}`);
