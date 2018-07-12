// Searching for a maximum-sum subsequence
// ---------------------------------------
// Problem 149 
// -----------
// Looking at the table below, it is easy to verify that the maximum possible sum of adjacent numbers in any 
// direction (horizontal, vertical, diagonal or anti-diagonal) is 16 (= 8 + 7 + 1).

// +---+---+---+---+
// |−2 | 5 | 3 | 2 |
// +---+---+---+---+
// | 9 |−6 | 5 | 1 |
// +---+---+---+---+
// | 3 | 2 | 7 | 3 |
// +---+---+---+---+
// |−1 | 8 |−4 | 8 |
// +---+---+---+---+

// Now, let us repeat the search, but on a much larger scale:

// First, generate four million pseudo-random numbers using a specific form of what is known as 
// a "Lagged Fibonacci Generator":

// For 1 ≤ k ≤ 55, sk = [100003 − 200003k + 300007k^3] (modulo 1000000) − 500000.
// For 56 ≤ k ≤ 4000000, sk = [sk−24 + sk−55 + 1000000] (modulo 1000000) − 500000.

// Thus, s10 = −393027 and s100 = 86613.

// The terms of s are then arranged in a 2000×2000 table, using the first 2000 numbers to fill the first 
// row (sequentially), the next 2000 numbers to fill the second row, and so on.

// Finally, find the greatest sum of (any number of) adjacent entries in any direction 
// (horizontal, vertical, diagonal or anti-diagonal).

const assert = require('assert');

const example_table = [
    [-2, 5, 3, 2],
    [ 9,-6, 5, 1],
    [ 3, 2, 7, 3],
    [-1, 8,-4, 8]
];

class Fibonnacci
{
    constructor()
    {
        this.memoize = [];
    }

    get(k)
    {
        if (k < 1 || k > 4000000)
            throw "Invalid K";

        let result = this.memoize[k];
        if (result === undefined)
        {
            result = this._get(k);
            this.memoize[k] = result;
        }
        return result;
    }

    _get(k)
    {
        if (k <= 55)
        {
            let k3 = Math.pow(k, 3);

            let v1 = 100003;
            let v2 = (200003*k);
            let v3 = (300007*k3); 

            v2 = v2 % 1000000;
            v3 = v3 % 1000000;
            let v = (v1 - v2 + v3) % 1000000;

            return v - 500000;
        }
        else
        {
            let v1 = this.get(k-24);
            let v2 = this.get(k-55);

            let v = ((v1 % 1000000) + (v2 % 1000000) + 1000000) % 1000000;

            return v - 500000
        }
    }
}

class Table
{
    constructor()
    {
        this.table = this.create();
        this.size  = this.table.length;
    }

    create()
    {
        throw "notImplemented";
    }

    horizontal(x, y)
    {
        let max = this.table[y][x];

        let current = max;
        while(++x < this.size)
        {
            current += this.table[y][x];
            if (current > max)
                max = current;
        }

        return max;
    }

    vertical(x, y)
    {
        let max = this.table[y][x];

        let current = max;
        while(++y < this.size)
        {
            current += this.table[y][x];
            if (current > max)
                max = current;
        }

        return max;
    }

    diagonal(x, y)
    {
        let max = this.table[y][x];

        let current = max;
        while(++y < this.size && ++x < this.size)
        {
            current += this.table[y][x];
            if (current > max)
                max = current;
        }

        return max;
    }

    anteDiagonal(x, y)
    {
        let max = this.table[y][x];

        let current = max;
        while(++y < this.size && --x >= 0)
        {
            current += this.table[y][x];
            if (current > max)
                max = current;
        }

        return max;
    }

    solve()
    {
        let max = 0;
    
        for (let y = 0; y < this.size; y++)
        for (let x = 0; x < this.size; x++)
        {
            let m1 = this.vertical(x, y);
            let m2 = this.horizontal(x, y);
            let m3 = this.diagonal(x, y);
            let m4 = this.anteDiagonal(x, y);
    
            max = Math.max(max, m1, m2, m3, m4);
        }
    
        return max;
    }    
}

class ExampleTable extends Table
{
    create()
    {
        return example_table;
    }
}

class FibonacciTable extends Table
{
    create()
    {
        let fib = new Fibonnacci();

        let table = [];

        let k = 1;
        for (let y = 0; y < 2000; y++)
        {
            let a = [];
            table.push(a);
            for (let x = 0; x < 2000; x++)
            {
                a.push(fib.get(k++));
            }
        }
    
        return table;
    }
}

assert.equal(new ExampleTable().solve(), 16);

let mainTable = new FibonacciTable();
let answer = mainTable.solve();

console.log('Answer to problem 149 is', answer);