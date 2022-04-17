const assert = require('assert');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');

let MAX_INDEXES;
let minimum;
let S;

function initializeForTest() {
    S = [0, 15, -14, -7, 20, -13, -5, -3, 8, 23, -26, 1, -4, -5, -18, 5, -16, 31, 2, 9, 28, 3];
    MAX_INDEXES = S.length-1;
    
    minimum = S.reduce((a, v) => a+v);
}

function initializeForRun() {
    MAX_INDEXES = 500500;
    minimum = 0;

    S = [0];

    const MODULO = 2**20;
    const OFFSET = 2**19;
    let t = 0;
    for(let k = 1; k <= MAX_INDEXES; k++) {
        t = (615949 * t + 797807) % MODULO;
        const v = t - OFFSET;

        S.push(v);
        minimum += v;
    }
}

function getIndex(x, y)
{
    return (y*(y-1)/2) + x;
}

function findSmallest(x, y)
{
    let total = 0;
    let width = 1;
    let index = getIndex(x, y);
    if (index >= MAX_INDEXES) 
        return false;

    total = S[index];
    while (true) {
        // Add a row
        index += y++;
        width += 1;
        for(let i = 0; i < width; i++) {
            const idx = index+i;
            if (idx > MAX_INDEXES) {
                index = MAX_INDEXES+1;
                break;
            }
            total += S[index+i];
        }
        if (index > MAX_INDEXES) break;
        // check total
        if (total < minimum) {
            minimum = total;
        }
    }

    return true;
}

function solve(trace)
{
    const tracerY = new Tracer(10, trace);

    let maxY;
    for(maxY = 1; ; maxY++) {
        if (getIndex(1, maxY+1) > MAX_INDEXES) {
            break;
        }
    }

    for(let y = 1; ; y++) {
        tracerY.print(_ => maxY-y);

        if (getIndex(1, y) > MAX_INDEXES) {
            break;
        }

        for(let x = 1; x <= y; x++) {
            if (! findSmallest(x, y)) {
                break;
            }
        }
    }

    tracerY.clear();
    return minimum;
}

initializeForTest();
assert.strictEqual(solve(), -42);

initializeForRun();
const answer = timeLogger.wrap('Solving', _ => solve(true));

console.log(`Answer is ${answer}`);