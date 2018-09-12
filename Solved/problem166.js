// Criss Cross
// -----------
// Problem 166
// -----------
// A 4x4 grid is filled with digits d, 0 ≤ d ≤ 9.

// It can be seen that in the grid

//             6 3 3 0
//             5 0 4 3
//             0 7 1 4
//             1 2 4 5

// the sum of each row and each column has the value 12. Moreover the sum of each diagonal is also 12.

// In how many ways can you fill a 4x4 grid with the digits d, 0 ≤ d ≤ 9 so that each row, each column,
// and both diagonals have the same sum?

function allWays()
{
    let possibilities = [];

    for (let c1 = 0; c1 <= 9; c1++)
        for (let c2 = 0; c2 <= 9; c2++)
            for (let c3 = 0; c3 <= 9; c3++)
                for (let c4 = 0; c4 <= 9; c4++)
                {
                    let set = [c1, c2, c3, c4];
                    set.sum = c1+c2+c3+c4;
                    possibilities.push(set);
                }

    return possibilities;
}

// A14B
// 0CD0
// 0EF0
// G23H
//
// x2 = sum-C-E-x1
// x3 = sum-G-H-x2
// x4 = sum-D-F-x3
// x5 = sum-A-B-x1
// x4 === x5 => correct!

function solveVertical(d1, d2, sum)
{
    let total = 0;

    let A = d1[0];
    let B = d2[0];
    let C = d1[1];
    let D = d2[1];
    let E = d2[2];
    let F = d1[2];
    let G = d2[3];
    let H = d1[3];

    for (let x1 = 0; x1 <= 9; x1++)
    {
        let x2 = sum-C-E-x1;
        let x3 = sum-G-H-x2;
        let x4 = sum-D-F-x3;
        let x5 = sum-A-B-x1;

        if (x2 < 0 || x2 > 9)
            continue;
        if (x3 < 0 || x3 > 9)
            continue;
        if (x4 < 0 || x4 > 9)
            continue;
        if (x5 < 0 || x5 > 9)
            continue;

        if (x4 !== x5)
            continue;

        total++;
    }

    return total;
}

// A00B
// 1CD2
// 4EF3
// G00H
//
// x2 = sum-C-D-x1
// x3 = sum-B-H-x2
// x4 = sum-E-F-x3
// x5 = sum-A-G-x1
// x4 === x5 => correct!
function solveHorizontal(d1, d2, sum)
{
    let total = 0;

    let A = d1[0];
    let B = d2[0];
    let C = d1[1];
    let D = d2[1];
    let E = d2[2];
    let F = d1[2];
    let G = d2[3];
    let H = d1[3];

    for (let x1 = 0; x1 <= 9; x1++)
    {
        let x2 = sum-C-D-x1;
        let x3 = sum-B-H-x2;
        let x4 = sum-E-F-x3;
        let x5 = sum-A-G-x1;

        if (x2 < 0 || x2 > 9)
            continue;
        if (x3 < 0 || x3 > 9)
            continue;
        if (x4 < 0 || x4 > 9)
            continue;
        if (x5 < 0 || x5 > 9)
            continue;

        if (x4 !== x5)
            continue;

        total++;
    }

    return total;
}

function combinaison(possibilities)
{
    let total = 0;

    for(let d1 of possibilities)
    {
        let sum = d1.sum;

        for (let d2 of possibilities)
        {
            if (sum !== d2.sum)
                continue;

            // Rows

            if (d1[0] + d2[0] > sum)
                continue;
            if (d1[1] + d2[1] > sum)
                continue;
            if (d1[2] + d2[2] > sum)
                continue;
            if (d1[3] + d2[3] > sum)
                continue;

            // Columns
            if (d1[0] + d2[3] > sum)
                continue;
            if (d2[0] + d1[3] > sum)
                continue;
            if (d1[1] + d2[2] > sum)
                continue;
            if (d2[1] + d1[2] > sum)
                continue;

            let t1  = solveHorizontal(d1, d2, sum);

            if (t1 > 0)
            {
                let t2 = solveVertical(d1, d2, sum);
                total += t1*t2;
            }
        }
    }

    return total;
}

let possibilities = allWays();
console.log(possibilities.length);
let answer = combinaison(possibilities);
console.log("Answer is", answer);
