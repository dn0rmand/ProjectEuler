// http://oeis.org/A081018

function solve(n)
{
    let total = 0;
    let f0    = 1;
    let f1    = 1;

    for (let x = 3; x < 4*n + 3; x += 4)
    {
        [f0, f1] = [f1, f0+f1];

        total += f1;

        [f0, f1] = [f1, f0+f1];
        [f0, f1] = [f1, f0+f1];
        [f0, f1] = [f1, f0+f1];
    }    
    return total;
}

let answer = solve(15);
console.log("Answer is", answer);