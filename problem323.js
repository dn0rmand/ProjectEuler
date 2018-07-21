
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
        let total  = 0;
        let old    = 0;
        let stable = 100;
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
            let v = Math.floor((total / i)*10000000000);
            if (old === v)
            {
                stable--;
                if (stable === 0)
                    return v / 10000000000;
            }
            else
            {
                stable = 100;
                old    = v;
                if ((i % 2000000) === 0)
                {
                    fs.writeFileSync("323.data", JSON.stringify({ total: total, count: i}));                    
                    process.stdout.write('\r' + v);
                }
            }
        }
    }

    let v1 = solve();
    console.log('\n');
    announce(323, 'Answer is' + v1);
}

bruteForce();

function smartVersion()
{
    function process() 
    {    
        function extendDistribution(d) 
        {
            const r = [];
            d.forEach((v, i) => {
                r[i]      = (r[i] || 0) + (v / 2);
                r[i + 1]  = (r[i + 1] || 0) + (v / 2);
            })
            return r;
        }
        
        let distribution = [1];
        const lengths    = [];
        
        for (let i = 1; i <= 32; ++i) 
        {
            distribution = extendDistribution(distribution);
            let c = 0;
            for (let j = i; j > 0; --j) 
            {
                let d = distribution[j];
                let t = i - j;
                let l = lengths[t] || 0;
                c += d * (l + 1);
            }
            lengths[i] = (c + distribution[0]) / (1 - distribution[0]);
        }
        return lengths[32].toFixed(10);
    }

    let result = process();
    console.log('Answer is', result);
}

//smartVersion();