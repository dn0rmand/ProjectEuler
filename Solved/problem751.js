const getDigits = require('tools/digits');

function getNext(digits)
{
    const θ = +('2.'+digits.join(''));

    function bθ(n)
    {
        if (n < 1) throw "ERROR: n should be at least 1";
        if (n === 1) {
            return θ;
        }

        const b = bθ(n-1);
        const B = Math.floor(b);

        const r = B * (b - B + 1);

        return r;
    }

    function aθ(n) 
    {
        return Math.floor(bθ(n));
    }

    let n = 2;
    let m = 0

    while (m < digits.length) 
    {
        const an = aθ(n++);
        const ds = getDigits(an, 10);

        for(let i = 0; i < ds.length; i++) {
            if (ds[i] !== digits[m]) {
                throw "No match"
            } else {
                m++;
            }
        }
    }
    
    const next = aθ(n);
    return getDigits(next, 10);
}

function solve(bits)
{
    let digits = [];

    while (digits.length < bits) 
    {
        const next = getNext(digits);
        digits = [...digits, ...next];
    }
    digits.length = bits;
    digits = [2,'.', ...digits];
    return digits.join('');
}

const answer = solve(24);
console.log(`Answer is ${answer}`);
