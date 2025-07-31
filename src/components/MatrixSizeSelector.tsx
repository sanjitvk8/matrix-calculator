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

interface MatrixSizeSelectorProps {
  rows: number
  cols: number
  onRowsChange: (rows: number) => void
  onColsChange: (cols: number) => void
  matrixLabel?: string
}

const sizeOptions = [1, 2, 3, 4, 5, 6]

export function MatrixSizeSelector({
  rows,
  cols,
  onRowsChange,
  onColsChange,
  matrixLabel = "Matrix"
}: MatrixSizeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{matrixLabel} Size</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Rows</label>
            <Select value={rows.toString()} onValueChange={(value) => onRowsChange(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Columns</label>
            <Select value={cols.toString()} onValueChange={(value) => onColsChange(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}