const Tracer = require('tools/tracer');

class Matrix
{
    constructor(rows, columns)
    {
        this.array  = Matrix.empty(rows, columns);
        this.rows   = rows;
        this.columns= columns;
    }

    static empty(rows, columns)
    {
        const array = new Array(rows);
        for(let i = 0; i < rows; i++)
        {
            array[i] = new Int32Array(columns);
        }
        return array;
    }

    static fromRecurrence(factors)
    {
        const matrix = new Matrix(factors.length, factors.length);

        matrix.array[0] = [...factors].reverse().map(a => Number(a)); 

        for(let i = 1; i < factors.length; i++)
            matrix.set(i, i-1, 1);
            
        return matrix;
    }

    get(row, column) 
    {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
            throw "Argument out of range";

        return this.array[row][column];
    }

    set(row, column, value) 
    {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
            throw "Argument out of range";

        this.array[row][column] = value;
    }

    multiply(right, modulo, trace) 
    {
        const result = new Matrix(this.rows, right.columns);
        let modMul, modSum, fixSum;
        
        if (modulo)
        {
            const modulo_n = BigInt(modulo);
            
            modMul = (a, b) => {
                let v = a*b;
                if (v > Number.MAX_SAFE_INTEGER)
                    return Number((BigInt(a)*BigInt(b)) % modulo_n);
                else
                    return v % modulo;
            }

            modSum = (a, b) => (a+b) % modulo;
            fixSum = a => { 
                while (a < 0)
                    a += modulo;
                return a;
            }
        }
        else
        {
            modMul = (a, b) => a*b;
            modSum = (a, b) => a+b;
            fixSum = a => a;
        }

        const tracer = new Tracer(100, trace);

        for (let i = 0; i < this.rows; i++) 
        {
            tracer.print(_ => this.rows - i);

            for (let j = 0; j < right.columns; j++) 
            {
                let sum = 0;
                for (let y = 0; y < this.columns; y++) 
                {
                    sum = modSum(sum, modMul(this.get(i, y), right.get(y, j)));
                }

                result.set(i, j, fixSum(sum));
            }
        }

        tracer.clear();

        return result;
    }

    pow(pow, modulo, trace)
    {
        if (pow == 1)
            return this;

        let m  = this;
        let mm = undefined;

        const tracer = new Tracer(1, trace);

        while (pow > 1)
        {
            tracer.print(_ => pow);

            if ((pow & 1) !== 0)
            {
                if (mm === undefined)
                    mm = m;
                else
                    mm = mm.multiply(m, modulo, trace);

                pow--;
            }

            while (pow > 1 && (pow & 1) === 0)
            {
                pow /= 2;
                m =  m.multiply(m, modulo, trace);
            }
        }

        if (mm !== undefined)
        {
            m = m.multiply(mm, modulo, trace);
        }

        tracer.clear();
        return m;
    }
}

module.exports = Matrix;