// Cube digit pairs
// Problem 90 
// Each of the six faces on a cube has a different digit (0 to 9) written on it; the same is done to a second cube. 
// By placing the two cubes side-by-side in different positions we can form a variety of 2-digit numbers.

// For example, the square number 64 could be formed: ( see image on website)

// In fact, by carefully choosing the digits on both cubes it is possible to display all of the square numbers 
// below one-hundred: 01, 04, 09, 16, 25, 36, 49, 64, and 81.

// For example, one way this can be achieved is by placing {0, 5, 6, 7, 8, 9} on one cube and {1, 2, 3, 4, 8, 9} on the other cube.

// However, for this problem we shall allow the 6 or 9 to be turned upside-down so that an arrangement like {0, 5, 6, 7, 8, 9} 
// and {1, 2, 3, 4, 6, 7} allows for all nine square numbers to be displayed; otherwise it would be impossible to obtain 09.

// In determining a distinct arrangement we are interested in the digits on each cube, not the order.

// {1, 2, 3, 4, 5, 6} is equivalent to {3, 6, 4, 1, 2, 5}
// {1, 2, 3, 4, 5, 6} is distinct from {1, 2, 3, 4, 5, 9}

// But because we are allowing 6 and 9 to be reversed, the two distinct sets in the last example both represent the 
// extended set {1, 2, 3, 4, 5, 6, 9} for the purpose of forming 2-digit numbers.

// How many distinct arrangements of the two cubes allow for all of the square numbers to be displayed?

let squares = [
    [0,1],
    [0,4],
    [0,9],
    [1,6],
    [2,5],
    [3,6],
    [4,9],
    [6,4],
    [8,1]
];

let cubes = {}

function hasNumber(cube, value)
{
    if (cube.includes(value))
        return true;
    else if (value === 6)
        return cube.includes(9);
    else if (value === 9)
        return cube.includes(6);
    else
        return false;
}

function canMakeSquare(square, cube1, cube2)
{
    if (hasNumber(cube1, square[0]) && hasNumber(cube2, square[1]))
        return true;
    else if (hasNumber(cube1, square[1]) && hasNumber(cube2, square[0]))
        return true;
    else
        return false;
}

function makeCubes(cube, faces)
{
    if (faces === 6)
    {
        let newCube = Array.from(cube);
        newCube.sort();
        let key = newCube.toString();
        if (cubes[key] === undefined)
            cubes[key] = newCube; 
        return;
    }

    for(let c = 0; c < 10; c++)
    {
        if (! cube.includes(c))
        {
            cube.push(c);
            makeCubes(cube, faces+1);
            cube.pop();
        }
    }
}

makeCubes([], 0);

let keys = Object.keys(cubes);
let solutions = 0;

for(let key1 of keys)
{
    for (key2 of keys)
    {
        if (key1 === key2)
            continue;

        let good = true;
        for(let square of squares)
        {
            if (! canMakeSquare(square, cubes[key1], cubes[key2]))
            {
                good = false;
                break;
            }
        }
        if (good)
            solutions++;
    }
}

// Need to divide by 2 because order of cube doesn't matter.

console.log("There are " + (solutions/2) + " distinct arrangements of the two cubes that allow for all of the square numbers to be displayed");
