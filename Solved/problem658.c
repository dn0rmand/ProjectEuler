//
//  problem658.c
//
//  Created by Dominique Normand on 3/2/19.
//

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ulong unsigned long

const ulong modulo     = 1000000007;
const ulong LETTERS    = 1E5;
const ulong MAX_LENGTH = 1E12;

ulong modPow(ulong value, ulong exp)
{
    ulong r     = 1;
    ulong base  = value;
    if (base >= modulo)
        base %= modulo;

    if (base == 0)
        return 0;

    while (exp > 0)
    {
        if ((exp & 1) == 1)
            r = (r * base) % modulo;

        exp >>= 1;
        base = (base * base) % modulo;
    }

    return r;
}

long modInv(long newR)
{
    long t    = 0;
    long newT = 1;
    long r    = modulo;
    long q, lastT, lastR;

    while (newR != 0)
    {
        q = r / newR;
        lastT = t;
        lastR = r;
        t = newT;
        r = newR;
        newT = lastT - q * newT;
        newR = lastR - q * newR;
    }
    if (r != 1)
    {
        printf("failed to process modInv - values not co-prime\n");
        exit(-1);
    }

    if (t < 0)
        t += modulo;
    
    if (modulo < 0)
        return -t;
    return t;
};

ulong A(ulong l, ulong length)
{
    if (l == 0)
        return 1;
    if (l == 1) // avoid dividing by 0
        return (length + 1) % modulo;
    ulong total = modPow(l, length + 1) - 1;
    if (total < 0)
        total += modulo;
    long divisor = modInv(l-1);
    total = (total * divisor) % modulo;
    
    return total;
}

ulong I(ulong letters, ulong length, ulong* factors, int trace)
{
    ulong total = 0;

    for (ulong i = 1, j = letters-1; i <= letters; i++, j--)
    {
        if (trace)
        {
            fprintf(stdout, "\r%lu", i);
            fflush(stdout);
        }
        
        ulong f = A(j, length);
        ulong x = factors[j];
        int negative = (x < 0);
        if (negative)
            x = -x;
        
        ulong y = (f * x) % modulo;
        
        if (negative)
        {
            if (total < y)
                total += modulo;
            
            total = (total - y) % modulo;
        }
        else
        {
            total = (total + y) % modulo;
        }
    }
    
    return total;
}

void noTrace(ulong letter) {}

static int count = 0;

void Trace(ulong letter)
{
    if (count == 0)
    {
        fprintf(stdout, "\r%lu", letter);
        fflush(stdout);
    }
    if (count++ >= 999)
        count = 0;
}

ulong Solve(ulong letters, ulong length, int trace)
{
    ulong total;
    
    void (*doTrace)(ulong) = trace ? Trace : noTrace;
    
    ulong *previousRow = (ulong*)malloc(sizeof(ulong) * letters);
    ulong *currentRow  = (ulong*)malloc(sizeof(ulong) * letters);
    ulong *factors     = (ulong*)malloc(sizeof(ulong) * letters);
    
    for (ulong letter = 1; letter <= letters; letter++)
    {
        doTrace(letter);
        
        ulong max = letters-letter;
        
        if (letter == 1)
        {
            total = 0;
            for (ulong l = 0; l <= max; l++)
            {
                ulong v = (l & 1) ? modulo-1 : 1;
                currentRow[l] = v;
                total += v;
            }
            total %= modulo;
        }
        else // use previous row to figure it out
        {
            currentRow[0] = letter;
            total  = letter;
            for (ulong l = 1; l <= max; l++)
            {
                ulong v = previousRow[l];
                ulong v2= currentRow[l-1];
                if (v >= v2)
                    v -= v2;
                else
                    v = v + modulo - v2;
                
                currentRow[l] = v;
                
                total += v;
            }
            total %= modulo;
        }
        factors[letter-1] = total;
        
        // Switch rows to avoid allocating memory
        ulong* r = currentRow;
        currentRow = previousRow;
        previousRow = r;
    }
    
    free(previousRow);
    free(currentRow);
    
    if (trace)
    {
        printf("\nStep 1 done\n");
        printf("Last step - Consolidation\n");
    }
    
    ulong result = I(letters, length, factors, trace);
    
    free(factors);
    
    if (trace)
        printf("\nDone\n");
    
    return result;
}

void Assert(ulong value, ulong expected)
{
    if (value == expected)
        return;
    printf("Test failed: got %lu but expected %lu\n", value, expected);
    exit(-1);
}

int main(int argc, const char * argv[])
{
    Assert(Solve(4, 4, 0), 406);
    Assert(Solve(8, 8, 0), 27902680);
    Assert(Solve(10,100,0), 983602076);
    
    ulong start = clock();
    ulong answer = Solve(LETTERS, MAX_LENGTH, 1);
    ulong end = clock();
    
    ulong total_t = (ulong )(end - start) / CLOCKS_PER_SEC;
    
    printf("Answer is %lu executed in %lu seconds\n", answer, total_t);
    return 0;
}
