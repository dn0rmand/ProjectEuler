// Disc game prize fund
// Problem 121
// A bag contains one red disc and one blue disc. In a game of chance a player takes a disc at random and its colour
// is noted. After each turn the disc is returned to the bag, an extra red disc is added, and another disc is taken
// at random.

// The player pays £1 to play and wins if they have taken more blue discs than red discs at the end of the game.

// If the game is played for four turns, the probability of a player winning is exactly 11/120, and so the maximum
// prize fund the banker should allocate for winning in this game would be £10 before they would expect to incur a loss.
// Note that any payout will be a whole number of pounds and also includes the original £1 paid to play the game, so in
// the example given the player actually wins £9.

// Find the maximum prize fund that should be allocated to a single game in which fifteen turns are played.

const bigInt = require('big-integer');

function fraction(n, d) {
    if (!n.isZero()) {
        let x = bigInt.gcd(n, d);
        n = n.divide(x);
        d = d.divide(x);
    }

    return {
        numerator: n,
        divisor: d,

        plus: function (x) {
            let n = this.numerator.times(x.divisor).plus(this.divisor.times(x.numerator));
            let d = this.divisor.times(x.divisor);

            return fraction(n, d);
        },

        times: function (x) {
            let n = this.numerator.times(x.numerator);
            let d = this.divisor.times(x.divisor);

            return fraction(n, d);
        },
    };
}

function solve(turns) {
    let redDisc = 0;

    let blues = [fraction(bigInt(1), bigInt(1))];

    let max = 0;
    let disc = bigInt(1);
    for (let turn = 0; turn < turns; turn++) {
        disc = disc.next();

        let blueChances = fraction(bigInt(1), disc);
        let redChances = fraction(disc.prev(), disc);

        max++;
        blues.push(fraction(bigInt(0), bigInt(1)));

        for (let c = max; c >= 1; c--) {
            let v1 = blues[c].times(redChances);
            let v2 = blues[c - 1].times(blueChances);

            blues[c] = v1.plus(v2);
        }
    }

    let bluesToWin = (turns >> 1) + 1;
    let winChances = blues[bluesToWin];
    let fund = 0;

    for (let i = 1; ; i++) {
        if (winChances.numerator.times(i).geq(winChances.divisor)) break;
        fund = i;
    }
    console.log('With ' + turns + ' turns, the Max Prize Fund is ' + fund);
}

solve(4);
solve(15);
