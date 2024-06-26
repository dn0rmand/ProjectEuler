// Matrix Sum
// ----------
// Problem 345
// -----------
// We define the Matrix Sum of a matrix as the maximum sum of matrix elements with each element being the only one in his row and column. For example, the Matrix Sum of the matrix below equals 3315 ( = 863 + 383 + 343 + 959 + 767):

//   7  53 183 439 863
// 497 383 563  79 973
// 287  63 343 169 583
// 627 343 773 959 943
// 767 473 103 699 303

// Find the Matrix Sum of:

//   7  53 183 439 863 497 383 563  79 973 287  63 343 169 583
// 627 343 773 959 943 767 473 103 699 303 957 703 583 639 913
// 447 283 463  29  23 487 463 993 119 883 327 493 423 159 743
// 217 623   3 399 853 407 103 983  89 463 290 516 212 462 350
// 960 376 682 962 300 780 486 502 912 800 250 346 172 812 350
// 870 456 192 162 593 473 915  45 989 873 823 965 425 329 803
// 973 965 905 919 133 673 665 235 509 613 673 815 165 992 326
// 322 148 972 962 286 255 941 541 265 323 925 281 601  95 973
// 445 721  11 525 473  65 511 164 138 672  18 428 154 448 848
// 414 456 310 312 798 104 566 520 302 248 694 976 430 392 198
// 184 829 373 181 631 101 969 613 840 740 778 458 284 760 390
// 821 461 843 513  17 901 711 993 293 157 274  94 192 156 574
//  34 124   4 878 450 476 712 914 838 669 875 299 823 329 699
// 815 559 813 459 522 788 168 586 966 232 308 833 251 631 107
// 813 883 451 509 615  77 281 613 459 205 380 274 302  35 805

const assert = require('assert');

const realData = [
    [  7,  53, 183, 439, 863, 497, 383, 563,  79, 973, 287,  63, 343, 169, 583], // 0
    [627, 343, 773, 959, 943, 767, 473, 103, 699, 303, 957, 703, 583, 639, 913],
    [447, 283, 463,  29,  23, 487, 463, 993, 119, 883, 327, 493, 423, 159, 743],
    [217, 623,   3, 399, 853, 407, 103, 983,  89, 463, 290, 516, 212, 462, 350],
    [960, 376, 682, 962, 300, 780, 486, 502, 912, 800, 250, 346, 172, 812, 350],
    [870, 456, 192, 162, 593, 473, 915,  45, 989, 873, 823, 965, 425, 329, 803],
    [973, 965, 905, 919, 133, 673, 665, 235, 509, 613, 673, 815, 165, 992, 326],
    [322, 148, 972, 962, 286, 255, 941, 541, 265, 323, 925, 281, 601,  95, 973], // 7
    [445, 721,  11, 525, 473,  65, 511, 164, 138, 672,  18, 428, 154, 448, 848],
    [414, 456, 310, 312, 798, 104, 566, 520, 302, 248, 694, 976, 430, 392, 198],
    [184, 829, 373, 181, 631, 101, 969, 613, 840, 740, 778, 458, 284, 760, 390],
    [821, 461, 843, 513,  17, 901, 711, 993, 293, 157, 274,  94, 192, 156, 574],
    [ 34, 124,   4, 878, 450, 476, 712, 914, 838, 669, 875, 299, 823, 329, 699],
    [815, 559, 813, 459, 522, 788, 168, 586, 966, 232, 308, 833, 251, 631, 107],
    [813, 883, 451, 509, 615,  77, 281, 613, 459, 205, 380, 274, 302,  35, 805]
];

function findMax(data, start, end, results)
{
    function find(row, total, path)
    {
        if (row >= end)
        {
            let old = results.get(path);
            if (old === undefined || old < total)
                results.set(path, total);
            return;
        }
        let r = data[row];
        let pp = 1;
        for (let i = 0; i < r.length; i++, pp <<= 1)
        {
            if ((path & pp) !== 0)
                continue;

            find(row+1, total + r[i], path | pp);
        }
    }

    find(start, 0, 0);
}

function quickFindMax(data)
{
    let xx = Math.pow(2, data[0].length)-1;
    let middle = Math.floor(data.length / 2);

    let p1 = new Map();
    let p2 = new Map();

    findMax(data,0, middle, p1);
    findMax(data, middle, data.length, p2);

    let max = 0;

    for(let path1 of p1.keys())
    for(let path2 of p2.keys())
    {
        if ((path1 | path2) === xx && (path1 & path2) === 0)
        {
            let total = p1.get(path1) + p2.get(path2);
            if (total > max)
                max = total;
        }
    }

    return max;
}

let answer = quickFindMax(realData);

console.log("The answer is " + answer);