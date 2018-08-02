const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');

const readInput = readline.createInterface({
    input: fs.createReadStream('data/p424_kakuro200.txt')
});

readInput
.on('line', (line) => { 
    let kakuro = parse(line);
//    buildConstraints(kakuro);
//    let result = solve(kakuro);
//    console.log(result);
})
.on('close', () => {
    console.log('Done');
    process.exit(0);
});

const letterA = "A".charCodeAt(0);

function parse(line)
{
    function parseSum(i)
    {
        let sum = '';
        while (line[i] >= 'A' && line[i] <= 'J')
        {
            sum += line[i];
            i++;
        }
        return {index: i, sum: sum};
    }

    let size = +(line[0]);

    assert.ok(size === 6 || size === 7);
    assert.equal(line[1], ',');
    
    let board = [];
    let constraints = [];

    for (let i = 0; i < size; i++)
        board.push([]);

    let col = 0, row = 0;
    for (let i = 2; i < line.length; i += 2)
    {
        let c = line[i];
        switch (c)
        {
            case 'X': 
                board[row][col] = 'X'; 
                break;
            case 'O':
                board[row][col] = ' '; 
                break;
            case '(':
                i++;
                if (line[i] === 'h')
                {
                    i++;
                    let s = parseSum(i);
                    i = s.index;

                    constraints.push({
                        type: 'h',
                        col: col,
                        row: row,
                        value: s.sum
                    });
                    if (line[i] === ',')
                    {
                        i++;
                        assert.equal(line[i], 'v');
                        i++;                        
                        s = parseSum(i);
                        i = s.index;
                        constraints.push({
                            type: 'v',
                            col: col,
                            row: row,
                            value: s.sum
                        });
                    }
                    board[row][col] = 'X';
                }
                else if (line[i] === 'v')
                {
                    i++;
                    let s = parseSum(i);
                    i = s.index;
                    constraints.push({
                        type: 'v',
                        col: col,
                        row: row,
                        value: s.sum
                    })
                    board[row][col] = 'X';                    
                }
                else
                    throw "Syntax error";
                
                assert.equal(line[i], ')');
                break;

            default:
                if (c >= 'A' && c <= 'J')
                    board[row][col] = c; 
                else
                    throw "Syntax error";
                break;
        }

        if (i+1 < line.length)
        {
            assert.equal(line[i+1], ',');

            col = (col + 1) % size;
            if (col === 0)
                row++;
        }
    }

    let kakuro = new Kakuro();
    for (let c of constraints)
    {
        let constraint = kakuro.createConstraint(c.value);

        if (c.type === 'h')
        {
            let row = c.row;
            for (let col = c.col+1 ; col < size; col++)
            {
                let o = board[row][col];
                if (o === ' ' || (o >= 'A' && o <= 'J'))
                {
                    let cell = kakuro.createCell(col, row, o);
                    constraint.add(cell);
                }
                else
                    break;
            }
        }
        else
        {
            let col = c.col;
            for (let row = c.row+1 ; row < size; row++)
            {
                let o = board[row][col];
                if (o === ' ' || (o >= 'A' && o <= 'J'))
                {
                    let cell = kakuro.createCell(col, row, o);
                    constraint.add(cell);
                }
                else
                    break;
            }
        }
    }
    return board;
}

class Cell
{
    constructor(value, owner)
    {
        this.value = value;
        this.kakuro = owner;

        let l = value.charCodeAt(0) - letterA;
        this.kakuro.minLetters[l] = 1;
    }
}

class Constraint
{
    constructor(value, owner)
    {
        this.kakuro = owner;
        this.value  = value;
        this.cells  = [];
    }

    add(cell)
    {
        this.cells.push(cell);
    }

    finalize()
    {
        let min = 1;
        let max = 0;
        let m   = 0;

        for (let c of this.cells)
        {
            min += m;
            max += (9-m);
            m++;
        }

        this.min = min;
        this.max = max;

        let l1 = this.value.charCodeAt(0) - letterA;

        if (this.value.length === 2)
        {
            let l2 = this.value.charCodeAt(1) - letterA;
            
        }
        else
        {

        }
    }
}

class Kakuro
{
    constructor()
    {
        this.maxLetters = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
        this.minLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.cells      = [];
        this.constraints= [];
    }

    // Use this to prevent creating multiple cells for the same location
    createCell(col, row, value)
    {
        let r = this.cell[row];
        if (r === undefined)
        {
            r = [];
            this.cell[row] = r;
        }
        let c = r[col];
        if (c === undefined)
            c = new Cell(value);
        else
            assert.equal(value, c.value);

        return c;
    }

    createConstraint(value)
    {
        let c = new Constraint(value);
        this.constraints.push(c);
        return c;
    }

    finalize()
    {
        for (let c of this.constraints)
            c.finalize();
    }
}
