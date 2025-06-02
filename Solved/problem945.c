#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <pthread.h>

#define ULONG unsigned long

const ULONG MAX = 1e7;
const int THREADS = 20;

static ULONG memoize[THREADS][MAX + 1]; // Reuse buffer
static ULONG SQUARE_MASK = 0;

static pthread_t threads[THREADS];
static ULONG threadResult[THREADS];
static ULONG threadArgs[THREADS];

static int threadIndex = 0;
static int threadCount = 0;

void prepareSquareMask()
{
  ULONG max = 2e15 + 1;
  ULONG mask1 = 1;
  while (mask1 < max)
  {
    mask1 <<= 2;
    mask1 |= 1;
  }

  SQUARE_MASK = mask1;
}

static time_t seconds = 0;

void trace(ULONG value)
{
  time_t now = time(NULL);

  if (now > seconds)
  {
    fprintf(stdout, "\r %lu  \r", value);
    fflush(stdout);
    seconds = now + 2;
  }
}

void traceClear()
{
  fprintf(stdout, "\r          \r");
  fflush(stdout);
  seconds = 0;
}

typedef struct
{
  ULONG p0;
  ULONG p1;
  ULONG n;
  ULONG count;
} Part1State;

void nextPart1(Part1State *state)
{
  state->n++;
  state->p0 = state->p1;
  state->p1 = 1 << (2 * state->n + 3);
  state->count = ((1 << state->n) - 1) * 2;
}

ULONG getPart1Count(Part1State *state, ULONG b)
{
  if (b < state->p0)
  {
    return 0;
  }
  else if (b < state->p1)
  {
    return state->count;
  }
  else
  {
    nextPart1(state);
    return state->count;
  }
}

ULONG solvePart1(ULONG max)
{
  ULONG total = 0;

  Part1State state;

  state.p0 = 8;
  state.p1 = 32;
  state.n = 1;
  state.count = 2;

  static ULONG values[MAX + 1];

  for (ULONG n = 1;; n++)
  {
    ULONG b = n & 1 ? 4 * values[(n - 1) / 2] + 2 : 4 * values[n / 2];

    if (b > max)
    {
      break;
    }

    values[n] = b;

    trace(max - b);

    ULONG _2b = 2 * b;

    int exists = (_2b & SQUARE_MASK) == _2b;
    if (exists)
    {
      ULONG count = 1 + getPart1Count(&state, b);
      total += count;
    }
  }

  traceClear();

  return total;
}

typedef struct
{
  ULONG n;
  ULONG a;
} Part2State;

ULONG nextPart2(Part2State *state)
{
  state->n++;
  state->a = state->a | state->n;
  return state->a;
}

ULONG processB(ULONG b, int idx)
{
  ULONG _2b = b * 2;
  memoize[idx][1] = _2b;

  ULONG total = 0;
  for (ULONG a = 2; a < b - 1; a += 2)
  {
    ULONG _2ba0 = 2 * memoize[idx][a / 2];
    ULONG _2ba1 = _2b ^ _2ba0;

    memoize[idx][a] = _2ba0;
    memoize[idx][a + 1] = _2ba1;

    if ((_2ba0 & SQUARE_MASK) == _2ba0)
    {
      total++;
    }
    else if ((_2ba1 & SQUARE_MASK) == _2ba1)
    {
      total++;
    }
  }
  return total;
}

void *processBs(void *args)
{
  ULONG b = *((ULONG *)args);
  int idx = b % THREADS;
  b = (b - idx) / THREADS;

  ULONG t2 = processB(b - 1, idx);
  ULONG t1 = processB(b, idx);

  threadResult[idx] += t1 + t2;

  return NULL;
}

void createThread(ULONG b)
{
  if (threadCount == THREADS)
  {
    pthread_join(threads[threadIndex], NULL);
    threadCount--;
  }

  threadArgs[threadIndex] = b * THREADS + threadIndex;
  pthread_create(&(threads[threadIndex]), NULL, processBs, &(threadArgs[threadIndex]));
  threadIndex = (threadIndex + 1) % THREADS;
  threadCount++;
}

ULONG flushThreads()
{
  ULONG total = 0;
  while (threadCount)
  {
    threadCount--;
    threadIndex = (threadIndex + THREADS - 1) % THREADS;
    pthread_join(threads[threadIndex], NULL);
  }
  for (int idx = 0; idx < THREADS; idx++)
  {
    total += threadResult[idx];
  }
  return total;
}

ULONG solvePart2(ULONG max)
{
  ULONG total = 0;

  Part2State state;

  state.a = 0;
  state.n = 0;

  for (ULONG b = max - 1; b >= 3; b -= 2)
  {
    trace(b);

    ULONG _2b = 2 * b;

    int exists = (_2b & SQUARE_MASK) == (_2b - 2);
    if (exists)
    {
      continue;
    }

    if ((b & SQUARE_MASK) == b)
    {
      ULONG c = 2 * nextPart2(&state);
      total += c;
    }
    else
    {
      createThread(b);
    }
  }

  total += flushThreads();

  if (max > 10)
  {
    total += processB(max, 0);
  }

  traceClear();

  return total;
}

int solve(ULONG max)
{
  threadCount = 0;
  threadIndex = 0;
  for (int i = 0; i < THREADS; i++)
  {
    threadResult[i] = 0;
    threadArgs[i] = 0;
  }
  return max + 1 + solvePart1(max) + solvePart2(max);
}

void assert(ULONG value, ULONG expected)
{
  if (value != expected)
  {
    printf("Got %lu instead of %lu\n", value, expected);
    exit(-1);
  }
}

int main()
{
  prepareSquareMask();

  assert(solve(10), 21);
  assert(solve(100), 282);
  assert(solve(10000), 49935);
  time_t start = time(NULL);
  assert(solve(100000), 613501);
  time_t end = time(NULL);
  fprintf(stdout, "%ld seconds for 1e5\n", end - start);

  fprintf(stdout, "Tests passed\n");

  start = time(NULL);
  ULONG answer = solve(MAX);
  end = time(NULL);

  fprintf(stdout, "Answer is %lu in %ld seconds\n", answer, end - start);

  return 0;
}