
const announce = require('./tools/announce');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

function bruteForce()
{
    const BIT16 = Math.pow(2, 16);
    const BIT15 = BIT16-1;

    function N()
    {
        let i = 0
        let x1 = 0;
        let x2 = 0;

        while (true)
        {
            i++;
            x1 |= chance.integer({min:0, max:BIT15});
            x2 |= chance.integer({min:0, max:BIT15});
            if (x1 === BIT15 && x2 === BIT15)
                return i;
        }
    }

    function solve()
    {
        let precision = 100000000;
        let stableCount = 1000;
        let total  = 0;
        let old    = 0;
        let stable = stableCount;
        let i      = 0;

        let input = fs.readFileSync("323.data");
        input = JSON.parse(input);
        total = input.total; // 40170917412;
        i     = input.count; // 6321000000;

        while(++i)
        {
            let n = N();

            total = total + n;
            if (total > Number.MAX_SAFE_INTEGER)
            {
                announce(323, "Need Big-Integer :(" );
                throw "NEED BIGINT";
            }
            let v = Math.floor((total / i)*precision);
            if (old === v)
            {
                stable--;
                if (stable === 0)
                    return v / precision;
            }
            else
            {
                stable = stableCount;
                old    = v;
                if ((i % 1000000) === 0)
                {
                    fs.writeFileSync("323.data", JSON.stringify({ total: total, count: i}));                    
                    process.stdout.write('\r' + v);
                }
            }
        }
    }

    let v1 = solve();
    console.log('\n');
    announce(323, 'Answer is ' + v1);
}

function smartVersion()
{
    function process()
    {
        let total = 0;
        let min = Math.pow(10,-11);

        for (let turn = 0, x = 1 ; x >= min ; turn++)
        {           
            x = Math.pow(0.5, turn);
            x = 1 - Math.pow(1-x, 32);

            if (x < min)
                break;

            total += x;
        }

        return total.toFixed(10);
    }

    let result = process();

    console.log('Answer is', result);
}

//bruteForce();

smartVersion();