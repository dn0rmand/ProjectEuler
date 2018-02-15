// Concealed Square
// Problem 206 
// Find the unique positive integer whose square has the form 1_2_3_4_5_6_7_8_9_0,
// where each “_” is a single digit.

const big = require('big-integer');

let min = 1010101010;
let max = 1389026623;

for(let value = min ; value < max ; value += 10)
{
    let square = big(value).square();

    let s = square.toString();
    if (s[18] === '0' && 
        s[16] === '9' &&
        s[14] === '8' &&
        s[12] === '7' &&
        s[10] === '6' &&
        s[ 8] === '5' &&
        s[ 6] === '4' &&
        s[ 4] === '3' &&
        s[ 2] === '2' &&
        s[ 0] === '1')
    {
        console.log("Unique positive integer whose square has the form 1_2_3_4_5_6_7_8_9_0 is " + value);
        break;
    }
}
