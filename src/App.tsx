import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import { MatrixInput } from '@/components/MatrixInput'
import { MatrixSizeSelector } from '@/components/MatrixSizeSelector'
import { OperationSelector } from '@/components/OperationSelector'
import { ResultDisplay } from '@/components/ResultDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { apiService } from '@/services/api'
import { Loader2, Play, BookOpen, Calculator as CalcIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { History } from '@/components/History'
import { LoadingScreen } from '@/components/LoadingScreen'

function App() {
  const { user, loading: authLoading } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)
  const [mode, setMode] = useState<'learn' | 'calc'>('calc')
  const [operation, setOperation] = useState('')
  const [matrixARows, setMatrixARows] = useState(3)
  const [matrixACols, setMatrixACols] = useState(3)
  const [matrixBRows, setMatrixBRows] = useState(3)
  const [matrixBCols, setMatrixBCols] = useState(3)
  const [matrixA, setMatrixA] = useState<number[][]>([])
  const [matrixB, setMatrixB] = useState<number[][]>([])
  const [result, setResult] = useState<any>(null)
  const [steps, setSteps] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Initialize matrices when dimensions change
  useEffect(() => {
    const newMatrixA = Array(matrixARows).fill(0).map(() => Array(matrixACols).fill(0))
    setMatrixA(newMatrixA)
  }, [matrixARows, matrixACols])

  useEffect(() => {
    const newMatrixB = Array(matrixBRows).fill(0).map(() => Array(matrixBCols).fill(0))
    setMatrixB(newMatrixB)
  }, [matrixBRows, matrixBCols])

  const needsTwoMatrices = ['add', 'subtract', 'multiply'].includes(operation)
  const isAdvancedOperation = [
    'eigenvalues', 'eigenvectors', 'lu_decomposition', 
    'qr_decomposition', 'svd_decomposition', 'matrix_exponential', 
    'rank', 'null_space'
  ].includes(operation)

  const canCalculate = operation && matrixA.length > 0 && (!needsTwoMatrices || matrixB.length > 0)

  const handleCalculate = async () => {
    if (!canCalculate) return

    setLoading(true)
    setResult(null)
    setSteps([])

    try {
      const request = {
        operation,
        matrices: needsTwoMatrices ? [
          { data: matrixA, rows: matrixARows, cols: matrixACols },
          { data: matrixB, rows: matrixBRows, cols: matrixBCols }
        ] : [
          { data: matrixA, rows: matrixARows, cols: matrixACols }
        ],
        mode
      }

      const response = isAdvancedOperation 
        ? await apiService.calculateAdvanced(request)
        : await apiService.calculateBasic(request)

      if (response.error) {
        toast.error(response.error)
      } else {
        setResult(response.result)
        if (response.steps) {
          setSteps(response.steps)
        }
        toast.success('Calculation completed!')

        // Save to history if user is logged in
        if (user && isAdvancedOperation) {
          await apiService.saveCalculation({
            operation,
            matrices: request.matrices,
            result: response.result,
            mode
          })
        }
      }
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Calculation failed. Please check your input and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Simulate minimum loading time for smooth transitions
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Show loading screen while auth is loading or during initial page load
  if (authLoading || pageLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <main className="container mx-auto px-4 py-8">
              <motion.div
                className="max-w-7xl mx-auto space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Mode Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalcIcon className="h-5 w-5" />
                      Calculation Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CalcIcon className="h-4 w-4" />
                        <span className={mode === 'calc' ? 'font-medium' : 'text-muted-foreground'}>
                          Direct Result
                        </span>
                      </div>
                      <Switch
                        checked={mode === 'learn'}
                        onCheckedChange={(checked) => setMode(checked ? 'learn' : 'calc')}
                      />
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span className={mode === 'learn' ? 'font-medium' : 'text-muted-foreground'}>
                          Step-by-Step
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Controls */}
                  <div className="space-y-6">
                    <OperationSelector
                      operation={operation}
                      onChange={setOperation}
                      isAuthenticated={!!user}
                    />
                    
                    {operation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          onClick={handleCalculate}
                          disabled={!canCalculate || loading}
                          className="w-full"
                          size="lg"
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="mr-2 h-4 w-4" />
                          )}
                          Calculate
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  {/* Middle Column - Matrix Inputs */}
                  <div className="space-y-6">
                    <MatrixSizeSelector
                      rows={matrixARows}
                      cols={matrixACols}
                      onRowsChange={setMatrixARows}
                      onColsChange={setMatrixACols}
                      matrixLabel="Matrix A"
                    />
                    
                    <MatrixInput
                      matrix={matrixA}
                      rows={matrixARows}
                      cols={matrixACols}
                      onChange={setMatrixA}
                      label="Matrix A"
                    />

                    {needsTwoMatrices && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <MatrixSizeSelector
                          rows={matrixBRows}
                          cols={matrixBCols}
                          onRowsChange={setMatrixBRows}
                          onColsChange={setMatrixBCols}
                          matrixLabel="Matrix B"
                        />
                        
                        <MatrixInput
                          matrix={matrixB}
                          rows={matrixBRows}
                          cols={matrixBCols}
                          onChange={setMatrixB}
                          label="Matrix B"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column - Results */}
                  <div>
                    {result && (
                      <ResultDisplay
                        result={result}
                        steps={steps}
                        mode={mode}
                        operation={operation}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </main>
          } />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </Router>
  )
}

export default App