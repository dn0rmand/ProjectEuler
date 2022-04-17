const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const primeHelper = require('@dn0rmand/project-euler-tools/src/primeHelper');
const ProgressBar = require('progress');

const MAX = 500000000;
const MAX_PRIME = Math.ceil(Math.sqrt(MAX)+1);

primeHelper.initialize(MAX_PRIME);

function g(n, trace)
{
    let tick = _ => { };

    if (trace)
    {
        bar = new ProgressBar('  Calculating :percent [:bar]', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: n,
            renderThrottle: 1000,
        });

        tick = _ => bar.tick();
    }

    let total = 0;
    let extra = 0n;

    for(let i = 1; i <= n; i += 2)
    {
        tick();
        tick();
        const p = primeHelper.PHI(i);
        const t = total + p;
        if (t > Number.MAX_SAFE_INTEGER)
        {
            extra += BigInt(total);
            total  = p;
        }
        else
            total = t;
    }
    if (trace)
        console.log();

    return BigInt(total)+extra;
}

assert.equal(g(100), 2007);
console.log('Test passed');

const answer = timeLogger.wrap('', _ => g(MAX, true));
console.log(`Answer is ${answer}`);