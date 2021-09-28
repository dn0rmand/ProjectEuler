#include <stdio.h>
#include <time.h>

#define ULONG       unsigned long
#define MODULO      ((ULONG)1000000007)
#define MAX         100000
// 00
#define MIN(a, b)   ((a) < (b) ? (a) : (b))

static ULONG results[MAX+1];

ULONG solve(int n)
{
    for(long i = 0; i <= n; i++) {
        results[i] = 0;
    }

    results[0] = 1;

    long maxSum = 0;

    for(long value = 1; value <= n; value++) 
    {
        if ((value % 4) == 2) {
            continue;
        }

        for(long sum = MIN(maxSum, n-value); sum >= 0; sum--)
        {
            register ULONG s = results[sum];

            if (s != 0) {
                long newSum = value + sum;
                ULONG v = results[newSum] + s;

                if (v >= MODULO) {
                    v -= MODULO;
                }

                results[newSum] = v;
            }
        }

        maxSum += value;
    }

    ULONG total = 0;
    for(long sum = 1; sum <= n; sum++) {
        total = (total + results[sum]) % MODULO;
    }
    return total;
}

int Test()
{
    if (solve(1) != 1) return 2;
    if (solve(2) != 0) return 3;
    if (solve(3) != 1) return 4;
    if (solve(6) != 1) return 5;
    if (solve(10) != 3) return 6;
    if (solve(1000) != (3699177285485660336L % MODULO)) return 7;

    if (solve(100) != 37076) return 1;    
    
    printf("Tests passed");
    return 0;
}

int main()
{
    int failed = Test();

    if (failed) {
        printf("Test %d failed!!!!\n", failed);
    } else {
        time_t start = time(NULL);
        ULONG answer = solve(MAX);
        time_t end = time(NULL);

        printf("answer is %lu\n", answer);
        printf("Executed in %ld seconds\n", end-start);    
    }
}