const assert = require('assert');
const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const S_MODULO = 1000000;
const XYZ_MODULO = 10000;
const dxyz_MODULO = 399;

const K1_FACTOR = BigInt(dxyz_MODULO ** 3);

class ExcludeMap {
    constructor() {
        this.keys = new Set();
        this.values = [];
    }

    add(key, value) {
        if (!this.keys.has(key)) {
            this.keys.add(key);
            this.values.push(value);
        }
    }

    asArray() {
        this.keys.clear();
        const v = this.values;
        this.values = undefined;
        return v;
    }
}

class Cuboid {
    constructor(x, y, z, dx, dy, dz) {
        this.x0 = x;
        this.y0 = y;
        this.z0 = z;
        this.x1 = x + dx;
        this.y1 = y + dy;
        this.z1 = z + dz;
        this.excluded = new ExcludeMap();
    }

    clone() {
        return new Cuboid(this.x0, this.y0, this.z0, this.dx, this.dy, this.dz);
    }

    get dx() {
        return this.x1 - this.x0;
    }
    get dy() {
        return this.y1 - this.y0;
    }
    get dz() {
        return this.z1 - this.z0;
    }

    get volume() {
        if (this.$volume === undefined) {
            const exclude = getVolume(this.excluded.asArray());
            this.$volume = this.dx * this.dy * this.dz - exclude;
        }
        return this.$volume;
    }

    get key() {
        if (this.$key === undefined) {
            const k1 = (this.x0 * XYZ_MODULO + this.y0) * XYZ_MODULO + this.z0;
            const k2 = (this.dx * dxyz_MODULO + this.dy) * dxyz_MODULO + this.dz;
            this.$key = BigInt(k1) * K1_FACTOR + BigInt(k2);
        }
        return this.$key;
    }

    equals(other) {
        return (
            this.x0 === other.x0 &&
            this.y0 === other.y0 &&
            this.z0 === other.z0 &&
            this.x1 === other.x1 &&
            this.y1 === other.y1 &&
            this.z1 === other.z1
        );
    }

    exclude(b) {
        this.excluded.add(b.key, b.clone());
    }

    intersect(b) {
        const x0 = Math.max(this.x0, b.x0);
        const x1 = Math.min(this.x1, b.x1);
        const dx = x1 - x0;
        if (dx <= 0) {
            return;
        }
        const y0 = Math.max(this.y0, b.y0);
        const y1 = Math.min(this.y1, b.y1);
        const dy = y1 - y0;
        if (dy <= 0) {
            return;
        }
        const z0 = Math.max(this.z0, b.z0);
        const z1 = Math.min(this.z1, b.z1);
        const dz = z1 - z0;
        if (dz <= 0) {
            return;
        }
        const c = new Cuboid(x0, y0, z0, dx, dy, dz);
        return c;
    }
}

const S = [];

function getS(k) {
    if (S[k] === undefined) {
        if (k <= 55) {
            const A = 100003;
            const B = k.modMul(200003, S_MODULO);
            const C = k.modPow(3, S_MODULO).modMul(300007, S_MODULO);
            S[k] = (A - B + C + S_MODULO) % S_MODULO;
        } else {
            S[k] = (getS(k - 24) + getS(k - 55)) % S_MODULO;
        }
    }
    return S[k];
}

function getCubes(count) {
    const cubes = new Map();

    for (let i = 0, n = 6; i < count; i++, n += 6) {
        const x = getS(n - 5) % XYZ_MODULO;
        const y = getS(n - 4) % XYZ_MODULO;
        const z = getS(n - 3) % XYZ_MODULO;
        const dx = 1 + (getS(n - 2) % dxyz_MODULO);
        const dy = 1 + (getS(n - 1) % dxyz_MODULO);
        const dz = 1 + (getS(n) % dxyz_MODULO);

        const cube = new Cuboid(x, y, z, dx, dy, dz);
        cubes.set(cube.key, cube);
    }
    return [...cubes.values()];
}

function getVolume(cubes, trace) {
    if (cubes.length === 0) {
        return 0;
    }
    const p0 = 'z0';
    const p1 = 'z1';

    cubes.sort((c1, c2) => c1.y0 - c2.y0);

    let total = 0;

    const reInclude = new ExcludeMap();

    const tracer = new Tracer(trace);

    for (let i = 0; i < cubes.length; i++) {
        tracer.print(() => cubes.length - i);
        const a = cubes[i];
        for (let j = i + 1; j < cubes.length; j++) {
            const b = cubes[j];
            if (b.y0 > a.y1) {
                break;
            }
            const c = a.intersect(b);
            if (c) {
                a.exclude(c);
                b.exclude(c);
                reInclude.add(c.key, c);
            }
        }
        total += a.volume;
    }
    tracer.clear();
    const result = total + getVolume(reInclude.asArray(), trace);
    return result;
}

function solve(count, trace) {
    const cubes = getCubes(count);
    return getVolume(cubes, trace);
}

assert.strictEqual(solve(100), 723581599);
assert.strictEqual(solve(5000), 39420934575);

assert.strictEqual(
    TimeLogger.wrap('', () => solve(21336, true)),
    157709881563
);

console.log('Tests passed');

const answer = TimeLogger.wrap('', () => solve(50000, true));
console.log(`Answer is ${answer}`);
