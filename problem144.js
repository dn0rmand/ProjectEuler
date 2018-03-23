const assert = require('assert');
const precision = 10000;

let line = 
{
    x0: 0,
    y0: 10.1,
    x1: 1.4,
    y1: -9.6
};

function makeLine(line)
{
    let m = (line.y1-line.y0)/(line.x1-line.x0);
    let c = line.y1 - m * line.x1;

    line.m = m;
    line.c = c;
    return line;
}

function getIntersection(line)
{
    let c = line.m;
    let c2 = line.m * line.m;

    let x = (line.x0 * (c2 - 4) - 2 * c * line.y0) / (c2 + 4);
    let y = (x * c) + line.c;

    return {x: x, y: y};
}

function getNewLine(line)
{
    let m0 = line.m;
    let m1 = -(4*line.x1)/line.y1;

    let tanA = (m0-m1)/(1+m0*m1);

    let m2 = (m1-tanA) / (1+tanA*m1);
    let c2 = line.y1 - m2 * line.x1; 

    return {
        m: m2,
        c: c2,
        x0: line.x1,
        y0: line.y1
    }
}

function solve()
{
    let count = 1;

    while (true)
    {
        line = makeLine(line);
        line = getNewLine(line);

        let point = getIntersection(line);
        if (point.y > 0 && (point.x >= -0.01 && point.x <= 0.01))
        {
            console.log("Found the exit after " + count + " rebounds");
            break;
        }

        line.x1 = point.x;
        line.y1 = point.y;

        if (line.x1 === line.x0 && line.y0 === line.y1)
            console.log('what');
        count++;
    }
}

solve();