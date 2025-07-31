import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface MatrixDisplayProps {
  matrix: number[][]
  label?: string
  className?: string
}

export function MatrixDisplay({ matrix, label, className }: MatrixDisplayProps) {
  if (!matrix || matrix.length === 0) return null

  const rows = matrix.length
  const cols = matrix[0].length

  return (
    <Card className={`p-4 ${className}`}>
      {label && (
        <h3 className="text-lg font-semibold mb-3 text-center">{label}</h3>
      )}
      <motion.div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {matrix.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className="bg-muted rounded p-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (rowIndex * cols + colIndex) * 0.05 }}
            >
              <span className="text-lg font-mono">
                {typeof value === 'number' ? value.toFixed(3) : value}
              </span>
            </motion.div>
          ))
        )}
      </motion.div>
    </Card>
  )
}