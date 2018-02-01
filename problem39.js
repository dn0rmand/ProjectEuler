let max = 0;
let value = 0;

for(let P = 4; P <= 1000; P++)
{
    let valid = 0;
    for(let A = 1; A < P; A++)
    {
        for(let B = 1; A+B < P; B++)
        {
            let C = P-A-B;
            if (A*A + B*B === C*C)
                valid++;
        }
    }
    if (valid > max)
    {
        max = valid;
        value = P;
    }
}

console.log('Perimeter with the maximum number of solutions is ' + value + ' (' + (max/2) + ' solutions)');