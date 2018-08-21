// Largest exponential
// Problem 99 
// Comparing two numbers written in index form like 211 and 37 is not difficult, as any calculator would confirm 
// that 211 = 2048 < 37 = 2187.

// However, confirming that 632382518061 > 519432525806 would be much more difficult, as both numbers contain over 
// three million digits.

// Using base_exp.txt (right click and 'Save Link/Target As...'), a 22K text file containing one thousand lines with 
// a base/exponent pair on each line, determine which line number has the greatest numerical value.

// NOTE: The first two lines in the file represent the numbers in the example given above.

// log(x^y) = y*log(x)

const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p099_base_exp.txt')
});

let line = 0;
let max  = 0;
let maxLine = 0;

readInput
.on('line', (input) => { 
    line++;

    var v = input.split(',');
    var x = +(v[0]);
    var y = +(v[1]);
    var value = y * Math.log10(x);

    if (value > max)
    {
        max = value;
        maxLine = line;
    }
})

.on('close', () => {
    console.log("Line " + maxLine + ' has the greatest numerical value.');
    process.exit(0);
});
