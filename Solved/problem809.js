require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1e15;
const TWO = 2;

let value = 13;
let previous;
do {
  previous = value;
  value = (TWO.modPow(previous + 3, MODULO) + MODULO - 3) % MODULO;
} while (value != previous);

console.log(`Answer is ${value}`);
