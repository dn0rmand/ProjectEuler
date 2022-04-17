require('@dn0rmand/src/numberHelper');

const MODULO = 14 ** 8;
const TWO = 2;

function H(n, x, y) {
    if (n === 0) {
        return (y + 1) % MODULO;
    } else if (n === 1) {
        return (x + y) % MODULO;
    } else if (n === 2) {
        return x.modMul(y, MODULO);
    } else if (n === 3) {
        return x.modPow(y, MODULO);
    } else if (n === 4) {
        let p = 1;
        for (let i = 0; i < y; i++) {
            p = x.modPow(p, MODULO);
        }
        return p;
    } else {
        H(n - 1, x, H(n, x, y - 1));
    }
}

function Ackerman(n) {
    const value = (H(n, 2, n + 3) + MODULO - 3) % MODULO;
    console.log(`${n} -> ${value}`)
    return value;
}

function solve(N) {
    let total = 0;

    for (let n = 0; n <= N; n++) {
        total = (total + Ackerman(n)) % MODULO;
    }

    return total;
}

Ackerman(4);

console.log(`Answer is ${solve(6)}`);