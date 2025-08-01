from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import numpy as np
import scipy.linalg
from sympy import Matrix, symbols, latex, simplify
import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import dotenv
import os 

dotenv.load_dotenv()

app = FastAPI(title="MatrixCalc+ API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://matrix-calculator-1-0cc7.onrender.com",
        "*"  # Allow all origins for now - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Supabase JWT validation (placeholder - replace with actual Supabase config)
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

class MatrixData(BaseModel):
    data: List[List[float]]
    rows: int
    cols: int

class CalculationRequest(BaseModel):
    operation: str
    matrices: List[MatrixData]
    mode: str  # 'learn' or 'calc'

class CalculationResponse(BaseModel):
    result: Any
    steps: Optional[List[str]] = None
    error: Optional[str] = None

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Supabase JWT token"""
    try:
        # In a real implementation, you would verify against Supabase
        # For now, we'll just check if a token exists
        token = credentials.credentials
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def numpy_to_python(obj):
    """Convert numpy types to Python native types"""
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, complex):
        return {"real": obj.real, "imag": obj.imag}
    return obj

class MatrixCalculator:
    @staticmethod
    def add_matrices(A: np.ndarray, B: np.ndarray, mode: str):
        """Matrix addition"""
        result = A + B
        steps = []
        
        if mode == 'learn':
            steps = [
                "Matrix addition is performed element-wise: C[i,j] = A[i,j] + B[i,j]",
                f"Matrix A dimensions: {A.shape}",
                f"Matrix B dimensions: {B.shape}",
                "Adding corresponding elements...",
                f"Result matrix C = A + B"
            ]
        
        return numpy_to_python(result), steps

    @staticmethod
    def subtract_matrices(A: np.ndarray, B: np.ndarray, mode: str):
        """Matrix subtraction"""
        result = A - B
        steps = []
        
        if mode == 'learn':
            steps = [
                "Matrix subtraction is performed element-wise: C[i,j] = A[i,j] - B[i,j]",
                f"Matrix A dimensions: {A.shape}",
                f"Matrix B dimensions: {B.shape}",
                "Subtracting corresponding elements...",
                f"Result matrix C = A - B"
            ]
        
        return numpy_to_python(result), steps

    @staticmethod
    def multiply_matrices(A: np.ndarray, B: np.ndarray, mode: str):
        """Matrix multiplication"""
        result = A @ B
        steps = []
        
        if mode == 'learn':
            steps = [
                "Matrix multiplication: C[i,j] = Σ(A[i,k] * B[k,j]) for all k",
                f"Matrix A dimensions: {A.shape}",
                f"Matrix B dimensions: {B.shape}",
                f"Result dimensions: {result.shape}",
                "Computing dot product of rows and columns...",
                f"Result matrix C = A × B"
            ]
        
        return numpy_to_python(result), steps

    @staticmethod
    def transpose_matrix(A: np.ndarray, mode: str):
        """Matrix transpose"""
        result = A.T
        steps = []
        
        if mode == 'learn':
            steps = [
                "Matrix transpose: A^T[i,j] = A[j,i]",
                f"Original matrix dimensions: {A.shape}",
                f"Transposed matrix dimensions: {result.shape}",
                "Swapping rows and columns...",
                f"Result matrix A^T"
            ]
        
        return numpy_to_python(result), steps

    @staticmethod
    def determinant(A: np.ndarray, mode: str):
        """Calculate determinant"""
        if A.shape[0] != A.shape[1]:
            raise ValueError("Determinant can only be calculated for square matrices")
        
        result = np.linalg.det(A)
        steps = []
        
        if mode == 'learn':
            n = A.shape[0]
            if n == 2:
                steps = [
                    f"For a 2×2 matrix: det(A) = a₁₁×a₂₂ - a₁₂×a₂₁",
                    f"det(A) = {A[0,0]}×{A[1,1]} - {A[0,1]}×{A[1,0]}",
                    f"det(A) = {A[0,0]*A[1,1]} - {A[0,1]*A[1,0]}",
                    f"det(A) = {result:.6f}"
                ]
            else:
                steps = [
                    f"Calculating determinant of {n}×{n} matrix using LU decomposition",
                    "Step 1: Perform LU factorization",
                    "Step 2: det(A) = det(L) × det(U)",
                    "Step 3: For triangular matrices, det = product of diagonal elements",
                    f"det(A) = {result:.6f}"
                ]
        
        return float(result), steps

    @staticmethod
    def inverse_matrix(A: np.ndarray, mode: str):
        """Calculate matrix inverse"""
        try:
            if A.shape[0] != A.shape[1]:
                raise ValueError("Inverse can only be calculated for square matrices")
            
            det = np.linalg.det(A)
            if abs(det) < 1e-10:
                raise ValueError("Matrix is singular (determinant ≈ 0), inverse does not exist")
            
            result = np.linalg.inv(A)
            steps = []
            
            if mode == 'learn':
                steps = [
                    "Matrix inverse using Gaussian elimination with augmented matrix [A|I]",
                    f"Matrix dimensions: {A.shape}",
                    f"Determinant: {det:.6f} (non-zero, so inverse exists)",
                    "Step 1: Create augmented matrix [A|I]",
                    "Step 2: Apply row operations to transform A to I",
                    "Step 3: The right side becomes A⁻¹",
                    "Gaussian elimination completed",
                    f"Verification: A × A⁻¹ should equal I"
                ]
            
            return numpy_to_python(result), steps
        except np.linalg.LinAlgError as e:
            raise ValueError("Matrix is not invertible")
        except Exception as e:
            raise ValueError(str(e))

    @staticmethod
    def eigenvalues(A: np.ndarray, mode: str):
        """Calculate eigenvalues"""
        if A.shape[0] != A.shape[1]:
            raise ValueError("Eigenvalues can only be calculated for square matrices")
        
        eigenvals = np.linalg.eigvals(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "Eigenvalues are solutions to: det(A - λI) = 0",
                f"Matrix dimensions: {A.shape}",
                "Step 1: Form characteristic polynomial det(A - λI)",
                "Step 2: Solve polynomial equation for λ",
                "Step 3: Each root λ is an eigenvalue",
                f"Found {len(eigenvals)} eigenvalues"
            ]
        
        # Convert complex eigenvalues to a serializable format
        result = []
        for val in eigenvals:
            if np.iscomplex(val):
                result.append({"real": float(val.real), "imag": float(val.imag)})
            else:
                result.append(float(val.real))
        
        return result, steps

    @staticmethod
    def eigenvectors(A: np.ndarray, mode: str):
        """Calculate eigenvalues and eigenvectors"""
        if A.shape[0] != A.shape[1]:
            raise ValueError("Eigenvectors can only be calculated for square matrices")
        
        eigenvals, eigenvecs = np.linalg.eig(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "Finding eigenvalues and eigenvectors",
                "Step 1: Solve det(A - λI) = 0 for eigenvalues λ",
                "Step 2: For each λ, solve (A - λI)v = 0 for eigenvector v",
                "Step 3: Normalize eigenvectors",
                f"Found {len(eigenvals)} eigenvalue-eigenvector pairs"
            ]
        
        # Format result
        result = {
            "eigenvalues": [numpy_to_python(val) for val in eigenvals],
            "eigenvectors": numpy_to_python(eigenvecs)
        }
        
        return result, steps

    @staticmethod
    def lu_decomposition(A: np.ndarray, mode: str):
        """LU decomposition"""
        P, L, U = scipy.linalg.lu(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "LU Decomposition: A = PLU",
                "Where P is permutation matrix, L is lower triangular, U is upper triangular",
                "Step 1: Apply partial pivoting to choose P",
                "Step 2: Gaussian elimination to find L and U",
                "Step 3: PA = LU, so A = P⁻¹LU",
                "Decomposition completed"
            ]
        
        result = {
            "P": numpy_to_python(P),
            "L": numpy_to_python(L),
            "U": numpy_to_python(U)
        }
        
        return result, steps

    @staticmethod
    def qr_decomposition(A: np.ndarray, mode: str):
        """QR decomposition"""
        Q, R = np.linalg.qr(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "QR Decomposition: A = QR",
                "Where Q is orthogonal matrix, R is upper triangular",
                "Step 1: Apply Gram-Schmidt process to columns of A",
                "Step 2: Normalize to get orthonormal columns (Q)",
                "Step 3: Calculate R = Q^T × A",
                "Decomposition completed"
            ]
        
        result = {
            "Q": numpy_to_python(Q),
            "R": numpy_to_python(R)
        }
        
        return result, steps

    @staticmethod
    def svd_decomposition(A: np.ndarray, mode: str):
        """Singular Value Decomposition"""
        U, s, Vt = np.linalg.svd(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "Singular Value Decomposition: A = UΣV^T",
                "Where U and V are orthogonal, Σ is diagonal with singular values",
                "Step 1: Compute eigenvalues of A^T×A for singular values",
                "Step 2: Find corresponding eigenvectors for V",
                "Step 3: Calculate U = A×V×Σ⁻¹",
                "SVD completed"
            ]
        
        result = {
            "U": numpy_to_python(U),
            "singular_values": numpy_to_python(s),
            "Vt": numpy_to_python(Vt)
        }
        
        return result, steps

    @staticmethod
    def matrix_rank(A: np.ndarray, mode: str):
        """Calculate matrix rank"""
        rank = np.linalg.matrix_rank(A)
        steps = []
        
        if mode == 'learn':
            steps = [
                "Matrix rank is the dimension of vector space spanned by columns",
                "Step 1: Perform row reduction to row echelon form",
                "Step 2: Count number of non-zero rows",
                "Step 3: This count is the rank",
                f"Matrix rank = {rank}"
            ]
        
        return int(rank), steps

    @staticmethod
    def matrix_exponential(A: np.ndarray, mode: str):
        """Calculate matrix exponential"""
        try:
            from scipy.linalg import expm
            if A.shape[0] != A.shape[1]:
                raise ValueError("Matrix exponential requires a square matrix")
            result = expm(A.astype(np.float64))
            steps = []
            if mode == 'learn':
                steps = [
                    "Matrix exponential e^A is calculated using the formula:",
                    "e^A = I + A + (A²/2!) + (A³/3!) + ...",
                    f"Input matrix dimensions: {A.shape}",
                    "Step 1: Calculate series expansion terms",
                    "Step 2: Sum the series until convergence",
                    f"Final result rounded to 4 decimal places"
                ]
            formatted_result = np.round(result, decimals=4)
            return numpy_to_python(formatted_result), steps
        except Exception as e:
            raise ValueError(f"Error calculating matrix exponential: {str(e)}")

    @staticmethod
    def null_space(A: np.ndarray, mode: str):
        """Calculate null space basis vectors"""
        try:
            from scipy.linalg import null_space
            ns = null_space(A.astype(np.float64))
            if ns.size == 0:
                ns = np.zeros((A.shape[1], 1))
            steps = []
            if mode == 'learn':
                steps = [
                    "Null space contains all vectors x where Ax = 0",
                    f"Input matrix dimensions: {A.shape}",
                    "Step 1: Compute SVD decomposition A = UΣV^T",
                    "Step 2: Find singular values close to zero",
                    "Step 3: Extract corresponding right singular vectors",
                    f"Step 4: Normalize basis vectors",
                    f"Found {ns.shape[1]} basis vectors"
                ]
            ns = np.round(ns, decimals=6)
            return numpy_to_python(ns), steps
        except Exception as e:
            raise ValueError(f"Error calculating null space: {str(e)}")

calculator = MatrixCalculator()

@app.post("/basic", response_model=CalculationResponse)
async def calculate_basic(request: CalculationRequest):
    """Handle basic matrix operations (no authentication required)"""
    try:
        operation = request.operation
        matrices = request.matrices
        mode = request.mode
        
        # Convert to numpy arrays
        A = np.array(matrices[0].data)
        B = np.array(matrices[1].data) if len(matrices) > 1 else None
        
        if operation == "add":
            if B is None:
                raise ValueError("Addition requires two matrices")
            result, steps = calculator.add_matrices(A, B, mode)
        elif operation == "subtract":
            if B is None:
                raise ValueError("Subtraction requires two matrices")
            result, steps = calculator.subtract_matrices(A, B, mode)
        elif operation == "multiply":
            if B is None:
                raise ValueError("Multiplication requires two matrices")
            result, steps = calculator.multiply_matrices(A, B, mode)
        elif operation == "transpose":
            result, steps = calculator.transpose_matrix(A, mode)
        elif operation == "determinant":
            result, steps = calculator.determinant(A, mode)
        elif operation == "inverse":
            result, steps = calculator.inverse_matrix(A, mode)
        else:
            raise ValueError(f"Unknown basic operation: {operation}")
        
        return CalculationResponse(result=result, steps=steps)
    
    except Exception as e:
        return CalculationResponse(error=str(e))

@app.post("/advanced", response_model=CalculationResponse)
async def calculate_advanced(request: CalculationRequest, token: str = Depends(verify_token)):
    try:
        operation = request.operation
        matrices = request.matrices
        mode = request.mode
        
        # Convert to numpy arrays
        A = np.array(matrices[0].data)
        
        if operation == "eigenvalues":
            result, steps = calculator.eigenvalues(A, mode)
        elif operation == "eigenvectors":
            result, steps = calculator.eigenvectors(A, mode)
        elif operation == "lu_decomposition":
            result, steps = calculator.lu_decomposition(A, mode)
        elif operation == "qr_decomposition":
            result, steps = calculator.qr_decomposition(A, mode)
        elif operation == "svd_decomposition":
            result, steps = calculator.svd_decomposition(A, mode)
        elif operation == "rank":
            result, steps = calculator.matrix_rank(A, mode)
        elif operation == "matrix_exponential":
            result, steps = calculator.matrix_exponential(A, mode)
        elif operation == "null_space":
            result, steps = calculator.null_space(A, mode)
        else:
            raise ValueError(f"Unknown advanced operation: {operation}")
        
        return CalculationResponse(result=result, steps=steps)
    
    except Exception as e:
        return CalculationResponse(error=str(e))

@app.get("/")
async def root():
    return {"message": "MatrixCalc+ API is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/history")
async def get_history(token: str = Depends(verify_token)):
    try:
        # Get user claims from token
        claims = decode_token(token)
        user_id = claims.get('sub')
        
        # Fetch user's calculations from Supabase
        async with supabase.client as client:
            response = await client.from_('calculations') \
                .select('*') \
                .eq('user_id', user_id) \
                .order('created_at', desc=True) \
                .execute()
            
            if response.error:
                raise HTTPException(
                    status_code=400,
                    detail=str(response.error)
                )
                
            return response.data
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching history: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)