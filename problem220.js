// Heighway Dragon
// Problem 220

// Let D0 be the two-letter string "Fa". For n≥1, derive Dn from Dn-1 by the string-rewriting rules:

// "a" → "aRbFR"
// "b" → "LFaLb"

// Thus, D0 = "Fa", D1 = "FaRbFR", D2 = "FaRbFRRLFaLbFR", and so on.

// These strings can be interpreted as instructions to a computer graphics program, with:
// "F" meaning "draw forward one unit", 
// "L" meaning "turn left 90 degrees", 
// "R" meaning "turn right 90 degrees", 
// and "a" and "b" being ignored. 

// The initial position of the computer cursor is (0,0), pointing up towards (0,1).
// Then Dn is an exotic drawing known as the Heighway Dragon of order n. 
// For example, D10 is shown below; counting each "F" as one step, the highlighted spot at (18,16) is 
// the position reached after 500 steps.

// What is the position of the cursor after 10^12 steps in D50 ?
// Give your answer in the form x,y with no spaces.

function solve(deepness, maxSteps)
{
    let memoize = {

    };
    
    let X = 0;
    let Y = 0;
    let directionX = 0;
    let directionY = 1;
    let steps = maxSteps;

    function rotate(moves)
    {
        let tmp = moves.offsetY;

        moves.offsetY = -moves.offsetX;
        moves.offsetX = tmp;

        tmp = moves.directionX;

        moves.directionX = moves.directionY;
        moves.directionY = -tmp;

        tmp = moves.startDirectionX;

        moves.startDirectionX = moves.startDirectionY;
        moves.startDirectionY = -tmp;
    }

    function process(input, deep)
    {
        if (steps <= 0)
            return;

        let key = input + '_' + deep;
        let moves = memoize[key];
        if (moves !== undefined && moves.steps <= steps)
        {
            // Clone to not modify cache
            moves = {
                startDirectionX: moves.startDirectionX, 
                startDirectionY: moves.startDirectionY,
                offsetX: moves.offsetX,
                offsetY: moves.offsetY,
                directionX: moves.directionX,
                directionY: moves.directionY,
                steps: moves.steps
            }

            while (moves.startDirectionX != directionX || moves.startDirectionY != directionY)
                rotate(moves);

            X += moves.offsetX;
            Y += moves.offsetY;
            directionX = moves.directionX;
            directionY = moves.directionY;
            steps -= moves.steps;
            return;
        }
        
        if (moves !== undefined)
        {
            // Need to do it manually
            moves = undefined;
        }

        moves = {
            startDirectionX: directionX,
            startDirectionY: directionY,
            offsetX: X,
            offsetY: Y,
            steps: steps
        };

        for (let c of input)
        {
            if (steps <= 0)
                return;

            switch (c)
            {
                case 'F':
                    X += directionX;
                    Y += directionY;
                    steps--;
                    break;
                case 'R':
                {
                    let x = directionX;
                    directionX = directionY;
                    directionY = -x;
                    break;
                }
                case 'L':
                {
                    let x = directionX;
                    directionX = -directionY;
                    directionY = x;
                    break;
                }
                case 'a':
                    if (deep > 0)
                        process("aRbFR", deep-1);
                    break;
                case 'b':
                    if (deep > 0)
                        process("LFaLb", deep-1);
                    break;
            }
        }

        if (steps <= 0)
            return;


        moves.offsetX = X - moves.offsetX;
        moves.offsetY = Y - moves.offsetY;
        moves.directionX = directionX;
        moves.directionY = directionY;
        moves.steps = moves.steps-steps;

        while (moves.startDirectionX != 0 && moves.startDirectionY != 1)
            rotate(moves);

        memoize[key] = moves;
    }

    process("Fa", deepness);
    console.log(maxSteps + " steps in D(" + deepness + ") end in X = " + X + " , Y = " + Y);
}

solve(10, 500);
solve(50, 1000000000000);