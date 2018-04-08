// Triangle containment
// Problem 102 
// Three distinct points are plotted at random on a Cartesian plane, for which -1000 ≤ x, y ≤ 1000, 
// such that a triangle is formed.

// Consider the following two triangles:

// A(-340,495), B(-153,-910), C(835,-947)
// X(-175,41), Y(-421,-714), Z(574,-645)

// -340,495,-153,-910,835,-947
// -175,41,-421,-714,574,-645


// It can be verified that triangle ABC contains the origin, whereas triangle XYZ does not.

// Using triangles.txt (right click and 'Save Link/Target As...'), a 27K text file containing the co-ordinates 
// of one thousand "random" triangles, find the number of triangles for which the interior contains the origin.

// NOTE: The first two examples in the file represent the triangles in the example given above.

const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p102_triangles.txt')
});

let count = 0;

function sameSide(x1, x2)
{
    if (x1 >= 0 && x2 >= 0)
        return true;
    else if (x1 <= 0 && x2 <= 0)
        return true;
    else
        return false    
}

function intersect(a, b)
{
    // y = A*x + C;

    // ya = A*xa + C => C = (ya*xb - xa*yb)/(xb - xa)
    // yb = A*xb + C => A = (yb-ya)/(xb - xa)

    let D = (b.x - a.x);
    if (D === 0)
        throw "What!!!!!";

    //let A = (b.y - a.y) / D;
    let C = (a.y*b.x - a.x*b.y) / D;

    return C;
}

function containsOrigin(a, b, c)
{
    if (a.x < 0 && b.x < 0 && c.x < 0)
        return false;
    if (a.x > 0 && b.x > 0 && c.x > 0)
        return false;

    if (a.y < 0 && b.y < 0 && c.y < 0)
        return false;
    if (a.y > 0 && b.y > 0 && c.y > 0)
        return false;

    if (a.x * b.x > 0) // Same side
    {
        let x1 = intersect(a, c);
        let x2 = intersect(b, c);
        return ! sameSide(x1, x2);
    }
    else if (a.x * c.x > 0)
    {
        let x1 = intersect(a, b);
        let x2 = intersect(c, b);
        return ! sameSide(x1, x2);
    }
    else if (b.x * c.x > 0)
    {
        let x1 = intersect(b, a);
        let x2 = intersect(c, a);
        return ! sameSide(x1, x2);
    }

    return true;
}

readInput
.on('line', (input) => { 
    let v = [];
    for(let value of input.split(','))
    {
        v.push(+value);
    }
    assert.equal(v.length, 6);

    if (containsOrigin({x: v[0], y: v[1]}, {x: v[2], y: v[3]}, {x: v[4], y: v[5]}))
        count++;
})

.on('close', () => {
    console.log(count + " triangles contains the origin");
    process.exit(0);
});
