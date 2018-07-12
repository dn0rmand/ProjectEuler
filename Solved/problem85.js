// Counting rectangles
// Problem 85 
// By counting carefully it can be seen that a rectangular grid measuring 3 by 2 contains eighteen rectangles
// Although there exists no rectangular grid that contains exactly two million rectangles, 
// find the area of the grid with the nearest solution.

const MAX_SIZE = 2000;

function countRectangles(width, height)
{
    let rectangles = 0;
    for(let x = 0; x < width; x++)
    {
        for (let L = 1; L <= width-x; L++)
        {
            for(let y = 0; y < height; y++)
            {
                for (let H = 1; H <= height-y; H++)
                {
                    rectangles++;
                }
            }
        }
    }    
    return rectangles;
}

const TWO_MILLION = 2000000;
let max  = 0;
let area = 0;

for (let x = 1; x < MAX_SIZE; x++)
{
    for (let y = 1; y <= x; y++)
    {
        let total = countRectangles(x, y);
        if (total > max && total <= TWO_MILLION)
        {
            max = total;
            area = x*y;
        }
        else if (total > TWO_MILLION)
        {
            break;
        }
    }
}

console.log('Area is ' + area + " for a total of " + max + " rectangles");
