// Almost right-angled triangles I
// Problem 223 
// Let us call an integer sided triangle with sides a ≤ b ≤ c barely acute if the sides satisfy 
// a2 + b2 = c2 + 1.

// How many barely acute triangles are there with perimeter ≤ 25,000,000?

function solve(max)
{
    // a+b+c <= max
    // a <= b <= c => a <= max/3
    // a = 1 => b+c <= max-1 => b <= (max-1)/2 
    
    let maxA = Math.floor(max / 3);
    let maxB = Math.floor(max / 2);

    let total = 0;
    let percent = '';
    for (let a = 1; a < maxA; a++)
    {
        let p = ((a * 100) / maxA).toFixed(0);
        if (p !== percent)
        {
            percent = p;
            process.stdout.write('\r'+percent+'%');
        }

        for (let b = a; b < maxB; b++)
        {
            // a2+b2=c2+1 => c = sqrt(a2+b2-1)
            let c2 = (a*a) + (b*b) - 1;

            if (c2 > Number.MAX_SAFE_INTEGER)
                throw "TOO BIG";
            
            let c = Math.sqrt(c2);
            if (c === Math.floor(c))
            {
                total++;
                if (total > Number.MAX_SAFE_INTEGER)
                    throw "TOO BIG";
            }
        }
    }

    console.log('.');
    return total;
}

let answer = solve(25000000);

console.log(answer, 'barely acute triangles with a perimeter ≤ 25,000,000?');