//
// Javascript too slow. Solved with C# in 3 hours 30 minutes
//
const assert = require('assert');
const timeLogger = require('tools/timeLogger');
const ProgressBar = require('progress');

const MODULO = 2n**60n;
const MAX    = 10n ** 10n;//12n;

const max = (a, b) => a > b ? a : b;

let REF_N = undefined;
let STEPS = 0n;
let BAR = undefined;

const MODULO1 = MODULO - 1n;

function yy(k, xCurrent, xPrevious)
{
    if (k >= REF_N) 
        return xCurrent;

    BAR.tick();
    
	const left  = yy(k+k  , (3n * xCurrent + 2n * xPrevious) % MODULO, xCurrent);
    const right = yy(k+k+1, (2n * xCurrent + 3n * xPrevious) % MODULO, xCurrent);
    
	return MODULO1 - max(left, right);
}

function A(n, trace)
{
    let bar;

    if (trace)
    {
        bar = new ProgressBar('  Calculating :percent [:bar] :current', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: Number(n),
            renderThrottle: 5000,
        });
    }

    try
    {
        BAR   = bar || { tick: () => {} };
        REF_N = n;
        STEPS = n;
        return yy(1, 1n, 0n);
    }
    finally
    {
        console.log();
    }
}

assert.equal(A(4n), 8);
assert.equal(A(10n), MODULO - 34n);

assert.equal(A(1000n), 101881n);

console.log('Tests passed');

const answer = timeLogger.wrap('', () => A(MAX, true));

console.log(`Answer is ${answer}`);