import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { MatrixDisplay } from './MatrixDisplay'
import { apiService } from '../services/api'
import { Loader2 } from 'lucide-react'
import type { CalculationHistory } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from './LoadingScreen'

export function History() {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user) {
          navigate('/')
          return
        }
        const data = await apiService.getHistory()
        setHistory(data)
      } catch (err) {
        console.error('History error:', err)
        setError('Failed to load calculation history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user, navigate])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Calculation History</h1>
        
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No calculations yet
            </CardContent>
          </Card>
        ) : (
          history.map((calc) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{calc.operation}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(calc.created_at).toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calc.matrices.map((matrix, idx) => (
                    <div key={idx}>
                      <h3 className="text-sm font-medium mb-2">
                        Matrix {String.fromCharCode(65 + idx)}:
                      </h3>
                      <MatrixDisplay matrix={matrix.data} />
                    </div>
                  ))}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Result:</h3>
                    <MatrixDisplay matrix={calc.result} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mode: {calc.mode}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}