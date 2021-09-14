import math
from sys import stdout
from time import time
from typing import Callable

MODULO = 10 ** 9
MAX = 10 ** 16
MAX_SAFE_INTEGER = 2**53 - 1

class Tracer:
    def __init__(self, prefix: str, enabled: bool) -> None:
        self.enabled = enabled
        self.lastPrinted = time()-1
        self.lastValue = ''
        self.prefix = prefix

    def print(self, callback: Callable[[], str]) -> None:
        if not self.enabled:
            return
        value = f'{callback()}'
        if value == self.lastValue:
            return
        now = time()
        if now-self.lastPrinted < 1:
            return
        stdout.write(f'\r{self.prefix}: {value.rjust(len(self.lastValue))} ')
        self.lastPrinted = now
        self.lastValue = value

    def clear(self):
        spaces = ''
        stdout.write(f'\r{spaces.rjust(len(self.prefix) + 4 + len(self.lastValue))}\r')

def sqrt(n):
    r = int(math.sqrt(n))+1
    while r*r <= n:
        r += 1
    return r-1
    
def getEvenSquares(max):
    i = 2
    while True:
        s = i*i
        if i > max:
            return

        yield s
        i += 2

def getSpecialValues(max):
    i = 1
    while True:
        value = 8 * i * (i - 1) + 2
        if value > max:
            return
        yield value
        i += 1

def add(total, x, y, z):
    if math.gcd(math.gcd(x, y), z) == 1:
            return (total + x + y + z) % MODULO
    return total
        
def S(max, trace = False):
    total = 0

    maxN = sqrt(max // 2)
    squares = [ s for s in getEvenSquares(sqrt(max)) ]
    specialValues = [ s for s in getSpecialValues(sqrt(max)) ]

    # special with squares

    tracer = Tracer('m is square', trace)
    offset = 0
    for i, n in enumerate(specialValues):
        if n > maxN:
            break

        tracer.print(lambda: maxN-n)

        n2 = n*n
        maxM = sqrt(max - n2)

        for j in range(i+offset, len(squares)):
            m = squares[j]
            if m > maxM:
                break

            if m < n:
                offset += 1 
                continue

            m2 = m*m

            a = m2 - n2
            b = 2 * m * n
            c = n2 + m2
            total = add(total, a // 4, sqrt(b), c)

    tracer.clear()

    # n are squares

    tracer = Tracer('n is square', trace)
    offset = 0
    for i, n in enumerate(squares):
        if n > maxN: 
            break

        tracer.print(lambda: maxN-n)

        n2 = n*n
        maxM = sqrt(max - n2)

        for j in range(offset, len(specialValues)):
            m = specialValues[j]
            if m > maxM:
                break

            if m < n:
                offset += 1
                continue

            m2 = m*m
    
            a = m2 - n2
            b = 2 * m * n
            c = n2 + m2

            if a % 4 == 0:
                total = add(total, a // 4, sqrt(b), c)

    tracer.clear()

    # n multiple of 4 and n+m is square

    tracer = Tracer('n+m is square', trace)

    for n in range(4, maxN+1, 4):

        tracer.print(lambda: maxN-n)

        n2 = n*n
        maxM = sqrt(max - n2)

        for q in range(sqrt(n)+1, maxM+1):
            q2 = q*q
            m = q2 - n
            if m > maxM:
                break

            if m < n: 
                continue

            m2 = m*m

            a = m2 - n2
            b = 2 * m * n
            c = n2 + m2

            aa = sqrt(a)
            if aa*aa == a:
                total = add(total, b // 4, aa, c)

    tracer.clear()

    return total

start = time()
assert S(100) == 81
assert S(10000) == 112851
assert S(1E7) == 248876211
assert S(1E8) == 42501751
assert S(1E9) == 258133745
assert S(1E12) == 397047378
assert S(1E13, True) == 769855408
end = time()

print(F"Tests executed in { math.floor( (end-start) * 1000 ) / 1000 } seconds")

start = time()
answer = S(MAX, True)
end = time()

print(F"Asnwer is {answer} executed in { math.floor( (end-start )* 1000 ) / 1000 } seconds")