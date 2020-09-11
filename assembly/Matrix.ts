
@external("env", "stdoutWrite")
declare function stdoutWrite(val: string) : void;

export class Matrix
{
    array: StaticArray<Uint32Array>;

    public readonly rows:    u32;
    public readonly columns: u32;

    public constructor(rows: u32, columns: u32)
    {
        this.array  = Matrix.empty(rows, columns);
        this.rows   = rows;
        this.columns= columns;
    }

    static empty(rows: u32, columns: u32) : StaticArray<Uint32Array> 
    {
        const array = new StaticArray<Uint32Array>(rows);
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

    public multiply(right: Matrix, modulo: u32, enableTracing : bool = false) : Matrix
    {
        const result : Matrix = new Matrix(this.rows, right.columns);
        const MODULO : u64 = modulo;

        let traceCount = 0;
        for (let i : u32 = 0; i < this.rows; i++) 
        {
            if (enableTracing)
            {
                if (traceCount == 0)
                    trace('\r' + i.toString());

                if (traceCount++ > 100)
                    traceCount = 0;
            }
                
            const left  : Uint32Array = this.array[i];
            const target: Uint32Array = result.array[i];

            for (let j : u32 = 0; j < right.columns; j++) 
            {
                let sum : u64 = 0;
                for (let y : u32 = 0; y < this.columns; y++) 
                {
                    const v1 : u64 = left[y];
                    const v2 : u64 = right.array[y][j];
                    sum += (v1 * v2) % MODULO;
                }

                target[j] = u32(sum % MODULO);
            }
        }

        if (enableTracing)
            trace('\r                     \r');
        return result;
    }

    innerPow(power: u64, modulo: u32, enableTracing : bool = false) : Matrix
    {
        if (power == 1)
            return this;

        let m  : Matrix = this;
        let mm : Matrix | null = null;
        let steps = 0;

        while (power > 1)
        {
            if ((power & 1) != 0)
            {
                power--;
                if (enableTracing)
                    trace("Power " + power.toString() + " - Step " + (steps++).toString());

                if (mm == null)
                    mm = m;
                else
                    mm = mm.multiply(m, modulo);
            }

            while (power > 1 && (power & 1) == 0)
            {
                power /= 2;
                if (enableTracing)
                    trace("Power " + power.toString() + " - Step " + (steps++).toString());
                m =  m.multiply(m, modulo);
            }
        }

        if (mm != null)
        {
            if (enableTracing)
                trace("Finisup - Step " + (steps++).toString());
            m = m.multiply(mm, modulo);
        }
        
        return m;
    }

    public pow(power: u32, modulo: u32, trace : bool = false) : void
    {
        const m = this.innerPow(power, modulo, trace);
        this.array = m.array;
    }

    public bigPow(powerLo: u32, powerHi: u32, modulo: u32, trace : bool = false) : void
    {
        const power : u64 = (u64(powerHi) << 32) + u64(powerLo);
        const m = this.innerPow(power, modulo, trace);
        this.array = m.array;
    }
}
