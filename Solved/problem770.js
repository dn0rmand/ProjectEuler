const assert = require('assert');
const Tracer = require('tools/tracer');
const timeLogger = require('tools/timeLogger');

// OEIS A032443
// https://oeis.org/A032443

/*
a(n) = (4^n * 2) / (4^n + C(2*n, n))
     = (4^n * 2) / (4^n + 4^n / (sqrt(PI*n)));
     = 2 / (1 + 1 / sqrt(PI*n);
*/

function d(n)
{
    return 2 / (1 + 1/Math.sqrt(n * Math.PI));
}

function slow_g(target, trace)
{
    const tracer = new Tracer(1, trace);

    let answer;
    let a = Math.log10(1/4);
    
    for(let n = 2; ; n++) {
        a = (a + Math.log10(2*n-1)) - Math.log10(2*n);
    
        const D = 1 / (Math.pow(10, a) + 0.5);

        tracer.print(_ => `${n} - ${(target-D).toFixed(10)}`);
        if (D >= target) {
            if (trace) {
                tracer.lastPrint = undefined;
                tracer.print(_ => `${n} - ${D.toFixed(10)}`);
                console.log();
            }
            answer = n;
            break;
        }
    }
    tracer.clear();
    return answer;
}

function g(target)
{
    const tracer = new Tracer(1, true);

    let lastGood = -1;

    let min = 1; let max = 100;

    let a = d(max);
    while (a < target) {
        tracer.print(_ => `${min} - ${max} : ${a.toFixed(10)}`);
        min = max+1;
        max *= 10;
        a = d(max);
    }

    while (min < max) 
    {
        const n = Math.floor((min+max)/2);
        a = d(n);
        tracer.print(_ => `${min} - ${n} - ${max} : ${a.toFixed(10)}`);
        if (a < target) {
            min = n+1;
        } else {
            lastGood = n;
            if (n === max) {
                break;
            }
            max = n;
        }
    }
    tracer.clear();
    return lastGood;
}

assert.strictEqual(slow_g(1.7, false), 10);

const answer1 = timeLogger.wrap('', _ => g(1.9999));
const answer2 = timeLogger.wrap('', _ => slow_g(1.9999, true));

assert.strictEqual(answer2, answer1);
console.log(`Answer is ${answer1} - ${answer2}`);
