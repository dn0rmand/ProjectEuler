const Sharp = require('sharp');

const { TimeLogger, matrixSmall: Matrix } = require('@dn0rmand/project-euler-tools');

const MODULO = 7;

function createMatrix(size, reversed) {
    const m = new Matrix(size, size);
    let y0 = size - 1;
    let y1 = 1;
    for (let x = 0; x < size; x++) {
        if (reversed) {
            m.set(x, y0, 1);
            m.set(x, y1, 1);
        } else {
            m.set(y0, x, 1);
            m.set(y1, x, 1);
        }
        y0 = (y0 + 1) % size;
        y1 = (y1 + 1) % size;
    }
    return m;
}

class Image {
    constructor(width, height, pixels) {
        this.current = this.toMatrix(pixels, width, height);
        this.size = Math.max(width, height);

        this.M = createMatrix(this.size, false);
    }

    toMatrix(pixels, width, height) {
        const size = Math.max(height, width);

        const m = new Matrix(size, size);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const idx = (y % height) * width + (x % width);
                m.set(y, x, pixels[idx] % 7);
            }
        }

        return m;
    }

    toPixels() {
        const pixels = new Uint8Array(this.size * this.size);
        const m = this.current;
        let idx = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const v = m.get(y, x);
                pixels[idx++] = Math.round(v * (256 / 7));
            }
        }
        return pixels;
    }

    static async create() {
        const img = Sharp('data/bonus_secret_statement.png');

        const metadata = await img.metadata();
        const w = metadata.width;
        const h = metadata.height;

        const pixels = await img.extractChannel(0).raw().toBuffer();
        const image = new Image(w, h, pixels);

        return image;
    }

    async saveFrame() {
        const pixels = this.toPixels();
        let image = new Sharp(pixels, {
            raw: {
                width: this.size,
                height: this.size,
                channels: 1,
            },
        });
        await image.toFile(`frames/secret-frame.png`);
    }

    compare(m1, m2) {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const v1 = m1.get(y, x);
                const v2 = m2.get(y, x);

                if (v1 !== v2) {
                    throw 'Different';
                }
            }
        }
    }

    fastStep(count) {
        const m1 = this.M.pow(count, MODULO, true);
        const a = m1.multiply(this.current, MODULO);
        const b = this.current.multiply(m1, MODULO);

        this.current = a.add(b, MODULO);
    }

    step() {
        const a = this.M.multiply(this.current, MODULO);
        const b = this.current.multiply(this.M, MODULO);
        const m_next = a.add(b, MODULO);

        const next = new Matrix(this.size, this.size);

        for (let x = 0; x < this.size; x++) {
            const x0 = (x + this.size - 1) % this.size;
            const x1 = (x + 1) % this.size;

            for (let y = 0; y < this.size; y++) {
                const y0 = (y + this.size - 1) % this.size;
                const y1 = (y + 1) % this.size;
                const px = (this.current.get(y, x0) + this.current.get(y, x1)) % MODULO;
                const py = (this.current.get(y0, x) + this.current.get(y1, x)) % MODULO;

                next.set(y, x, (px + py) % MODULO);
            }
        }

        this.compare(next, m_next);

        this.current = next;
    }
}

async function solve() {
    const image = await Image.create();

    await image.saveFrame();

    image.fastStep(12);

    // const steps = 2;
    // for (let step = 1; step <= steps; step++) {
    //     image.step(step);
    // }

    await image.saveFrame();

    return 'Look at the image';
}

TimeLogger.wrapAsync('', async () => {
    const answer = await solve();
    console.log(`Answer is ${answer}`);
});
