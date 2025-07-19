function solve() {
    let total = 0;
    let min = Math.pow(10, -11);

    for (let turn = 0, x = 1; x >= min; turn++) {
        x = Math.pow(0.5, turn);
        x = 1 - Math.pow(1 - x, 32);

        if (x < min) {
            break;
        }

        total += x;
    }

    return total.toFixed(10);
}

let result = solve();

console.log('Answer is', result);
