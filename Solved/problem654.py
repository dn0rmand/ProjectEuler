from sys import stdout
import numpy
from numpy.core.numeric import concatenate, isscalar, binary_repr, identity, asanyarray, dot
from numpy.core.numerictypes import issubdtype

# from numpy.linalg import matrix_power as matrixPower

MODULO = int(1000000007)
MAX_M  = int(1E12)
MAX_N  = int(5000)

def createMatrix(size):
    matrix = numpy.zeros((size, size), dtype=numpy.uint64)

    for i in range(0, size):
        for j in range(0, size):
            if i+j-size >= 0:
                matrix[i][j] = 1
    return matrix

def createVector(size):
    vector = numpy.ones((size, 1), dtype=numpy.uint64)
    return vector

def Strassen(X,Y):
    n = len(X)

    if n < 512 or (n & 1) != 0:
        return X.dot(Y)

    n2 = n//2

    A = X[0:n2, 0:n2]
    B = X[0:n2, n2:n]
    C = X[n2:n, 0:n2]
    D = X[n2:n, n2:n]
    E = Y[0:n2, 0:n2]
    F = Y[0:n2, n2:n]
    G = Y[n2:n, 0:n2]
    H = Y[n2:n, n2:n]

    P1 = Strassen(A  ,F-H)
    P2 = Strassen(A+B,H)
    P3 = Strassen(C+D,E)
    P4 = Strassen(D  ,G-E)
    P5 = Strassen(A+D,E+H)
    P6 = Strassen(B-D,G+H)
    P7 = Strassen(A-C,E+F)

    R = numpy.full((n,n), 1, dtype=object)

    R[0:n2, 0:n2] = P5 + P4 - P2 + P6
    R[0:n2, n2:n] = P1 + P2
    R[n2:n, 0:n2] = P3 + P4
    R[n2:n, n2:n] = P1 + P5 - P3 - P7

    return R

def matrixMod(m, modulo):
    return m; # % modulo

def multiply(A, B, modulo):
    return matrixMod(A @ B, modulo)

def matrixPower(M, n, mod_val, trace):
    # Implementation shadows numpy's matrix_power, but with modulo included and use of Strassen multiplication
    M = asanyarray(M)

    from numpy.linalg import inv

    if n==0:
        M = M.copy()
        M[:] = identity(M.shape[0])
        return M
    elif n<0:
        M = inv(M)
        n *= -1

    result = M % mod_val
    if n <= 3:
        for xxx in range(n-1):
            if trace:
                stderr.write('\r' + str(xxx) + ' ')
            result = multiply(result, M, mod_val)
        return result

    # binary decompositon to reduce the number of matrix
    # multiplications for n > 3
    beta = binary_repr(n)
    Z, q, t = M, 0, len(beta)
    while beta[t-q-1] == '0':
        if trace:
            stderr.write('\r' + str(t-q-1) + ' ')
        Z = multiply(Z, Z, mod_val)
        q += 1
    result = Z
    for k in range(q+1, t):
        if trace:
            stderr.write('\r' + str(t-k-1) + ' ')
        Z = multiply(Z, Z, mod_val)
        if beta[t-k-1] == '1':
            result = multiply(result, Z, mod_val)

    return result

def T(n, m, trace = False):
    matrix = createMatrix(n)
    vector = createVector(n)
    matrix = matrixPower(matrix, m, MODULO, trace)
    vector = matrix @ vector

    max = int(vector[n-1][0].max())
    max = max % MODULO
    if trace:
        print('')
    return max % MODULO


assert T(3,4) == 8
assert T(5,5) == 246
assert T(10, 100) == 862820094
assert T(100,10) == 782136797
assert T(50, MAX_M) == 737148354
print("Tests passed")

print('Asnwer is', T(MAX_N, MAX_M, True))