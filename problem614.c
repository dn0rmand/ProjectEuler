#include <stdio.h>
#include <time.h>

#define ULONG   unsigned long
#define MODULO ((ULONG)1000000007)
#define MAX     10000000
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
            ULONG s = results[sum];

            if (s != 0) {
                long newSum = value + sum;
                results[newSum] = (results[newSum] + s) % MODULO;
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

int main()
{
    time_t start = time(NULL);
    ULONG answer = solve(MAX);
    time_t end = time(NULL);

    printf("answer is %lu\n", answer);
    printf("Executed in %ld seconds\n", end-start);    
}