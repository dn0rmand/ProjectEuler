function solve(GRID_SIZE)
{
    let visited = [];

    function move(x, y)
    {
        if (x === GRID_SIZE && y === GRID_SIZE)
            return 1;

        if (x > GRID_SIZE || y > GRID_SIZE)
            return 0;

        let k = y * 100 + x;
        let possibilities = visited[k];

        if (possibilities === undefined)
        {
            possibilities = move(x+1, y) + move(x, y+1);    
            visited[k] = possibilities;
            return possibilities;
        }
        else
            return possibilities;
    }

    let total = move(0, 0);
    console.log(total + ' paths for a grid of ' + GRID_SIZE + 'x' + GRID_SIZE);
}

solve(2);
solve(20);
