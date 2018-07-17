const BIT16 = Math.pow(2, 16);
const BIT15 = BIT16-1;

function *Y()
{
    while (true)
    {
        let r1 = Math.random();
        let y1 = Math.floor(r1*BIT16) 
        let r2 = Math.random();
        let y2 = Math.floor(r2*BIT16) 
        
        yield { y1:y1, y2:y2 };
    }
}

function N()
{
    let i = 0
    let x1 = 0;
    let x2 = 0;

    for (let y of Y())
    {
        i++;
        x1 |= y.y1;
        x2 |= y.y2;
        if (x1 === BIT15 && x2 === BIT15)
            return i;
    }
}

function bruteForce()
{
    let total  = 0;
    let old    = 0;
    let stable = 100;
    let i      = 0;

    while(++i)
    {
        total = total + N();
        if (total > Number.MAX_SAFE_INTEGER)
            throw "NEED BIGINT";
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
            if ((i % 1000000) === 0)
                process.stdout.write('\r' + v + '    ');
        }
    }
}

let v1 = bruteForce();
console.log('\n');
console.log('Answer is', v1);