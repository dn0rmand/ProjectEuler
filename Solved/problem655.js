// Divisible Palindromes
// ---------------------
// Problem 655
// -----------
// The numbers 545, 5995 and 15151 are the three smallest palindromes divisible by 109.
// There are nine palindromes less than 100000 which are divisible by 109.

// How many palindromes less than 10^32 are divisible by 10000019 ?

const prettyTime= require("pretty-hrtime");
const MODULO = 10000019;

function assert(value, expected)
{
    if (value != expected)
    {
        console.log("Error: expecting " + expected + " but got " + value);
        process.exit(-1);
    }
}

const modulos = new Map();

function prepare()
{
    let coef = 1n;

    modulo = BigInt(MODULO);

    for (let count = 1; count <= 32; count++)
    {
        for (let digit = 1n; digit < 10n; digit++)
        {
            let mod = (coef * digit) % modulo;
            let key = count*10 + Number(digit);
            modulos.set(key, Number(mod));
        }

        coef *= 10n;
    }
}

function solve()
{
    let outside = new Uint8Array(MODULO);
    let inside  = new Uint8Array(MODULO);

    function generateOuter(digits, size)
    {
        let first = true;

        function inner(pos, size, mod)
        {
            if (size === 0)
            {
                outside[mod]++;
                return;
            }

            if (! first)
                inner(pos-1, size-2, mod, false);
            else
                first = false;

            let P1 = pos*10;
            let P2 = (digits-pos+1)*10;

            for (let digit = 1; digit < 10; digit++)
            {
                let m1 = modulos.get(P1 + digit);
                let m2 = modulos.get(P2 + digit);

                let mod2 = m1 + m2 + mod;
                while (mod2 >= MODULO)
                    mod2 -= MODULO;

                inner(pos-1, size-2, mod2);
            }
        }

        inner(digits, size, 0);
    }

    function generateInner(digits, size)
    {
        function inner(pos, size, mod)
        {
            if (size === 0)
            {
                inside[mod]++;
                return;
            }
            if (size === 1)
            {
                // case digit 0
                inside[mod]++;

                let P1 = pos*10;

                for (let digit = 1; digit < 10; digit++)
                {
                    let m1 = modulos.get(P1 + digit);
                    let mod2 = m1 + mod;
                    while (mod2 >= MODULO)
                        mod2 -= MODULO;

                    inside[mod2]++;
                }
            }
            else
            {
                // case digit 0
                inner(pos-1, size-2, mod);

                let P1 = pos*10;
                let P2 = (digits-pos+1)*10;

                for (let digit = 1; digit < 10; digit++)
                {
                    let m1 = modulos.get(P1 + digit);
                    let m2 = modulos.get(P2 + digit);

                    let mod2 = m1 + m2 + mod;
                    while (mod2 >= MODULO)
                        mod2 -= MODULO;

                    inner(pos-1, size-2, mod2);
                }
            }
        }

        let s = (digits - size) / 2;
        inner(digits-s, size, 0);
    }

    function innerSolve(digits)
    {
        outside.fill(0);
        inside.fill(0);

        let outerSize = (digits - (digits >> 1));
        outerSize = (outerSize >> 1) << 1;
        let innerSize = digits - outerSize;

        generateOuter(digits, outerSize);
        generateInner(digits, innerSize);

        // consolidate

        let total = 0;
        for (let remainder = 0; remainder < MODULO; remainder++)
        {
            let count1 = outside[remainder];
            if (count1 === 0)
                continue;

            let count2;

            if (remainder === 0)
                count2 = inside[0];
            else
                count2 = inside[MODULO-remainder];

            if (count2 !== 0)
                total += (count1 * count2);
        }

        return total;
    }

    let total = 0;

    for (let d = 8; d <= 32; d++)
    {
        let subTotal = innerSolve(d);

        console.log('', d,'=',subTotal);

        total += subTotal;
    }

    return total;
}

let timer = process.hrtime();
prepare();
answer = solve();
timer = process.hrtime(timer);

console.log('Answer is', answer, 'calculated in', prettyTime(timer, {verbose:true}));
