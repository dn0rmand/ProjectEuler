const assert = require('assert');
const timeLogger = require('@dn0rmand/project-euler-tools/src/timeLogger');
const Tracer = require('@dn0rmand/project-euler-tools/src/tracer');

require('@dn0rmand/project-euler-tools/src/numberHelper');

const MODULO = 1000000007;
const MAX_N  = 2022;

function analyze() 
{
    const patterns = [];

    function isDominating(n)
    {
        let str = `${n}`;
        const length = str.length;

        let pats = patterns[length];
        if (! pats) {
            patterns[length] = pats = {};
        }

        let l = 0;
        let m = 0;
        let c = 0;

        const d = [0,0,0,0,0,0,0,0,0,0];

        while(n > 0) {
            const digit = n % 10;
            n = (n - digit) / 10;
            l++;
            d[digit]++;
            if (d[digit] > m) {
                m = d[digit];
                c = digit;
            }
        }

        const result = m+m > l;
        if (result) {
            str = str.split('').map(v => +v === c ? 'X' : '#').join('');
            if (! pats[m]) {
                pats = pats[m] = [];
            } else {
                pats = pats[m];
            }
            if (! pats[str]) {
                pats[str] = str;
                pats.size = (pats.size || 0) + 1;
                pats.dots = pats.dots || 0;
                if (str[0] === '#') {
                    pats.dots++;
                }
            }
        }
        return result;
    }

    function brute(n)
    {
        const max = 10**n;

        let total = 0;
        for(let i = 1; i < max; i++) {
            if (isDominating(i)) {
                total++;
            }
        }
        return total;
    }

    assert.strictEqual(isDominating(2022), true);
    assert.strictEqual(isDominating(2021), false);
    assert.strictEqual(brute(4), 603);

    for(let n = 1; n < 8; n++) {
        brute(n);
    }
}

const $ninePowers = (function() {
    const a = new Uint32Array(1012);
    let v = 1;
    for(let i = 0; i <= 1011; i++) {
        a[i] = v;
        v = (v * 9) % MODULO;
    }
    return a;
})();

const $factorials = (function() 
{
    const f = new Uint32Array(MAX_N+1);
    f[0] = 1;
    let v = 1;
    for(let i = 1; i <= MAX_N; i++) {
        v = (v * i) % MODULO;
        f[i] = v;
    }
    return f;
})();

function nCp(n, p)
{
    const top = $factorials[n];
    const bottom = $factorials[p].modMul($factorials[n-p], MODULO);

    return top.modDiv(bottom, MODULO);
}

function calculate(size)
{
    let total = 0;

    const min = Math.floor(size/2)+1;

    for(let digits = min; digits <= size; digits++) 
    {
        const patterns = nCp(size, size-digits);
        const options  = $ninePowers[size - digits + 1];

        total = (total + patterns.modMul(options, MODULO)) % MODULO;
    }

    return total;
}

function D(n, trace)
{
    let value = 0;
    
    const tracer = new Tracer(1, trace);
    for(let size = 1; size <= n; size++) {
        tracer.print(_ => n-size);
        const v = calculate(size);
        value = (value + v) % MODULO;
    }
    tracer.clear();
    return value;
}

assert.strictEqual(D(4), 603);

console.log('Tests passed');

const answer = timeLogger.wrap('', _ => D(MAX_N, true));
console.log(`Answer is ${answer}`);
