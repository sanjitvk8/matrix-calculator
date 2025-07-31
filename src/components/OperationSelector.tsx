import React from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface OperationSelectorProps {
  operation: string
  onChange: (operation: string) => void
  isAuthenticated: boolean
}

const basicOperations = [
  { value: 'add', label: 'Addition (A + B)' },
  { value: 'subtract', label: 'Subtraction (A - B)' },
  { value: 'multiply', label: 'Multiplication (A × B)' },
  { value: 'transpose', label: 'Transpose (A^T)' },
  { value: 'determinant', label: 'Determinant (det A)' },
  { value: 'inverse', label: 'Inverse (A^-1)' },
]

const advancedOperations = [
  { value: 'eigenvalues', label: 'Eigenvalues' },
  { value: 'eigenvectors', label: 'Eigenvectors' },
  { value: 'lu_decomposition', label: 'LU Decomposition' },
  { value: 'qr_decomposition', label: 'QR Decomposition' },
  { value: 'svd_decomposition', label: 'SVD Decomposition' },
  { value: 'matrix_exponential', label: 'Matrix Exponential' },
  { value: 'rank', label: 'Matrix Rank' },
  { value: 'null_space', label: 'Null Space' },
]

export function OperationSelector({ operation, onChange, isAuthenticated }: OperationSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Operation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Basic Operations</h4>
          <Select value={operation} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an operation..." />
            </SelectTrigger>
            <SelectContent>
              {basicOperations.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
            Advanced Operations
            {!isAuthenticated && <Lock className="h-4 w-4" />}
          </h4>
          {isAuthenticated ? (
            <Select value={operation} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an advanced operation..." />
              </SelectTrigger>
              <SelectContent>
                {advancedOperations.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <motion.div
              className="p-3 border rounded-md bg-muted/50 text-muted-foreground text-sm"
              whileHover={{ scale: 1.02 }}
            >
              Sign in to access advanced matrix operations
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}