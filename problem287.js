const N = 7;
const SIZE = (2**N) / 2;

const V1 = 2**(N-1);
const V2 = 2**(N+N-2);

const images = [];

function getPixel(x, y) {
    const p1 = (x - V1);
    const p2 = (y - V1);

    const v = p1*p1 + p2*p2;
    if (v <= V2) {
        return '#';
    } else {
        return '.';
    }
}

for(let y = 0; y < SIZE; y++) {
    const row = [];
    for (let x = 0; x < SIZE; x++) {
        row.push(getPixel(x, y));
    }
    console.log(row.join(''));
}
