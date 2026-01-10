import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Stethoscope, Sparkles } from 'lucide-react'

const TestComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-black flex items-center justify-center p-8 animate-fadeIn"
    >
      <div className="card p-8 max-w-md text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50"
        >
          <Stethoscope className="w-8 h-8 text-white" />
        </motion.div>
        
        <h1 
          className="text-3xl font-medium mb-4"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}
        >
          Frontend is Working! 🎉
        </h1>
        
        <p className="text-white/60 mb-6">
          Your beautiful Tether frontend is now running successfully!
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>React 18</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TestComponent
