const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');
const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p089_roman.txt')
});

const romanNumeral = require("romans");
const assert = require('assert');

function simplify(value)
{
    let r = romanNumeral.deromanize(value);
    let result = romanNumeral.romanize(r);
    return value.length - result.length;
}

assert.equal(simplify('XVI'), 0);
assert.equal(simplify('VVVI'), 1);
assert.equal(simplify('IIIIIIIIIIIIIIII'), 13);
assert.equal(simplify('VVIIIIII'), 5);
assert.equal(simplify('VIIIIIIIIIII'), 9);
assert.equal(simplify('XIIIIII'), 4);

let totalSaved = 0;

readInput
.on('line', (line) => { 
    totalSaved += simplify(line);
})

.on('close', () => {
    console.log(totalSaved + "  characters saved by writing each of the roman numbers in their minimal form");
    process.exit(0);
});
