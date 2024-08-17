const { Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const SIZE = 30;
const BOARD_SIZE = SIZE * SIZE;
const STEPS = 50;

class Board {
    constructor(value) {
        this.data = new Array(BOARD_SIZE);
        this.data.fill(value);
    }

    get(x, y) {
        return this.data[y * SIZE + x];
    }

    set(x, y, value) {
        return (this.data[y * SIZE + x] = value);
    }

    at(idx) {
        return this.data[idx];
    }

    put(idx, value) {
        this.data[idx] = value;
    }

    sum() {
        return this.data.reduce((a, v) => a + v, 0);
    }
}

function process(board) {
    function isValid(x, y) {
        return x >= 0 && x < SIZE && y >= 0 && y < SIZE ? 1 : 0;
    }

    function getProb(x, y) {
        if (!isValid(x, y)) {
            return 0;
        }
        const targets = isValid(x - 1, y) + isValid(x + 1, y) + isValid(x, y - 1) + isValid(x, y + 1);
        return board.get(x, y) / targets;
    }

    const next = new Board(0);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const p = getProb(x - 1, y) + getProb(x, y - 1) + getProb(x + 1, y) + getProb(x, y + 1);
            next.set(x, y, next.get(x, y) + p);
        }
    }

    return next;
}

function applyEmptyness(empty, current) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        empty.put(i, empty.at(i) * (1 - current.at(i)));
    }
}

function solve() {
    let empty = new Board(1);

    const tracer = new Tracer(true);
    for (let idx = 0; idx < BOARD_SIZE; idx++) {
        tracer.print(() => BOARD_SIZE - idx);
        let current = new Board(0);
        current.put(idx, 1);
        for (let dings = 0; dings < STEPS; dings++) {
            current = process(current);
        }
        applyEmptyness(empty, current);
    }
    tracer.clear();

    return empty.sum().toFixed(6);
}

const answer = TimeLogger.wrap('', () => solve());
console.log(`Answer is ${answer}`);
