// #region SUDOKU Grids

const sudoku_01 = [
    '003020600',
    '900305001',
    '001806400',
    '008102900',
    '700000008',
    '006708200',
    '002609500',
    '800203009',
    '005010300'
    ];
    
const sudoku_02 = [
    '200080300',
    '060070084',
    '030500209',
    '000105408',
    '000000000',
    '402706000',
    '301007040',
    '720040060',
    '004010003'
    ];
    
const sudoku_03 = [
    '000000907',
    '000420180',
    '000705026',
    '100904000',
    '050000040',
    '000507009',
    '920108000',
    '034059000',
    '507000000'
    ];
    
const sudoku_04 = [
    '030050040',
    '008010500',
    '460000012',
    '070502080',
    '000603000',
    '040109030',
    '250000098',
    '001020600',
    '080060020'
    ];
    
const sudoku_05 = [
    '020810740',
    '700003100',
    '090002805',
    '009040087',
    '400208003',
    '160030200',
    '302700060',
    '005600008',
    '076051090'
    ];
    
const sudoku_06 = [
    '100920000',
    '524010000',
    '000000070',
    '050008102',
    '000000000',
    '402700090',
    '060000000',
    '000030945',
    '000071006'
    ];
    
const sudoku_07 = [
    '043080250',
    '600000000',
    '000001094',
    '900004070',
    '000608000',
    '010200003',
    '820500000',
    '000000005',
    '034090710'
    ];
    
const sudoku_08 = [
    '480006902',
    '002008001',
    '900370060',
    '840010200',
    '003704100',
    '001060049',
    '020085007',
    '700900600',
    '609200018'
    ];
    
const sudoku_09 = [
    '000900002',
    '050123400',
    '030000160',
    '908000000',
    '070000090',
    '000000205',
    '091000050',
    '007439020',
    '400007000'
    ];
    
const sudoku_10 = [
    '001900003',
    '900700160',
    '030005007',
    '050000009',
    '004302600',
    '200000070',
    '600100030',
    '042007006',
    '500006800'
    ];
    
const sudoku_11 = [
    '000125400',
    '008400000',
    '420800000',
    '030000095',
    '060902010',
    '510000060',
    '000003049',
    '000007200',
    '001298000'
    ];
    
const sudoku_12 = [
    '062340750',
    '100005600',
    '570000040',
    '000094800',
    '400000006',
    '005830000',
    '030000091',
    '006400007',
    '059083260'
    ];
    
const sudoku_13 = [
    '300000000',
    '005009000',
    '200504000',
    '020000700',
    '160000058',
    '704310600',
    '000890100',
    '000067080',
    '000005437'
    ];
    
const sudoku_14 = [
    '630000000',
    '000500008',
    '005674000',
    '000020000',
    '003401020',
    '000000345',
    '000007004',
    '080300902',
    '947100080'
    ];
    
const sudoku_15 = [
    '000020040',
    '008035000',
    '000070602',
    '031046970',
    '200000000',
    '000501203',
    '049000730',
    '000000010',
    '800004000'
    ];
    
const sudoku_16 = [
    '361025900',
    '080960010',
    '400000057',
    '008000471',
    '000603000',
    '259000800',
    '740000005',
    '020018060',
    '005470329'
    ];
    
const sudoku_17 = [
    '050807020',
    '600010090',
    '702540006',
    '070020301',
    '504000908',
    '103080070',
    '900076205',
    '060090003',
    '080103040'
    ];
    
const sudoku_18 = [
    '080005000',
    '000003457',
    '000070809',
    '060400903',
    '007010500',
    '408007020',
    '901020000',
    '842300000',
    '000100080'
    ];
    
const sudoku_19 = [
    '003502900',
    '000040000',
    '106000305',
    '900251008',
    '070408030',
    '800763001',
    '308000104',
    '000020000',
    '005104800'
    ];
    
const sudoku_20 = [
    '000000000',
    '009805100',
    '051907420',
    '290401065',
    '000000000',
    '140508093',
    '026709580',
    '005103600',
    '000000000'
    ];
    
const sudoku_21 = [
    '020030090',
    '000907000',
    '900208005',
    '004806500',
    '607000208',
    '003102900',
    '800605007',
    '000309000',
    '030020050'
    ];
    
const sudoku_22 = [
    '005000006',
    '070009020',
    '000500107',
    '804150000',
    '000803000',
    '000092805',
    '907006000',
    '030400010',
    '200000600'
    ];
    
const sudoku_23 = [
    '040000050',
    '001943600',
    '009000300',
    '600050002',
    '103000506',
    '800020007',
    '005000200',
    '002436700',
    '030000040'
    ];
    
const sudoku_24 = [
    '004000000',
    '000030002',
    '390700080',
    '400009001',
    '209801307',
    '600200008',
    '010008053',
    '900040000',
    '000000800'
    ];
    
const sudoku_25 = [
    '360020089',
    '000361000',
    '000000000',
    '803000602',
    '400603007',
    '607000108',
    '000000000',
    '000418000',
    '970030014'
    ];
    
const sudoku_26 = [
    '500400060',
    '009000800',
    '640020000',
    '000001008',
    '208000501',
    '700500000',
    '000090084',
    '003000600',
    '060003002'
    ];
    
const sudoku_27 = [
    '007256400',
    '400000005',
    '010030060',
    '000508000',
    '008060200',
    '000107000',
    '030070090',
    '200000004',
    '006312700'
    ];
    
const sudoku_28 = [
    '000000000',
    '079050180',
    '800000007',
    '007306800',
    '450708096',
    '003502700',
    '700000005',
    '016030420',
    '000000000'
    ];
    
const sudoku_29 = [
    '030000080',
    '009000500',
    '007509200',
    '700105008',
    '020090030',
    '900402001',
    '004207100',
    '002000800',
    '070000090'
    ];
    
const sudoku_30 = [
    '200170603',
    '050000100',
    '000006079',
    '000040700',
    '000801000',
    '009050000',
    '310400000',
    '005000060',
    '906037002'
    ];
    
const sudoku_31 = [
    '000000080',
    '800701040',
    '040020030',
    '374000900',
    '000030000',
    '005000321',
    '010060050',
    '050802006',
    '080000000'
    ];
    
const sudoku_32 = [
    '000000085',
    '000210009',
    '960080100',
    '500800016',
    '000000000',
    '890006007',
    '009070052',
    '300054000',
    '480000000'
    ];
    
const sudoku_33 = [
    '608070502',
    '050608070',
    '002000300',
    '500090006',
    '040302050',
    '800050003',
    '005000200',
    '010704090',
    '409060701'
    ];
    
const sudoku_34 = [
    '050010040',
    '107000602',
    '000905000',
    '208030501',
    '040070020',
    '901080406',
    '000401000',
    '304000709',
    '020060010'
    ];
    
const sudoku_35 = [
    '053000790',
    '009753400',
    '100000002',
    '090080010',
    '000907000',
    '080030070',
    '500000003',
    '007641200',
    '061000940'
    ];
    
const sudoku_36 = [
    '006080300',
    '049070250',
    '000405000',
    '600317004',
    '007000800',
    '100826009',
    '000702000',
    '075040190',
    '003090600'
    ];
    
const sudoku_37 = [
    '005080700',
    '700204005',
    '320000084',
    '060105040',
    '008000500',
    '070803010',
    '450000091',
    '600508007',
    '003010600'
    ];
    
const sudoku_38 = [
    '000900800',
    '128006400',
    '070800060',
    '800430007',
    '500000009',
    '600079008',
    '090004010',
    '003600284',
    '001007000'
    ];
    
const sudoku_39 = [
    '000080000',
    '270000054',
    '095000810',
    '009806400',
    '020403060',
    '006905100',
    '017000620',
    '460000038',
    '000090000'
    ];
    
const sudoku_40 = [
    '000602000',
    '400050001',
    '085010620',
    '038206710',
    '000000000',
    '019407350',
    '026040530',
    '900020007',
    '000809000'
    ];
    
const sudoku_41 = [
    '000900002',
    '050123400',
    '030000160',
    '908000000',
    '070000090',
    '000000205',
    '091000050',
    '007439020',
    '400007000'
    ];
    
const sudoku_42 = [
    '380000000',
    '000400785',
    '009020300',
    '060090000',
    '800302009',
    '000040070',
    '001070500',
    '495006000',
    '000000092'
    ];
    
const sudoku_43 = [
    '000158000',
    '002060800',
    '030000040',
    '027030510',
    '000000000',
    '046080790',
    '050000080',
    '004070100',
    '000325000'
    ];
    
const sudoku_44 = [
    '010500200',
    '900001000',
    '002008030',
    '500030007',
    '008000500',
    '600080004',
    '040100700',
    '000700006',
    '003004050'
    ];
    
const sudoku_45 = [
    '080000040',
    '000469000',
    '400000007',
    '005904600',
    '070608030',
    '008502100',
    '900000005',
    '000781000',
    '060000010'
    ];
    
const sudoku_46 = [
    '904200007',
    '010000000',
    '000706500',
    '000800090',
    '020904060',
    '040002000',
    '001607000',
    '000000030',
    '300005702'
    ];
    
const sudoku_47 = [
    '000700800',
    '006000031',
    '040002000',
    '024070000',
    '010030080',
    '000060290',
    '000800070',
    '860000500',
    '002006000'
    ];
    
const sudoku_48 = [
    '001007090',
    '590080001',
    '030000080',
    '000005800',
    '050060020',
    '004100000',
    '080000030',
    '100020079',
    '020700400'
    ];
    
const sudoku_49 = [
    '000003017',
    '015009008',
    '060000000',
    '100007000',
    '009000200',
    '000500004',
    '000000020',
    '500600340',
    '340200000'
    ];
    
const sudoku_50 = [
    '300200000',
    '000107000',
    '706030500',
    '070009080',
    '900020004',
    '010800050',
    '009040301',
    '000702000',
    '000008006'
    ];

const sudokus = [
    sudoku_01, sudoku_02, sudoku_03, sudoku_04, sudoku_05, sudoku_06, sudoku_07, sudoku_08, sudoku_09, 
    sudoku_10, sudoku_11, sudoku_12, sudoku_13, sudoku_14, sudoku_15, sudoku_16, sudoku_17, sudoku_18, sudoku_19,
    sudoku_20, sudoku_21, sudoku_22, sudoku_23, sudoku_24, sudoku_25, sudoku_26, sudoku_27, sudoku_28, sudoku_29,
    sudoku_30, sudoku_31, sudoku_32, sudoku_33, sudoku_34, sudoku_35, sudoku_36, sudoku_37, sudoku_38, sudoku_39,
    sudoku_40, sudoku_41, sudoku_42, sudoku_43, sudoku_44, sudoku_45, sudoku_46, sudoku_47, sudoku_48, sudoku_49, 
    sudoku_50 
];
// #endregion

function buildGrid(grid)
{
    let g = [];

    for (let y = 0; y < 9; y++)
    {
        let yy = grid[y];
        let xx = [];
        g[y] = xx;
        for (let x = 0; x < 9; x++)
        {
            xx[x] = {
                value: +(yy[x]),
                x:x,
                y:y,
                possibilities: []
            }
        }
    }

    g.isValid = true;
    return g;
}

function SolveSudoku(grid, bruteForce)
{    
    function getCell(x, y)
    {
        return grid[y][x];
    }

    function forEach(fn)
    {
        for(let y = 0; y < 9; y++)
        for(let x = 0; x < 9; x++)
        {
            let cell = getCell(x, y);
            if (fn(cell, x, y) === false)
                return; 
        }
    }

    function forRow(y, fn)
    {
        for(let x = 0; x < 9; x++)
        {
            let cell = getCell(x, y);
            if (fn(cell, x, y) === false)
                return;
        }
    }

    function forColumn(x, fn)
    {
        for(let y = 0; y < 9; y++)
        {
            let cell = getCell(x, y);
            if (fn(cell, x, y) === false)
                return;
        }
    }

    function forSquare(x, y, fn)
    {
        let xx = (x - (x % 3));
        let yy = (y - (y % 3));

        // Find n cells with a same set of possible values

        for(let y2 = yy; y2 < yy+3; y2++)
        for(let x2 = xx; x2 < xx+3; x2++)
        {
            let cell = getCell(x2, y2);
            if (fn(cell, x2, y2) === false)
                return;
        }
    }

    function saveState()
    {
        let state = [];
        
        forEach((cell, x, y) => {
            if (cell.value === 0)
                state.push(cell);
        });

        return state;
    }

    function restoreState(state)
    {
        for(let i = 0; i < state.length ; i++)
            state[i].value = 0;

        generatePossibilites();
    }

    function removePossibility(cell, value) 
    {
        let i = cell.possibilities.indexOf(value);
        if (i >= 0)
        {
            cell.possibilities.splice(i, 1);

            if (cell.possibilities.length === 0)
                grid.isValid = false;

            return true;
        }
    }

    function generatePossibilites()
    {
        grid.isValid = true;

        forEach((main, x, y) => 
        {
            if (main.value > 0)
            {
                main.possibilities = [];
                return;
            }

            main.possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            
            forRow(y, (cell) => {
                if (cell.value > 0)
                    removePossibility(main, cell.value);
            });
            forColumn(x, (cell) => {
                if (cell.value > 0)
                    removePossibility(main, cell.value);
            });
            forSquare(x, y, (cell) => {
                if (cell.value > 0)
                    removePossibility(main, cell.value);
            });

            if (main.possibilities.length === 0)
                grid.isValid = false;
        });
    }

    function setValue(x, y, value)
    {
        let main = getCell(x, y);
        main.value = value;
        main.possibilities = [];

        forColumn(x, (cell) => {
            if (cell.value === 0)
                removePossibility(cell, value);            
        });

        forRow(y, (cell) => {
            if (cell.value === 0)
                removePossibility(cell, value);            
        });

        forSquare(x, y, (cell) => {
            if (cell.value === 0)
                removePossibility(cell, value);
        });
    }

    function solveSoleCandidate()
    {
        let result = 1;
        
        forEach((cell, x, y) => 
        {
            if (cell.value > 0) 
                return; // Known

            if (cell.possibilities.length == 1)
            {
                setValue(x, y, cell.possibilities[0]);
                result = 0;
            }
            else if (result !== 0)
                result = -1;
        });

        return result;
    }

    function solveUniqueCandidate()
    {
        let foundSome = false;

        forEach((cell, x1, y1) => {
            if (cell.value !== 0)
                return;

            let foundValue = 0;

            cell.possibilities.forEach(value => {
                if (foundValue != 0)
                    return;

                let unique = true;
                forSquare(x1, y1, (cell2, x2, y2) => {
                    if (x1 === x2 && y1 === y2)
                        return;
                    if (cell2.value === value)
                    {
                        unique = false;
                        return false;
                    }
                    if (cell2.possibilities.includes(value))
                    {
                        unique = false;
                        return false;
                    }
                });
                if (unique) // no other cells of the square can have that value ... must be it
                    foundValue = value;
            });

            if (foundValue !== 0)
            {
                setValue(x1, y1, foundValue);
                foundSome = true;
            }
        });

        return foundSome;
    }

    function solveNakedSubset(length)
    {
        function isOneOf(cells, x, y)
        {
            for(let i = 0; i < cells.length; i++)
            {
                if (cells[i].x === x && cells[i].y === y)
                    return true;
            }
            return false;
        }

        function sameArray(master, other)
        {
            if (other.length > length)
                return false;
            let big   = master;
            let small = other;
            if (master.length < other.length)
            {
                big   = other;
                small = master;
            }
            for(let i = 0; i < small.length; i++)
            {                
                if (! big.includes(small[i]))
                    return false;
            }
            if (big !== master)
            {
                for(let i = 0; i < big.length; i++)
                    if (! master.includes(big[i]))
                        master.push(big[i]);
            }
            return true;
        }

        function findMatchingHorizontal(main, x, y)
        {
            let master = Array.from(main.possibilities);
            let found = [ { x:x, y:y } ];
            
            forRow(y, (cell, x2, y2) => 
            {
                if (isOneOf(found, x2, y2))
                    return;

                if (cell.value === 0 && sameArray(master, cell.possibilities))
                {
                    found.push({x:x2, y:y2});
                    if (found.length === length)
                        return false; // break forColumn
                }
            });

            if (found.length !== length)
                return false;
                
            let done = false;
            forRow(y, (cell, x2, y2) => 
            {
                if (isOneOf(found, x2, y2))
                    return;
                if (cell.value === 0)
                {
                    for (let i = 0; i < master.length; i++)
                    {
                        done |= removePossibility(cell, master[i]);
                    }
                }
            });
            return done;
        }

        function findMatchingVertical(main, x, y)
        {
            let master = Array.from(main.possibilities);
            let found = [ { x:x, y:y } ];
            
            forColumn(x, (cell, x2, y2) =>
            {
                if (isOneOf(found, x2, y2))
                    return;

                if (cell.value === 0 && sameArray(master, cell.possibilities))
                {
                    found.push({x:x2, y:y2});
                    if (found.length === length)
                        return false; // break forColumn
                }
            });

            if (found.length !== length)
                return false;

            let done = false;
            forColumn(x, (cell, x2, y2) =>
            {
                if (isOneOf(found, x2, y2))
                    return;
                if (cell.value === 0)
                {
                    for (let i = 0; i < master.length; i++)
                    {
                        done |= removePossibility(cell, master[i]);
                    }
                }
            });

            return done;
        }

        function findMatchingSquare(main, x, y)
        {
            let master = Array.from(main.possibilities);
            let found = [ { x:x, y:y } ];

            forSquare(x, y, (cell, x2, y2) => 
            {
                if (isOneOf(found, x2, y2))
                    return;

                if (cell.value === 0 && sameArray(master, cell.possibilities))
                {
                    found.push({x:x2, y:y2});
                    if (found.length === length)
                        return false;
                }
            });

            if (found.length !== length)
                return false;
                    
            // any other cells cannot use a value from that set

            let done = false;

            forSquare(x, y, (cell, x3, y3) =>
            {
                if (isOneOf(found, x3, y3))
                    return;

                if (cell.value === 0)
                {
                    for (let i = 0; i < master.length; i++)
                    {
                        done |= removePossibility(cell, master[i]);
                    }
                }
            });

            return done;
        }

        let done = false;

        forEach((cell, x, y) => 
        {
            if (cell.value > 0 || cell.possibilities.length > length)
                return;

            if (findMatchingHorizontal(cell, x, y) || 
                findMatchingVertical(cell, x, y) ||
                findMatchingSquare(cell, x, y))
            {
                done |= true;
            }
        });

        return done;
    }

    function findBestCellToGuess()
    {
        let bestCell = undefined;

        forEach((cell, x, y) =>
        {
            if (cell.value === 0)
            {
                if (bestCell === undefined)
                    bestCell = cell;
                else if (bestCell.possibilities.length > cell.possibilities.length)
                    bestCell = cell;
            }
        });

        return bestCell;
    }

    if (bruteForce !== true)
        generatePossibilites();

    while (true)
    {
        // Solve 

        let solved = solveSoleCandidate();
        
        if (bruteForce !== true || solved === 1)
        {
            // Check to see if we have enough info

            let c1 = getCell(0,0).value;
            let c2 = getCell(1,0).value;
            let c3 = getCell(2,0).value;

            if (c1 !== 0 && c2 !== 0 && c3 != 0) // Good enough, we got what we need
            {
                return c1 * 100 + c2 * 10 + c3;
            }
            else if (solved === 1)
            {
                throw "Should never get here!!!";
            }
        }
        
        if (! grid.isValid)
            return 0;

        if (solved === -1)
        {
            if (solveUniqueCandidate())
                continue;
            if (solveNakedSubset(2))
                continue;
            if (solveNakedSubset(3))
                continue;
            if (solveNakedSubset(4))
                continue;
        }

        if (solved === -1) // Stuck ... maybe something went wrong. Start again
        {
            let best   = findBestCellToGuess();
            let values = Array.from(best.possibilities);
            let state  = saveState();

            for (let i = 0; i < values.length; i++)
            {
                setValue(best.x, best.y, values[i]);
                if (grid.isValid)
                {
                    let result = SolveSudoku(grid, true);
                    if (result > 0)
                        return result;
                }

                restoreState(state);
            }
            return 0;
        }
    }
}

let sum = 0;
let failed = 0;
for (let i = 0; i < sudokus.length; i++)
{
    let sudoku = sudokus[i];
    sudoku = buildGrid(sudoku);
    let v = SolveSudoku(sudoku);
    if (v <= 0)
    {
        failed++;
        console.log("Stuck for #" + (i+1));
    }
    else
        console.log("Success for #" + (i+1));
    sum += v;
}

if (failed > 0)
    console.log(failed + " grid couldn't be solved");
else
    console.log("Solved all ... Sum is " + sum);