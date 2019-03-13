const prettyTime= require("pretty-hrtime");

const logCache = [];

function digits(value, base)
{
    let l = logCache[base];
    if (l === undefined)
    {
        l = Math.log10(base);
        logCache[base] = l;
    }
    let s1 = Math.log10(value+1) / l;

    return Math.ceil(s1);
}

function getDigitCount(a, b, c, base)
{
    let s1 = digits(a, base);
    let s2 = digits(b, base);
    let s3 = digits(c, base);
    return s1+s2+s3;
}

function isTooBig(a, b, c, base)
{
    let count = getDigitCount(a, b, c, base);
    return (count > base);
}

function isTooSmall(a, b, c, base)
{
    let count = getDigitCount(a, b, c, base);
    return count < base;
}

let $used = new Uint8Array(20);

function isPandigital(a, b, c, base)
{
    $used.fill(0);

    while (a > 0)
    {
        let d = a % base;
        if ($used[d])
            return false;
        $used[d] = 1;
        a = (a - d) / base;
    }

    while (b > 0)
    {
        let d = b % base;
        if ($used[d])
            return false;
        $used[d] = 1;
        b = (b - d) / base;
    }

    while (c > 0)
    {
        let d = c % base;
        if ($used[d])
            return false;
        $used[d] = 1;
        c = (c - d) / base;
    }

    return true;
}

function *triangles(maxBase)
{
    function gcd (a, b)
    {
        while (b !== 0)
        {
            let c = a % b;
            a = b;
            b = c;
        }
        return a;
    };

    let triangle = {a:0, b:0, c:0};

    for (let n = 1; ; n++)
    {
        process.stdout.write(`\r${n}`);

        let n2 = n*n;
        let m2 = (n+1)*(n+1);
        let a = m2 + 2*n2 + n;
        let b = a + n;
        let c = m2 - n2;

        if (isTooBig(a, b, c, maxBase))
            break;

        let n3 = n % 3;

        for (let m = n+1; ; m++)
        {
            if (n3 === (m % 3))
                continue;

            if (gcd(m, n) === 1)
            {
                m2 = m*m;

                a = m2 + n2 + m*n;
                b = n2 + 2*(m*n);
                c = m2 - n2;

                if (isTooBig(a, b, c, maxBase))
                    break;

                // reuse object instead of creating a new one.

                triangle.a = a;
                triangle.b = b;
                triangle.c = c;

                yield triangle;
            }
        }
    }
}

function solve(minBase, maxBase)
{
    let total = 0;

    for (let triangle of triangles(maxBase))
    {
        let done = false;

        let a = 0;
        let b = 0;
        let c = 0;

        while (! done)
        {
            a += triangle.a;
            b += triangle.b;
            c += triangle.c;

            if (isTooSmall(a, b, c, minBase))
                continue;

            if (isTooBig(a, b, c, maxBase))
            {
                done = true;
                break;
            }

            for (let base = minBase; base <= maxBase; base++)
            {
                let l = getDigitCount(a, b, c, base);

                if (l === base)
                {
                    if (isPandigital(a, b, c, base))
                        total += a;

                    break; // length won't get bigger but base will
                }
                else if (l < base)
                {
                    break; // length won't get bigger but base will
                }
            }
        }
    }
    console.log('');
    return total;
}

let timer = process.hrtime();
let answer = solve(9, 18);
timer = process.hrtime(timer);
console.log('Answer is', answer, "calculated in ", prettyTime(timer, {verbose:true}));
console.log("Should be 474766783");
console.log('Done');