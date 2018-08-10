const isPrime = require('../tools/isPrime.js');

function *getSpiral()
{
    let maxX = 0, minX = 0;
    let maxY = 0, minY = 0;
    let x = 0;
    let y = 0;
    let directionX = 1;
    let directionY = 0;
    let value = 1;
    let layer = 1;

    let object = {
        value:value++,
        x:0,
        y:0,
        layer:0
    }
    yield object;

    while(true)
    {
        x += directionX;
        y += directionY;

        object.x = x;
        object.y = y;
        object.value = value++;

        yield object; 

        let turn = false;
        if (x > maxX)
        {
            turn = true;
            maxX = x;
        }
        else if (x < minX)
        {
            turn = true;
            minX = x;
        }
        if (y > maxY)
        {
            turn = true;
            maxY = y;
        }
        else if (y < minY)
        {
            turn = true;
            minY = y;
        }

        if (turn)
        {
            // Time to turn
            if (directionX !== 0)
            {
                directionY = directionX;
                directionX = 0;
                if (directionY === 1)
                    object.layer++;
            } 
            else if (directionY !== 0)
            {
                directionX = -directionY;
                directionY = 0;
            }
            else
                throw "Not valid";
        }
    }
}

let spiral = getSpiral();
let diagonals = 0;
let primes    = 0;
let layer     = 0;

for(entry of spiral)
{
    if (entry.layer != layer && layer > 1000)
    {
        // Calculate %
        percent = primes / diagonals;
        if (percent < 0.1)
        {
            break;
        }
    }

    layer = entry.layer;

    if (Math.abs(entry.x) === Math.abs(entry.y))
    {
        diagonals++;
        if (isPrime(entry.value))
            primes++;
    }
}

console.log("Size length of the spiral is " + ((diagonals+1)/2));