const isNumberPrime = require('is-number-prime');

module.exports = function isPrime(value)
{
    if (value === 2 || value === 3)
        return true;
    else
        return isNumberPrime(value);
}
