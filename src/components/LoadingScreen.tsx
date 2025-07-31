import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <Calculator className="h-16 w-16 text-primary" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          animate={{ 
            opacity: [1, 0.5, 1],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          MatrixCalc+
        </motion.h1>
      </motion.div>
    </div>
  )
}