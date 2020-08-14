export class Matrix
{
    readonly array:   Array<Uint32Array>;

    public readonly rows:    u32;
    public readonly columns: u32;

    public constructor(rows: u32, columns: u32)
    {
        this.array  = Matrix.empty(rows, columns);
        this.rows   = rows;
        this.columns= columns;
    }

    static empty(rows: u32, columns: u32) : Array<Uint32Array> 
    {
        const array = new Array<Uint32Array>(rows);
        for(let i : u32 = 0; i < rows; i++)
        {
            array[i] = new Uint32Array(columns);
        }
        return array;
    }

    public get(row: u32, column: u32) : u32
    {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
            throw "Argument out of range";

        return this.array[row][column];
    }

    public set(row: u32, column: u32, value: u32) : void
    {
        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
            throw "Argument out of range";

        this.array[row][column] = value;
    }

    public multiply(right: Matrix, modulo: u32) : Matrix
    {
        const result : Matrix = new Matrix(this.rows, right.columns);
        const MODULO : u64 = modulo;

        for (let i : u32 = 0; i < this.rows; i++) 
        {
            if ((i % 100) == 0)
                trace("multiply ", 1, i);
                
            for (let j : u32 = 0; j < right.columns; j++) 
            {
                let sum : u64 = 0;
                for (let y : u32 = 0; y < this.columns; y++) 
                {
                    const v1 : u64 = this.get(i, y);
                    const v2 : u64 = right.get(y, j);
                    const v  : u64 = (v1 * v2) % MODULO;
                    sum = (sum + v) % MODULO;
                }

                result.set(i, j, u32(sum));
            }
        }

        return result;
    }

    public pow(power: u32, modulo: u32) : Matrix
    {
        if (power == 1)
            return this;

        let m  : Matrix = this;
        let mm : Matrix | null = null;

        while (power > 1)
        {
            trace("Power:", 1, power);
            if ((power & 1) != 0)
            {
                if (mm == null)
                    mm = m;
                else
                    mm = mm.multiply(m, modulo);

                power--;
            }

            while (power > 1 && (power & 1) == 0)
            {
                power /= 2;
                m =  m.multiply(m, modulo);
            }
        }

        if (mm != null)
        {
            m = m.multiply(mm, modulo);
        }

        return m;
    }
}
