const assert    = require('assert');
const fs        = require('fs');
const readline  = require('readline');
const prettyHrtime = require('pretty-hrtime');

const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p424_kakuro200.txt')
});

let TOTAL = 0;
let count = 0;
let startTime = process.hrtime();

readInput
.on('line', (line) => { 

    count++;
    let kakuro = parse(line);
    let result = kakuro.solve(count);
    TOTAL += result;            
    if (count === 10)
        assert.equal(TOTAL, 64414157580);
})
.on('close', () => {
    let endTime = process.hrtime(startTime);
    console.log('Answer is', TOTAL, 'solved in', prettyHrtime(endTime, {verbose:true}));
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
                if (o === ' ')
                {
                    let cell = kakuro.createCell(col, row, "");
                    constraint.add(cell);
                }
                else if (o >= 'A' && o <= 'J')
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
                if (o === ' ')
                {
                    let cell = kakuro.createCell(col, row, "");
                    constraint.add(cell);
                }
                else if (o >= 'A' && o <= 'J')
                {
                    let cell = kakuro.createCell(col, row, o);
                    constraint.add(cell);
                }
                else
                    break;
            }
        }
    }
    kakuro.finalize();
    return kakuro;
}

class Cell
{
    constructor(kakuro, letter)
    {
        this.constraints = []; 
        this.letter      = letter;
        this.kakuro      = kakuro;

        let l = letter.charCodeAt(0) - letterA;
        this.kakuro.minLetters[l] = 1;
    }

    addConstraint(constraint)
    {
        if (! this.constraints.includes(constraint))
            this.constraints.push(constraint);
    }
}

class Constraint
{
    constructor(kakuro, sum)
    {
        this.kakuro = kakuro;
        this.sum    = sum;
        this.cells  = [];

        let l = sum.charCodeAt(0) - letterA;
        this.kakuro.minLetters[l] = 1;
    }

    getEmptyCells()
    {
        let cells = [];

        for (let cell of this.cells)
            if (cell.letter == "")
                cells.push(cell);

        return cells;
    }

    add(cell)
    {
        this.cells.push(cell);
        cell.addConstraint(this);
    }

    // check if current state is possible and configure some internal variables
    validate()
    {
        let v = 0;

        this.usedNumbers = [];
        this.emptyCells  = [];

        for (let cell of this.cells)
        {
            v += cell.value;
            if (v > this.value)
                return false;

            if (cell.value === 0)
            {
                this.emptyCells.push(cell);
            }
            else if (this.usedNumbers[cell.value] === 1) // Already used!!!!
                return false;
            else
                this.usedNumbers[cell.value] = 1;
        }

        this.remaining = this.value - v;

        if (this.emptyCells.length > 0)
        {
            let e = this.emptyCells.length;
            let m = v;
            for (let i = 1; i < 10; i++)
            {
                if (this.usedNumbers[i] !== 1)
                {
                    m += i;
                    if (--e === 0)
                        break;
                }
            }
            if (e !== 0 || m > this.value)
                return false;

            e = this.emptyCells.length;
            m = v;
            for (let i = 9; i > 0; i--)
            {
                if (this.usedNumbers[i] !== 1)
                {
                    m += i;
                    if (--e === 0)
                        break;
                }
            }
            if (e !== 0 || m < this.value)
                return false;

            return true;
        }
        else
            return v === this.value;
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

        let l1 = this.sum.charCodeAt(0) - letterA;

        if (this.sum.length === 2)
        {
            if (max < 10)
                throw "Max is too small since sum has 2 digits";

            if (min < 10)
                min = this.min = 10; // 2 digits

            let m  = (max - (max % 10)) / 10;
            let l2 = this.sum.charCodeAt(1) - letterA; 

            if (l1 === l2)
            {
                let mm = m*10 + m;
                if (mm > max)
                    m--;
            }

            this.kakuro.maxLetters[l1] = Math.min(this.kakuro.maxLetters[l1], m);

            m = (min - (min % 10)) / 10;
            this.kakuro.minLetters[l1] = Math.max(this.kakuro.minLetters[l1], m);
        }
        else
        {
            if (min >= 10)
                throw "Min is too small since sum has 2 digits";

            if (max >= 10)
                max = this.max = 9; // 2 digits

            this.kakuro.maxLetters[l1] = Math.min(this.kakuro.maxLetters[l1], max);
            this.kakuro.minLetters[l1] = Math.max(this.kakuro.minLetters[l1], min);
        }
    }

    *possibilities(count, value, values)
    {
        if (count === 0)
            yield values;
        else if (count === 1)
        {
            if (value > 0 && value < 10)
            {
                if (this.usedNumbers[value] !== 1 && ! values.includes(value))
                {
                    values.push(value);
                    yield values;
                    values.pop();
                }
            }
        }
        else
        {
            for (let i = 1; i < 10; i++)
            {
                if (i > value)
                    break;
                if (this.usedNumbers[i] !== 1 && ! values.includes(i))
                {
                    values.push(i);
                    yield *this.possibilities(count-1, value-i, values);
                    values.pop();
                }
            }
        }
    }

    solve()
    {
        if (! this.validate())
            return false;

        if (this.emptyCells.length === 0)
        {
            if (this.remaining !== 0)
                return false;
            else
                return this.next.solve();
        }

        let emptyCells = this.emptyCells;
        let remaining  = this.remaining;

        for (let values of this.possibilities(emptyCells.length, remaining, []))
        {            
            for (let i = 0; i < emptyCells.length; i++)
                emptyCells[i].value = values[i];                

            if (this.next.solve())
                return true;
        }

        // Rollback - only once all possiblity tried
        for (let i = 0; i < emptyCells.length; i++)
            emptyCells[i].value = 0;   

        return false;
    }
}

class Kakuro
{
    constructor()
    {
        this.maxLetters = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
        this.minLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.cells      = new Map();
        this.constraints= [];
        this.letters    = [];
        this.usedNumbers= [];
    }

    sort()
    {
        this.constraints.sort((c1, c2) => {
            let count1 = 0;
            for (let cell of c1.cells)
            {
                if (cell.letter === '')
                {
                    count1++;
                    if (c2.cells.includes(cell))
                        return 0;
                }
            }
            let count2 = c2.cells.reduce((a, cell) => 
            {
                return a + (cell.letter === "" ? 1 : 0);
            }, 0);

            if (count1 === count2)
                return 1;
            else
                return count1-count2;
        });

        this.constraints.push({
            solve: () => { 
                return true; 
            }
        });

        for (let i = 0; i < this.constraints.length; i++)
            this.constraints[i].next = this.constraints[i+1];

        this.constraints.pop();
    }

    // Use this to prevent creating multiple cells for the same location
    createCell(col, row, letter)
    {
        let k = col + "-" + row;
        let c = this.cells.get(k);
        if (c === undefined)
        {
            c = new Cell(this, letter);            
            this.cells.set(k, c);
        }
        else
            assert.equal(letter, c.letter);

        return c;
    }

    createConstraint(sum)
    {
        let c = new Constraint(this, sum);
        this.constraints.push(c);
        return c;
    }

    finalize()
    {
        for (let c of this.constraints)
            c.finalize();

        for (let i = 0; i < 10; i++)
            if (this.maxLetters[i] < this.minLetters[i])
                throw "Impossible to solve";

        this.sort();
    }

    evaluate(str)
    {        
        let value = 0;
        for (let i = 0; i < str.length; i++)
        {
            value = (value * 10) + this.letters[str.charCodeAt(i) - letterA];
        }
        return value;
    }

    apply()
    {
        for (let cell of this.cells.values())
            cell.value = this.evaluate(cell.letter);

        for (let constraint of this.constraints)
        {
            constraint.value = this.evaluate(constraint.sum);
            if (! constraint.validate())
                return false;
        }

        return true;
    }

    $solve(index)
    {
        if (index === 10)
        {
            // this.letters = [8, 4, 2, 6, 0, 3, 9, 5, 7, 1];

            if (! this.apply())
                return false;

            return this.constraints[0].solve();
        }

        for (let i = this.minLetters[index]; i <= this.maxLetters[index]; i++)
        {
            if (this.usedNumbers[i] !== 1)
            {
                this.usedNumbers[i] = 1;
                this.letters[index] = i;
                if (this.$solve(index+1))
                    return true;
                this.usedNumbers[i] = 0;
            }
        }

        return false;
    }

    solve(id)
    {
        if (! this.$solve(0))
            throw "Cannot solve, Really?";

        let v = 0;
        for (let c of this.letters)
            v = v*10 + c;

        // console.log(id, '->', v);
        return v;
    }
}
