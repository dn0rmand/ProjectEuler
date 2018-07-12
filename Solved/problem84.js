// Monopoly odds
// Problem 84 
// In the game, Monopoly, the standard board is set up in the following way:

// GO A1 CC1 A2 T1 R1 B1 CH1 B2 B3 JAIL
// H2                                C1
// T2                                U1
// H1                                C2
// CH3                               C3
// R4                                R2
// G3                                D1
// CC3                              CC2
// G2                                D2
// G1                                D3
// G2J F3 U2  F2 F1 R3 E3 E2 CH2 E1  FP

// A player starts on the GO square and adds the scores on two 6-sided dice to determine the number of squares they advance 
// in a clockwise direction. Without any further rules we would expect to visit each square with equal probability: 2.5%. 
// However, landing on G2J (Go To Jail), CC (community chest), and CH (chance) changes this distribution.

// In addition to G2J, and one card from each of CC and CH, that orders the player to go directly to jail, 
// if a player rolls three consecutive doubles, they do not advance the result of their 3rd roll. 
// Instead they proceed directly to jail.

// At the beginning of the game, the CC and CH cards are shuffled. When a player lands on CC or CH they take a card from the top 
// of the respective pile and, after following the instructions, it is returned to the bottom of the pile. 
// There are sixteen cards in each pile, but for the purpose of this problem we are only concerned with cards that order a 
// movement; any instruction not concerned with movement will be ignored and the player will remain on the CC/CH square.

// Community Chest (2/16 cards):
// Advance to GO
// Go to JAIL

// Chance (10/16 cards):
// Advance to GO
// Go to JAIL
// Go to C1
// Go to E3
// Go to H2
// Go to R1
// Go to next R (railway company)
// Go to next R
// Go to next U (utility company)
// Go back 3 squares.

// The heart of this problem concerns the likelihood of visiting a particular square. That is, the probability of finishing at 
// that square after a roll. For this reason it should be clear that, with the exception of G2J for which the probability of 
// finishing on it is zero, the CH squares will have the lowest probabilities, as 5/8 request a movement to another square, 
// and it is the final square that the player finishes at on each roll that we are interested in. We shall make no distinction 
// between "Just Visiting" and being sent to JAIL, and we shall also ignore the rule about requiring a double to "get out of jail", 
// assuming that they pay to get out on their next turn.

// By starting at GO and numbering the squares sequentially from 00 to 39 we can concatenate these two-digit numbers to produce 
// strings that correspond with sets of squares.

// Statistically it can be shown that the three most popular squares, in order, are JAIL (6.24%) = Square 10, 
// E3 (3.18%) = Square 24, and GO (3.09%) = Square 00. So these three most popular squares can be 
// listed with the six-digit modal string: 102400.

// If, instead of using two 6-sided dice, two 4-sided dice are used, find the six-digit modal string.

const bigInt = require('big-integer');

const squares = [
    'GO',  // 00
    'A1',  // 01
    'CC',  // 02
    'A2',  // 03
    'T',   // 04
    'R',   // 05
    'B1',  // 06
    'CH',  // 07
    'B2',  // 08
    'B3',  // 09
    'JAIL',// 10
    'C1',  // 11
    'U',   // 12
    'C2',  // 13
    'C3',  // 14
    'R',   // 15
    'D1',  // 16
    'CC',  // 17
    'D2',  // 18
    'D3',  // 19
    'FP',  // 20
    'E1',  // 21
    'CH',  // 22
    'E2',  // 23
    'E3',  // 24
    'R',   // 25
    'F1',  // 26
    'F2',  // 27
    'U',   // 28
    'F3',  // 29
    'G2J', // 30
    'G1',  // 31
    'G2',  // 32
    'CC',  // 33
    'G3',  // 34
    'R',   // 35
    'CH',  // 36
    'H1',  // 37
    'T',   // 38
    'H2'   // 39
];

let communityChest = [
    'Advance to GO',
    'Go to JAIL'
];

let chance = [
    'Advance to GO',
    'Go to JAIL',
    'Go to C1',
    'Go to E3',
    'Go to H2',
    'Go to R1',
    'Go to next R', // (railway company)
    'Go to next R',
    'Go to next U', // (utility company)
    'Go back 3 squares'
];

function random(min, max)
{
//    return bigInt.randBetween(min, max).valueOf();

    let value = Math.random();
    let range = max-min+1;

    value = Math.floor(value * range)+min;
    return value;
}

function mixeCards(card)
{
    while (card.length != 16)
        card.push('N/A');

    let newCards = [];

    while (newCards.length != 16)
    {
        let x = random(0, 15);
        if (card[x] !== ' ')
        {
            newCards.push(card[x]);
            card[x] = ' ';
        }
    }    

    return newCards;
}

function play(turns, diceMax)
{
    let tripleDouble = 0;
    let rolls        = 0;
    let square       = 0;
    
    function rollDice(diceMax)
    {
        let d1, d2;
    
        rolls++;
    
        // First Roll
        d1 = random(1, diceMax);
        d2 = random(1, diceMax);
        if (d1 === d2)
        {
            // 2nd Roll
            d1 = random(1, diceMax);
            d2 = random(1, diceMax);
            if (d1 === d2)
            {
                // 3rd Roll
                d1 = random(1, diceMax);
                d2 = random(1, diceMax);
                if (d1 !== d2)
                {
                    tripleDouble++;
                    // Go to Jail
                    return 0;
                }
            }
        }
    
        return d1+d2;
    }
    
    function moveTo(c)
    {
        while (squares[square] !== c)
            square = (square+1) % squares.length;
    }

    function takeCard(cards)
    {
        let c = cards.shift();
        cards.push(c);
        switch(c)
        {
            case 'Advance to GO':
                square = 0;
                break;
            case 'Go to JAIL':
                square = 10;
                break;
            case 'Go to C1':
                moveTo('C1');
                break;
            case 'Go to E3':
                moveTo('E3');
                break;
            case 'Go to H2':
                moveTo('H2');
                break;
            case 'Go to R1':
                square = 0;
                moveTo('R');
                break;
            case 'Go to next R':
                moveTo('R');
                break;
            case 'Go to next U':
                moveTo('U');
                break;
            case 'Go back 3 squares':
                square -= 3;
                if (square < 0)
                    square += squares.length;
                break;
        }
    }

    function playTurn()
    {
        let value = rollDice(diceMax);
        if (value === -1)
        {
            square = 10;
            return;
        }

        let old    = square;
        square = (square + value) % squares.length;
        
        while (old != square)
        {
            old = square;

            switch (squares[square])
            {
                case 'G2J':
                    square = 10;
                    return;
                case 'CC':
                    takeCard(communityChest);
                    break;
                case 'CH':
                    takeCard(chance);
                    break;
                default:
                    break;
            }
        }
    }

    chance = mixeCards(chance);
    communityChest = mixeCards(communityChest);

    let visited = [];
    for(let i = 0; i < squares.length; i++)
        visited[i] = 0;

    visited[0] = 1;
    for (let i = 0; i < turns; i++)
    {
        playTurn();
        visited[square]++;
    }

    let max1 = 0 , max2 = 0, max3 = 0;
    let i1   = 0 , i2   = 0, i3   = 0;
    for(let i = 0; i < squares.length; i++)
    {
        let v = visited[i];
        if (v > max1)
        {
            max3 = max2;
            i3   = i2;

            max2 = max1;
            i2   = i1;

            max1 = v;
            i1   = i;
        }
        else if (v > max2)
        {
            max3 = max2;
            i3   = i2;

            max2 = v;
            i2   = i;  
        }
        else if (v > max3)
        {
            max3 = v;
            i3   = i;
        }
    }

    console.log((i1*10000 + i2*100 + i3) + ' -> ' + squares[i1] + ' , ' + squares[i2] + ' , ' + squares[i3]);
    console.log();
    //console.log(tripleDouble + ' triple double out of '+rolls+ ' = ' + ((tripleDouble/rolls)*100));
}

play(10000000, 6);
play(10000000, 4);