const assert = require('assert');
const linearRecurrence = require('tools/linearRecurrence');

const MAX_ROW    = 10000;
const MAX_COLUMN = 20000;
const MODULO     = 1000000007;

const data = [
    [    4,      16,      48,     128,     320,     768,    1792,    4096,    9216,    20480],
    [   16,      58,     160,     398,     940,    2154,    4840,   10726,   23524,    51170],
    [   48,     160,     408,     952,    2136,    4696,   10200,   21976,   47064,   100312],
    [  128,     398,     952,    2106,    4524,    9598,   20240,   42530,   89140,   186438],
    [  320,     940,    2136,    4524,    9376,   19316,   39752,   81820,  168432,   346692],
    [  768,    2154,    4696,    9598,   19316,   38858,   78432,  158838,  322444,   655522],
    [ 1792,    4840,   10200,   20240,   39752,   78432,  155896,  311824,  626472,  1262144],
    [ 4096,   10726,   21976,   42530,   81820,  158838,  311824,  617770, 1231684,  2465630],
    [ 9216,   23524,   47064,   89140,  168432,  322444,  626472, 1231684, 2441568,  4865404],
    [20480,   51170,  100312,  186438,  346692,  655522, 1262144, 2465630, 4865404,  9662874],
];

const recurrence = linearRecurrence(data[5]);

function solve(x, y)
{
    const values = [];

    values.push(recurrence.get(x, data[0], MODULO));
    values.push(recurrence.get(x, data[1], MODULO));
    values.push(recurrence.get(x, data[2], MODULO));
    values.push(recurrence.get(x, data[3], MODULO));

    const answer = recurrence.get(y, values, MODULO);

    return answer;
}

assert.equal(solve(10, 20), 988971143);

const answer = solve(MAX_COLUMN, MAX_ROW);
console.log(`Answer is ${answer}`);