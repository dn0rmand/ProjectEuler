const assert = require('assert');
const MODULO = 1000000007;
const MODULO_N = BigInt(MODULO);
const MAX = 1E7;

const $factorial = [];

function factorial(n)
{
    if (n < 2)
        return 1n;

    if ($factorial[n])
        return $factorial[n];

    let r = BigInt(n) * factorial(n-1);

    $factorial[n] = r;

    return r;
}

function nCr(n, r)
{
    let N = factorial(n);
    let R = factorial(r);
    let NR = factorial(n-r);

    let res = N / (R*NR);

    return Number(res % MODULO_N);
}

function solve(n, trace)
{
    function part2(p5, p3, p2)
    {
        let count = p2+p3+p5;
        if (count & 1)
            return 0;

        let v = [p2, p3, p5];

        v.sort((a,b) => a-b);
        if (v[0] == 0)
            return v[1]+1;
        if (v[0] == 1)
            return (2 * (v[1]+1)) % MODULO;

        let expected = ((v[0]+1)*(v[1]+1)) % MODULO;
        return expected;
        /*
        let states = [{p5: p5, p3: p3, p2: p2}];
        let same = 0;

        for (let i = 0; i < count/2; i++)
        {
            let newStates = [];
            for (let state of states)
            {
                if (state.p2)
                {
                    let s = { p2: state.p2-1, p3: state.p3, p5: state.p5};
                    let k = `${s.p2}.${s.p3}.${s.p5}`;
                    newStates[k] = s;
                }
                if (state.p3)
                {
                    let s = { p2: state.p2, p3: state.p3-1, p5: state.p5};
                    let k = `${s.p2}.${s.p3}.${s.p5}`;
                    newStates[k] = s;
                }
                if (state.p5)
                {
                    let s = { p2: state.p2, p3: state.p3, p5: state.p5-1};
                    let k = `${s.p2}.${s.p3}.${s.p5}`;
                    newStates[k] = s;
                }
            }
            newStates = Object.values(newStates);
            if (newStates.length === states.length)
            {
                same++;
                if (same > 20)
                    break;
            }
            else
                same = 0;

            states = newStates;
        }

        let total = states.length % MODULO;

        // if (total != expected && v[0] < 3)
        //     debugger;

        return total;
        */
    }

    function part1(callback)
    {
        let total = 0;
        let end = Math.floor(n / 5);
        for(let x = 0; ; x++)
        {
            let f2 = 5*x;
            if (f2 > n)
                break;
            if (trace)
                process.stdout.write(`\r${ end - f2 }    `);
            for(let y = 0; ; y++)
            {
                let f3 = 3*y;
                let target = n - f2 - f3;
                if (target < 0)
                    break;
                if (target % 2 === 0)
                {
                    let z = target / 2;
                    // if (trace)
                    //     process.stdout.write(`\r${ end - f2 } - ${x}, ${y}, ${z}    `);
                    total = (total + part2(x, y, z)) % MODULO;
                }
            }
        }

        if (trace)
            console.log('\r');
        return total;
    }

    return part1();
}

// assert.equal(solve(10), 4);
// assert.equal(solve(100), 3629);

console.log(solve(MAX, true));
