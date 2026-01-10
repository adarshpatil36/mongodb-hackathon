import { useState, FormEvent, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { UserCircle, Mail, Key } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from './Button'
import { ArrowRight } from './Icons'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name is required to continue')
      return false
    }

    if (!formData.email.trim()) {
      toast.error('Email address is required')
      return false
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (!formData.password.trim()) {
      toast.error('Password cannot be empty')
      return false
    }

    if (formData.password.length < 3) {
      toast.error('Password must be at least 3 characters')
      return false
    }

    return true
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      login(formData.name, formData.email)
      toast.success(`Welcome back, ${formData.name}!`)
      navigate('/')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Branding Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-center mb-10"
        >
          <h1 
            className="text-4xl md:text-5xl font-medium text-center mb-6 tracking-tight"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Access Your Account
          </h1>
          <p className="text-sm md:text-base text-white/60">
            An assistance to doctors in managing patient symptoms
          </p>
        </motion.div>

        {/* Authentication Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-gray-800/50"
        >
          <form onSubmit={submitForm} className="space-y-6">
            {/* Name Input Field */}
            <div className="space-y-2">
              <label 
                htmlFor="userName" 
                className="block text-sm font-semibold text-white/90 tracking-wide"
              >
                Your Full Name
              </label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  id="userName"
                  type="text"
                  value={formData.name}
                  onChange={updateField('name')}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Email Input Field */}
            <div className="space-y-2">
              <label 
                htmlFor="userEmail" 
                className="block text-sm font-semibold text-white/90 tracking-wide"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  id="userEmail"
                  type="email"
                  value={formData.email}
                  onChange={updateField('email')}
                  placeholder="john.doe@example.com"
                  disabled={isSubmitting}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label 
                htmlFor="userPassword" 
                className="block text-sm font-semibold text-white/90 tracking-wide"
              >
                Password
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  id="userPassword"
                  type="password"
                  value={formData.password}
                  onChange={updateField('password')}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="gradient"
              size="lg"
              className="w-full rounded-lg flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Processing...' : 'Continue to Dashboard'}</span>
              {!isSubmitting && (
                <ArrowRight size={16} />
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Development preview mode - authentication bypassed
            </p>
          </div>
        </motion.div>

        {/* Copyright Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500 font-medium">
            © 2024 Tether. Protected by copyright.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
