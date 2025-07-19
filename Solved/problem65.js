const bigInt = require('big-integer');

function buildSequence(size) {
    let sequence = [2];
    let i = 2;

    while (sequence.length < size) {
        sequence.push(1);
        if (sequence.length < size) sequence.push(i);
        if (sequence.length < size) sequence.push(1);

        i += 2;
    }

    return sequence;
}

function sumDigits(value) {
    let sum = 0;
    while (value.greater(0)) {
        let m = value.mod(10);
        sum += m;
        value = value.subtract(m).divide(10);
    }
    return sum;
}

function evaluate(size) {
    let sequence = buildSequence(size);
    let numerator = bigInt(sequence[size - 1]);
    let divisor = bigInt(1);

    for (let i = size - 1; i > 0; i--) {
        let x = numerator;
        numerator = divisor;
        divisor = x;

        let a = sequence[i - 1];

        numerator = divisor.multiply(a).add(numerator);
    }

    console.log(
        'The sum of digits in the numerator of the 100th convergent of the continued fraction for e is ' +
            sumDigits(numerator)
    );
}

evaluate(100);
