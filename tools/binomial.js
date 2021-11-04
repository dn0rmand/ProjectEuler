const $C = [];

function binomial(n, p)
{
    if (n < p) { return 0; }

    if (p === 0 || p === n) { return 1; }
    if (p === 1 || p === n) { return n; }

    if (p > n/2) {
        p = n-p;
    }

    if ($C[n] && $C[n][p]) {
        return $C[n][p];
    }

    let result = n;

    for(let p2 = 1; p2 < p; p2++) {
        result *= n-p2;
        result /= p2+1;
    }

    if (! $C[n]) {
        $C[n] = [];
    }
    $C[n][p] = result;

    return result;
}

module.exports = binomial;