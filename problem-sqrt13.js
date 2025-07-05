function* sqrtDigits(n) {
    n = BigInt(n);
    let remainder = 0n;
    let root = 0n;
    let divisor = 0n;

    // Prepare n as a string, pad with even number of digits
    let nStr = n.toString();
    if (nStr.length % 2 !== 0) nStr = '0' + nStr;
    let pairs = [];
    for (let i = 0; i < nStr.length; i += 2) {
        pairs.push(BigInt(nStr.slice(i, i + 2)));
    }

    let idx = 0;
    while (true) {
        // Bring down next pair or 00 if finished
        remainder = remainder * 100n + (idx < pairs.length ? pairs[idx++] : 0n);

        // Find next digit
        let x = 0n;
        let candidate = 0n;
        divisor = root * 20n;
        for (let d = 9n; d >= 0n; d--) {
            candidate = divisor + d;
            if (candidate * d <= remainder) {
                x = d;
                break;
            }
        }
        yield x;

        remainder -= (divisor + x) * x;
        root = root * 10n + x;
    }
}

let answer = -3n;
let count = 0;
for (const d of sqrtDigits(13)) {
    count++;
    answer += d;
    if (count === 1001) {
        break;
    }
}

console.log(`Answer is ${answer}`);
