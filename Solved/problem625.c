// AZURE JT6fKszVm2DdnULx8bKC

#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

// Gcd sum
// Problem 625

// G(N)= ∑j=1->N ∑i=1->j gcd(i,j)

// You are given: G(10)=122
// Find G(10^11). Give your answer modulo 998244353

#define MODULO              998244353L

#define MAX                 100000000000L
#define TEST                100000000L
#define PRIME_ARRAY_SIZE    664579

static int  _primes[PRIME_ARRAY_SIZE];
static long _maxPrime = 3;

static char* _cache = NULL;

int getCache(long index)
{
    if (index < _maxPrime)
        return 1;
    
    index -= _maxPrime;
    
    int bits    = (index & 7);
    long offset = index >> 3; // divide by 8 bits
    char mask   = 1 << bits;

    return (_cache[offset] & mask);
}

void setCache(long index)
{
    if (index < _maxPrime)
        return;
    
    index -= _maxPrime;
    int bits    = (index & 7);
    long offset = index >> 3; // divide by 8 bits
    char mask   = 1 << bits;
    
    _cache[offset] |= mask;
}

static void generatePrimes()
{
    int     max     = 10000000;
    char*   sieve   = calloc(max+1, 1);
    
    _primes[0] = 2;
    _primes[1] = 3;
    
    int primeIndex = 2;
    
    for (int i = 2, j = 3; ; i+=2, j+=3)
    {
        if (i > max)
            break;
        sieve[i] = 1;
        if (j <= max)
            sieve[j] = 1;
    }
    
    for (int i = 5; i <= max; i += 2)
    {
        if (sieve[i] != 0)
            continue;
        sieve[i] = 1;
        _primes[primeIndex++] = i;
        _maxPrime = i;
        for(int j = i+i; j <= max; j += i)
            sieve[j] = 1;
    }
    
    free(sieve);
}

static long g(long n, int e)
{
    if (e == 1)
        return n+n-1;
    
    if (e != 0)
    {
        //(p^(e−1)) * ((p−1)*e+p)
        
        long total = pow(n, e-1) * (((n-1) * e) + n);
        
        return total;
    }
    else
    {
        long total  = 1;
        int  max    = sqrt(n);
        
        for (int pi = 0; pi < PRIME_ARRAY_SIZE; pi++)
        {
            int p = _primes[pi];
            if (p > max)
                break;
            
            int power = 0;
            
            while ((n % p) == 0)
            {
                n /= p;
                power++;
            }
            
            if (power > 0)
            {
                total *= g(p, power);
                
                if (n == 1)
                    break;
                
                max = sqrt(n);
            }
        }
        
        if (n > 1)
            total *= g(n, 1);
        
        return total;
    }
}

static long _seedTotal = 0;
static long _count = 0;
static long _seedMax;
static int  _percent = 0;

static void seed_add(long index, long value)
{
    _seedTotal = (_seedTotal + value) % MODULO;
    setCache(index);
    _count++;
    if ((_count & 0xFF) == 0)
    {
        int percent = (int)((_count * 100) / _seedMax);
        if (percent != _percent)
        {
            _percent = percent;
            printf("\r%i%c ", percent, '%');
            fflush(stdout);
        }
    }
}

static void seed_inner(int pi, int factor, long value, long index)
{
    if (index > _seedMax)
        return;
    
    long prime = _primes[pi];
    long newValue = value * g(prime, factor);
    
    seed_add(index, newValue);
    
    // Use same prime ( special case )
    long idx = index*prime;
    int  f = factor;
    if (idx > _seedMax)
        return;
    
    while (idx <= _seedMax)
    {
        f++;
        
        long v = value * g(prime, f);
        seed_add(idx, v);
        
        for(int pj = pi+1; pj < PRIME_ARRAY_SIZE; pj++)
        {
            long p = _primes[pj];
            long i = idx*p;
            if (i > _seedMax)
                break;
            seed_inner(pj, 1, v, i);
        }
        
        idx *= prime;
    }
    
    // use other primes
    for(int pj = pi+1; pj < PRIME_ARRAY_SIZE; pj++)
    {
        // only primes not already used
        long p = _primes[pj];
        idx = index*p;
        if (idx > _seedMax)
            break;
        seed_inner(pj, 1, newValue, idx);
    }
}

static long seed(long max)
{
    if (_cache == NULL)
    {
        long size = (MAX - _maxPrime)/8; // Try to use less memory
        
        _cache = calloc(size+1, 1); // +1 to avoid errors
        if (_cache == NULL)
            return -1;
    }

    _seedMax   = max;
    _seedTotal = 1;
    
    for(int pi = 0; pi < PRIME_ARRAY_SIZE; pi++)
    {
        seed_inner(pi, 1, 1, _primes[pi]);
    }
    
    for(long i = _maxPrime; i <= max; i++)
    {
        if (! getCache(i))
        {
            // Some verification
            if ((i & 1) == 0) // even !!!!
                return -1;
            
            long v = g(i, 1);
            
            seed_add(i, v);
            
            for(int pi = 0; pi < PRIME_ARRAY_SIZE; pi++)
            {
                long idx = i * _primes[pi];
                if (idx > max)
                    break;
                
                seed_inner(pi, 1, v, idx);
            }
        }
    }
    
    return _seedTotal;
}

void problem625(long input)
{
    generatePrimes();
    
    printf("Calculating %li\n", input);
    long result = seed(input);
    if (result >= 0)
        printf("\nResult is %li\n", result);
    else
        printf("\nFailed\n");
    
    // assert.equal(seed(1, 10), 122);
    // assert.equal(seed(1, 1000), 2475190);
    // assert.equal(seed(1, 10000), 317257140);
    // assert.equal(seed(1, 10000000), 825808541);
    // assert.equal(seed(1, 20000000), 974543073);
    // assert.equal(seed(1, 50000000), 954109446);
}

int main(int argc, const char * argv[])
{
   long input = 50000000;
   if (argc > 1)
   {
       input = atol(argv[1]);
   }
   
   problem625(input);
   return 0;
}

// ------------------------------------------------
//    1 to 4999999999; current Total = 335885638
//
// 5000000000 to 5999999999 = 178920722  -> 514806360 *
// 6000000000 to 6999999999 = 597747200  -> 114309207 *
// 7000000000 to 7999999999 = 4189793    -> 118499000 *
// 8000000000 to 8999999999 = 305574685  -> 424073685 *
// 9000000000 to 9999999999 = 912882500  -> 338711832 *
//
// 1 to 9999999999 -> 338711832
// 10000000000 -> 288516859
// 50000000000 -> 224950585
// ------------------------------------------------
// EXPECTED RESULT 551614306
