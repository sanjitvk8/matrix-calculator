import React, { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface MatrixInputProps {
  matrix: number[][]
  rows: number
  cols: number
  onChange: (matrix: number[][]) => void
  label?: string
}

export function MatrixInput({ matrix, rows, cols, onChange, label }: MatrixInputProps) {
  const handleInputChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[row] = [...newMatrix[row]]
    newMatrix[row][col] = parseFloat(value) || 0
    onChange(newMatrix)
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    currentRow: number,
    currentCol: number
  ) => {
    const target = e.target as HTMLInputElement

    switch (e.key) {
      case 'ArrowUp':
        if (currentRow > 0) {
          const prevInput = document.querySelector(
            `input[data-position="${currentRow - 1}-${currentCol}"]`
          ) as HTMLInputElement
          prevInput?.focus()
        }
        break

      case 'ArrowDown':
        if (currentRow < rows - 1) {
          const nextInput = document.querySelector(
            `input[data-position="${currentRow + 1}-${currentCol}"]`
          ) as HTMLInputElement
          nextInput?.focus()
        }
        break

      case 'ArrowLeft':
        if (currentCol > 0) {
          const leftInput = document.querySelector(
            `input[data-position="${currentRow}-${currentCol - 1}"]`
          ) as HTMLInputElement
          leftInput?.focus()
        }
        break

      case 'ArrowRight':
      case 'Tab':
        if (currentCol < cols - 1) {
          e.preventDefault()
          const rightInput = document.querySelector(
            `input[data-position="${currentRow}-${currentCol + 1}"]`
          ) as HTMLInputElement
          rightInput?.focus()
        } else if (currentRow < rows - 1) {
          // Move to first column of next row
          e.preventDefault()
          const nextRowInput = document.querySelector(
            `input[data-position="${currentRow + 1}-0"]`
          ) as HTMLInputElement
          nextRowInput?.focus()
        }
        break

      case 'Enter':
        if (currentRow < rows - 1) {
          const nextRowInput = document.querySelector(
            `input[data-position="${currentRow + 1}-${currentCol}"]`
          ) as HTMLInputElement
          nextRowInput?.focus()
        }
        break
    }
  }

  return (
    <Card className="p-4">
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
        {Array.from({ length: rows }, (_, rowIndex) =>
          Array.from({ length: cols }, (_, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (rowIndex * cols + colIndex) * 0.05 }}
            >
              <Input
                type="number"
                step="any"
                value={matrix[rowIndex]?.[colIndex] || 0}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                className="text-center h-12 text-lg"
                placeholder="0"
                data-position={`${rowIndex}-${colIndex}`}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </Card>
  )
}