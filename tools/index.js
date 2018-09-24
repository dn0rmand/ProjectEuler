const tools = function()
{
    return  {
        digits: require('./digits'),
        primeHelper: require("./primeHelper")(),
        announce: require("./announce"),
        divisors: require("./divisors"),
        divisorsCount: require("./divisorsCount"),
        fractions: require("./fractions"),
        isPrime: require("./isPrime"),
        primes: require("./primes"),
        squareRoot: require("./squareRoot"),
        totient: require("./totient"),
        sudoku: {
            cell: require("./sudoku/cell"),
            grid: require("./sudoku/grid"),
            solver: require("./sudoku/solver")
        }
    }
}

module.exports = tools();
