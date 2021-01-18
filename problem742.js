function solve(N)
{
    let sides = N;

    let min = Number.MAX_SAFE_INTEGER;

    function inner(y, sidesLeft, area, offset)
    {
        while (true) {
            if (area >= min)
                break;

            if (offset < 0 && sidesLeft) 
                break;
            
            if (sidesLeft === 0) {
                if (area)
                    min = Math.min(min, 2*area);
                break;
            } else if (sidesLeft < 2) {
                break; // can't do it
            } else if (sidesLeft === 2) {
                area = 2*area + 2*y;
                min = Math.min(area, min);
                break;
            } else if (offset) {
                area += 2*y + offset;
                y += offset;
                sidesLeft -= 4;
                offset -= 1;
            } else {
                area += 2*y;
                y += offset;
                sidesLeft  -= 2;
                offset -= 1;
            }
        }
    }

    for (let offset = 1; min === Number.MAX_SAFE_INTEGER; offset++) 
    {
        inner(0, sides, 0, offset);
        inner(0.5, sides-2, 0, offset);
    }

    console.log(`A(${N})=${min}`);
    return min;
}

solve(4);
solve(8);
solve(40);
solve(100);

