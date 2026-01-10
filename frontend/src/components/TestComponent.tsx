import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Stethoscope, Sparkles } from 'lucide-react'

const TestComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8"
    >
      <div className="card p-8 max-w-md text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-medical-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <Stethoscope className="w-8 h-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Frontend is Working! 🎉
        </h1>
        
        <p className="text-slate-600 mb-6">
          Your beautiful Doctor's Assistant frontend is now running successfully!
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>React 18</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TestComponent
