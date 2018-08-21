const cardRank = "023456789TJQKA";

let player1Wins = 0;

const ROYAL_FLUSH    = 10;
const STRAIGHT_FLUSH =  9;
const FOUR_OF_A_KIND =  8;
const FULL_HOUSE     =  7;
const FLUSH          =  6;
const STRAIGHT       =  5;
const THREE_OF_A_KIND=  4;
const TWO_PAIR       =  3;
const ONE_PAIR       =  2;
const OTHER          =  1;

function Hand(cards)
{
    cards.sort();

    let self = this;

    this.cards = cards;
    this.usedCards = [];
    this.subRank = 0;

    if (isRoyalFlush())
        this.rank = ROYAL_FLUSH;
    else if (isStraightFlush())
        this.rank = STRAIGHT_FLUSH;
    else if (isFour_of_a_Kind())
        this.rank = FOUR_OF_A_KIND;
    else if (isFullHouse())
        this.rank = FULL_HOUSE;
    else if (isFlush())
        this.rank = FLUSH;
    else if (isStraight())
        this.rank = STRAIGHT;
    else if (isThree_of_a_Kind())
        this.rank = THREE_OF_A_KIND;
    else if (isTwoPair())
        this.rank = TWO_PAIR;
    else if (isOnePair())
        this.rank = ONE_PAIR;
    else
    {
        self.subRank = getCardsRank();        
        this.rank = OTHER;  
    }

    this.subRank2 = getCardsRank(this.usedCards);

    this.compare = function(p2)
    {
        let v = self.rank - p2.rank;
        if (v !== 0)
            return v;
        v = self.subRank - p2.subRank;
        if (v !== 0)
            return v;
        return self.subRank2 - p2.subRank2;
    }
        
    function getRanks(toExclude)
    {
        let ranks = [];
        for(let i = 0; i < 5; i++)
        {
            if (toExclude !== undefined && toExclude.includes(i))
                continue; // Ignore Card
            let rank = cardRank.indexOf(cards[i][0]);
            ranks.push(rank);
        }

        ranks.sort((v1, v2) => { return v1-v2; });
        return ranks;
    }

    // High Card: Highest value card.
    function getCardsRank(toExclude)
    {
        let rank = getRanks(toExclude).reverse();

        let subRank = 0;
        for(let i = 0; i < rank.length; i++)
            subRank = (subRank * 100) + rank[i];

        return subRank;
    }

    // One Pair: Two cards of the same value.
    function isOnePair()
    {
        for(let i = 0; i < 4; i++)
        {
            if (cards[i][0] === cards[i+1][0])
            {
                self.usedCards.push(i, i+1);
                self.subRank = cardRank.indexOf(cards[i][0]);
                return true;
            }
        }

        return false;
    }

    // Two Pairs: Two different pairs.
    function isTwoPair()
    {
        let rank      = [];
        let usedCards = [];

        for(let i = 0; i < 4; i++)
        {
            if (cards[i][0] === cards[i+1][0])
            {
                rank.push(cardRank.indexOf(cards[i][0]));
                usedCards.push(i, i+1);

                if (rank.length === 2)
                {
                    rank.sort();
                    self.subRank = rank[0] + 100 * rank[1];
                    self.usedCards = usedCards;
                    return true;
                }
            }
        }
        return false;
    }

    // Three of a Kind: Three cards of the same value.
    function isThree_of_a_Kind()
    {
        let previous = '0';
        let count    = 0;

        for(let i = 0; i < 3; i++)
        {
            let c = cards[i][0];
            if (c === cards[i+1][0] && c === cards[i+2][0])
            {
                self.subRank = cardRank.indexOf(c);
                self.usedCards.push(i, i+1, i+2);
                return true;
            }
        }

        return false;
    }

    // Straight: All cards are consecutive values.
    function isStraight()
    {
        let ranks = getRanks();

        for (let i = 0; i < 4; i++)
            if (ranks[i]+1 !== ranks[i+1])
                return false;

        self.usedCards = [0,1,2,3,4];
        self.subRank = cardRank.indexOf(cards[0][0]);
        return true;
    }

    // Flush: All cards of the same suit.
    function isFlush()
    {
        let s = cards[0][1];
        for (let card of cards)
        {
            if (card[1] !== s)
                return false;
        }

        self.subRank = getCardsRank();

        return true;
    }

    // Full House: Three of a kind and a pair.
    function isFullHouse()
    {
        let previous = '0';
        let count    = 0;
        let threes   = 0; 
        let twos     = 0;

        for(let card of cards)
        {
            if (card[0] === previous)            
            {
                count++;
                if (count === 3)
                {
                    threes = cardRank.indexOf(previous);
                }
                else if (count === 2 && threes !== 0)
                {
                    twos = cardRank.indexOf(previous);
                }
            }
            else
            {
                if (count === 2 && twos === 0)
                    twos = cardRank.indexOf(previous);

                previous = card[0];
                count    = 1;
            }
        }

        if (twos === 0 || threes === 0)
            return false;
        else
        {
            self.subRank = threes * 100 + twos;
            self.usedCards.push(0, 1, 2, 3, 4);
            return true;
        }
    }

    // Four of a Kind: Four cards of the same value.
    function isFour_of_a_Kind()
    {
        if (cards[1][0] !== cards[2][0] || cards[2][0] !== cards[3][0])
            return false;

        if (cards[0][0] === cards[1][0])
        {
            self.subRank = cardRank.indexOf(cards[1][0]);
            self.usedCards = [0, 1, 2, 3];
            return true;
        }
        else if (cards[3][0] === cards[4][0])
        {
            self.subRank = cardRank.indexOf(cards[1][0]);
            self.usedCards = [1, 2, 3, 4];
            return true;
        }
        else
            return false;
    }

    // Straight Flush: All cards are consecutive values of same suit.
    function isStraightFlush()
    {        
        if (isFlush())
        {
            self.usedCards = [];
            self.subRank   = 0;
            return isStraight();
        }
    }

    // Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.    
    function isRoyalFlush()
    {
        if (! isFlush())
            return false;

        if (cards[0][0] === 'A' && 
            cards[1][0] === 'J' &&
            cards[2][0] === 'K' &&
            cards[3][0] === 'Q' &&
            cards[4][0] === 'T')
        {
            self.subRank = 1;
            self.usedCards = [0,1,2,3,4];
            return true;
        }

        return false;
    }

    return this;
}

function processHand(hand, dump)
{
    let cards = hand.split(' ');
        
    let player1 = new Hand(cards.slice(0, 5));
    let player2 = new Hand(cards.slice(5));

    let v = player1.compare(player2);
    if (v === 0)
        throw "Tie ... Should not be possible";

    if (v > 0)
        player1Wins++;

    if (dump === true)
        console.log(hand + " -> player " + (v > 0 ? "1 wins" : "2 wins"));
}

function test()
{
    const exampleHands = [
        //Pair of Fives //Pair of Eights
        "5H 5C 6S 7S KD 2C 3S 8S 8D TD",
    
        // Highest card Ace // Highest card Queen
        "5D 8C 9S JS AC 2C 5C 7D 8S QH",
    
        // Three Aces // Flush with Diamonds
        "2D 9C AS AH AC 3D 6D 7D TD QD",
    
        // Pair of Queens Highest card Nine // Pair of Queens Highest card Seven
        "4D 6S 9H QH QC 3D 6D 7H QD QS",
    
        // Full House With Three Fours // Full House with Three Threes
        "2H 2D 4C 4D 4S 3C 3D 3S 9S 9D"
    ];
        
    player1Wins = 0;
    for(let hand of exampleHands)
    {
        processHand(hand, true);
    }
    if (player1Wins !== 3)
        throw "Test failed ...";
    player1Wins = 0; // Restore 0
}

console.log("Running Tests ...");
test();
console.log("... Test done");

const fs = require('fs');
const readline = require('readline');
const prettyHrtime = require('pretty-hrtime');

let startTime = process.hrtime();

const readInput = readline.createInterface({
    input: fs.createReadStream('../data/p054_poker.txt')
});

let hands = 0;
player1Wins = 0;

readInput
.on('line', (line) => { 
    hands++;
    processHand(line, false);
})
.on('close', () => {
    let endTime = process.hrtime(startTime);
    let time    = prettyHrtime(endTime, {verbose:true});

    console.log("Player 1 wins " + player1Wins + " times out of " + hands + " hands ( " + time + " )");
    process.exit(0);
});
