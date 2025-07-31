import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MatrixDisplay } from './MatrixDisplay';

interface ResultDisplayProps {
  result: any;
  steps?: string[];
  mode: 'learn' | 'calc';
  operation: string;
}

export function ResultDisplay({ result, steps, mode, operation }: ResultDisplayProps) {
  if (!result) return null;

  const renderAdvancedResult = () => {
    switch (operation) {
      case 'eigenvalues':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Eigenvalues:</h3>
            <MatrixDisplay
              matrix={[result.map((val: number | { real: number; imag: number }) => 
                typeof val === 'number' ? val : val.real + (val.imag !== 0 ? ` ${val.imag > 0 ? '+' : '-'} ${Math.abs(val.imag)}i` : '')
              )]}
            />
          </div>
        );

      case 'eigenvectors':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Eigenvalues:</h3>
              <MatrixDisplay 
                matrix={[result.eigenvalues.map((val: number | { real: number; imag: number }) => 
                  typeof val === 'number' ? val : val.real + (val.imag !== 0 ? ` ${val.imag > 0 ? '+' : '-'} ${Math.abs(val.imag)}i` : '')
                )]}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Eigenvectors:</h3>
              <MatrixDisplay matrix={result.eigenvectors} />
            </div>
          </div>
        );

      case 'lu_decomposition':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix P (Permutation):</h3>
              <MatrixDisplay matrix={result.P} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix L (Lower Triangular):</h3>
              <MatrixDisplay matrix={result.L} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix U (Upper Triangular):</h3>
              <MatrixDisplay matrix={result.U} />
            </div>
          </div>
        );

      case 'qr_decomposition':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix Q (Orthogonal):</h3>
              <MatrixDisplay matrix={result.Q} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix R (Upper Triangular):</h3>
              <MatrixDisplay matrix={result.R} />
            </div>
          </div>
        );

      case 'svd_decomposition':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix U:</h3>
              <MatrixDisplay matrix={result.U} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Singular Values (Σ):</h3>
              <MatrixDisplay 
                matrix={[result.singular_values.map((val: number) => Number(val.toFixed(4)))]} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Matrix V^T:</h3>
              <MatrixDisplay matrix={result.Vt} />
            </div>
          </div>
        );

      case 'matrix_exponential':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Matrix Exponential (e^A):</h3>
            <MatrixDisplay matrix={result} />
          </div>
        );

      case 'rank':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {result}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Matrix Rank
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'null_space':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Null Space Basis Vectors:</h3>
            <MatrixDisplay matrix={result} />
          </div>
        );

      default:
        return Array.isArray(result) ? (
          <MatrixDisplay matrix={result} />
        ) : null;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {renderAdvancedResult()}
        </CardContent>
      </Card>

      {mode === 'learn' && steps && steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}