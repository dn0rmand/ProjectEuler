function IsGoodTriangle(a, b, c)
{
    if (a == 0 || b == 0 || c == 0)
        return false;

    if (a+b !== c && a+c !== b && b+c !== a)
        return false;

    a = Math.sqrt(a);
    b = Math.sqrt(b);
    c = Math.sqrt(c);
    if (a+b < c && a+c < b && c+b < a)
        return false;

    return true;
}

function distance(x, y)
{
    return x*x + y*y;
}

let size = 50;
let count= 0;

for (let x1 = 0; x1 <= size; x1++)
for (let y1 = 0; y1 <= size; y1++)
for (let x2 = 0; x2 <= size; x2++)
for (let y2 = 0; y2 <= size; y2++)
{
    var a = distance(x1, y1);
    var c = distance(x2, y2);
    var b = distance(x2-x1, y2-y1);
    if (IsGoodTriangle(a, b, c))
    {
        count++;
    }
}

console.log(count + " right triangles can be formed when 0 ≤ x1, y1, x2, y2 ≤ 50");