import { useState, FormEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Plus, 
  X, 
  FileText,
  User,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { patientApi } from '../services/api'
import { PatientRegistrationForm, Symptom } from '../types'
import Button from './Button'

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PatientRegistrationForm>({
    patient: {
      name: '',
      age: 0,
      gender: 'prefer_not_to_say',
      phone: '',
      email: '',
      address: '',
      medical_history: '',
    },
    symptoms: []
  })

  const [currentSymptom, setCurrentSymptom] = useState<Symptom>({
    description: '',
    onset_date: new Date().toISOString().split('T')[0],
    severity: 'mild',
    duration_days: 0,
    duration_hours: 0,
    related_symptoms: '',
    notes: ''
  })

  const updatePatientField = (field: keyof typeof formData.patient) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      patient: {
        ...prev.patient,
        [field]: field === 'age' ? parseInt(e.target.value) || 0 : e.target.value
      }
    }))
  }

  const updateSymptomField = (field: keyof Symptom) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === 'duration_days' || field === 'duration_hours' 
      ? parseInt(e.target.value) || 0 
      : e.target.value
    setCurrentSymptom(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSymptom = () => {
    if (!currentSymptom.description.trim()) {
      toast.error('Please enter a symptom description')
      return
    }
    
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, { ...currentSymptom }]
    }))
    
    setCurrentSymptom({
      description: '',
      onset_date: new Date().toISOString().split('T')[0],
      severity: 'mild',
      duration_days: 0,
      duration_hours: 0,
      related_symptoms: '',
      notes: ''
    })
    toast.success('Symptom added')
  }

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }))
    toast.success('Symptom removed')
  }

  const validateForm = (): boolean => {
    if (!formData.patient.name.trim()) {
      toast.error('Patient name is required')
      return false
    }

    if (formData.patient.age <= 0 || formData.patient.age > 150) {
      toast.error('Please enter a valid age')
      return false
    }

    if (formData.patient.email && !formData.patient.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (formData.symptoms.length === 0) {
      toast.error('Please add at least one symptom')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await patientApi.register(formData)
      toast.success(`Patient ${formData.patient.name} registered successfully!`)
      navigate('/')
    } catch (error: any) {
      console.error('Error registering patient:', error)
      toast.error(error.response?.data?.message || 'Failed to register patient. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.patient.name.trim() || formData.patient.age <= 0) {
        toast.error('Please fill in all required patient information')
        return
      }
    }
    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 
            className="text-4xl md:text-5xl font-medium mb-6"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Register Patient & Symptoms
          </h1>
          <p className="text-sm md:text-base text-white/60">
            Enter patient information and track their symptoms
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'border-white bg-white/10' : 'border-white/40'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Patient Info</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-white' : 'bg-white/40'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'border-white bg-white/10' : 'border-white/40'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Symptoms</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-800/50"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Patient Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-white/60" />
                    <h2 className="text-2xl font-semibold text-white">Patient Information</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={formData.patient.name}
                          onChange={updatePatientField('name')}
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="number"
                          value={formData.patient.age || ''}
                          onChange={updatePatientField('age')}
                          placeholder="25"
                          min="1"
                          max="150"
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Gender
                      </label>
                      <select
                        value={formData.patient.gender}
                        onChange={updatePatientField('gender')}
                        disabled={isSubmitting}
                        className="input-field"
                      >
                        <option value="prefer_not_to_say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="tel"
                          value={formData.patient.phone}
                          onChange={updatePatientField('phone')}
                          placeholder="+1 234 567 8900"
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="email"
                          value={formData.patient.email}
                          onChange={updatePatientField('email')}
                          placeholder="john.doe@example.com"
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Address
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <textarea
                          value={formData.patient.address}
                          onChange={updatePatientField('address')}
                          placeholder="123 Main St, City, State, ZIP"
                          rows={3}
                          disabled={isSubmitting}
                          className="input-field pl-12 resize-none"
                        />
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Medical History
                      </label>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <textarea
                          value={formData.patient.medical_history}
                          onChange={updatePatientField('medical_history')}
                          placeholder="Previous conditions, medications, allergies, etc."
                          rows={4}
                          disabled={isSubmitting}
                          className="input-field pl-12 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="gradient"
                      size="lg"
                      onClick={nextStep}
                      disabled={isSubmitting}
                    >
                      Next: Add Symptoms
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Symptoms */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-white/60" />
                    <h2 className="text-2xl font-semibold text-white">Symptoms Information</h2>
                  </div>

                  {/* Add Symptom Form */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Add New Symptom
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Symptom Description */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Symptom Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={currentSymptom.description}
                          onChange={updateSymptomField('description')}
                          placeholder="Describe the symptom in detail..."
                          rows={3}
                          required
                          disabled={isSubmitting}
                          className="input-field resize-none"
                        />
                      </div>

                      {/* Onset Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Onset Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={currentSymptom.onset_date}
                          onChange={updateSymptomField('onset_date')}
                          required
                          disabled={isSubmitting}
                          className="input-field"
                        />
                      </div>

                      {/* Severity */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Severity <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={currentSymptom.severity}
                          onChange={updateSymptomField('severity')}
                          required
                          disabled={isSubmitting}
                          className="input-field"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>

                      {/* Duration Days */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Duration (Days)
                        </label>
                        <input
                          type="number"
                          value={currentSymptom.duration_days || ''}
                          onChange={updateSymptomField('duration_days')}
                          placeholder="0"
                          min="0"
                          disabled={isSubmitting}
                          className="input-field"
                        />
                      </div>

                      {/* Duration Hours */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Duration (Hours)
                        </label>
                        <input
                          type="number"
                          value={currentSymptom.duration_hours || ''}
                          onChange={updateSymptomField('duration_hours')}
                          placeholder="0"
                          min="0"
                          max="23"
                          disabled={isSubmitting}
                          className="input-field"
                        />
                      </div>

                      {/* Related Symptoms */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Related Symptoms
                        </label>
                        <textarea
                          value={currentSymptom.related_symptoms}
                          onChange={updateSymptomField('related_symptoms')}
                          placeholder="Any other symptoms that occur together..."
                          rows={2}
                          disabled={isSubmitting}
                          className="input-field resize-none"
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Additional Notes
                        </label>
                        <textarea
                          value={currentSymptom.notes}
                          onChange={updateSymptomField('notes')}
                          placeholder="Any additional information about the symptom..."
                          rows={2}
                          disabled={isSubmitting}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="default"
                      onClick={addSymptom}
                      disabled={isSubmitting || !currentSymptom.description.trim()}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Symptom
                    </Button>
                  </div>

                  {/* Added Symptoms List */}
                  {formData.symptoms.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Added Symptoms ({formData.symptoms.length})
                      </h3>
                      <div className="space-y-3">
                        {formData.symptoms.map((symptom, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 flex items-start justify-between gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-semibold">{symptom.description}</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  symptom.severity === 'mild' ? 'bg-green-500/20 text-green-400' :
                                  symptom.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {symptom.severity}
                                </span>
                              </div>
                              <div className="text-sm text-white/60 space-y-1">
                                <p>Onset: {new Date(symptom.onset_date).toLocaleDateString()}</p>
                                {(symptom.duration_days || symptom.duration_hours) && (
                                  <p>Duration: {
                                    symptom.duration_days > 0 ? `${symptom.duration_days} day(s)` : ''
                                  } {
                                    symptom.duration_hours > 0 ? `${symptom.duration_hours} hour(s)` : ''
                                  }</p>
                                )}
                                {symptom.related_symptoms && (
                                  <p>Related: {symptom.related_symptoms}</p>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSymptom(index)}
                              disabled={isSubmitting}
                              className="p-2 text-white/60 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-gray-700/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={prevStep}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      disabled={isSubmitting || formData.symptoms.length === 0}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? 'Registering...' : 'Register Patient'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default PatientRegistration
