import { useState, FormEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Calendar, 
  Plus, 
  X, 
  FileText,
  User,
  Activity,
  Globe,
  Stethoscope,
  Pill,
  AlertTriangle,
  Heart,
  Users
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { patientApi } from '../services/api'
import { PatientRegistrationForm, EmergencyContact } from '../types'
import Button from './Button'

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
]

const surgeryTypes = [
  'Total Knee Arthroplasty',
  'Total Hip Arthroplasty',
  'Partial Knee Replacement',
  'Hip Resurfacing',
  'Knee Arthroscopy',
  'ACL Reconstruction',
  'Rotator Cuff Repair',
  'Spinal Fusion',
  'Laminectomy',
  'Carpal Tunnel Release',
  'Appendectomy',
  'Cholecystectomy',
  'Hernia Repair',
  'Cardiac Bypass',
  'Angioplasty',
  'Other'
]

const relationshipTypes = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Other'
]

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emergencyCountryCode, setEmergencyCountryCode] = useState('+1')
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('')
  
  const [formData, setFormData] = useState<PatientRegistrationForm>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    preferred_language: 'en',
    surgery_type: '',
    surgery_date: '',
    medications: [],
    allergies: [],
    conditions: [],
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    },
    notes: ''
  })

  // Temporary inputs for array fields
  const [newMedication, setNewMedication] = useState('')
  const [newAllergy, setNewAllergy] = useState('')
  const [newCondition, setNewCondition] = useState('')

  const updateField = (field: keyof PatientRegistrationForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const updateEmergencyContact = (field: keyof EmergencyContact) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      emergency_contact: {
        ...prev.emergency_contact,
        [field]: e.target.value
      }
    }))
  }

  // Array field handlers
  const addMedication = () => {
    if (!newMedication.trim()) return
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication.trim()]
    }))
    setNewMedication('')
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const addAllergy = () => {
    if (!newAllergy.trim()) return
    setFormData(prev => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy.trim()]
    }))
    setNewAllergy('')
  }

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (!newCondition.trim()) return
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition.trim()]
    }))
    setNewCondition('')
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const validateStep1 = (): boolean => {
    if (!formData.first_name.trim()) {
      toast.error('First name is required')
      return false
    }
    if (!formData.last_name.trim()) {
      toast.error('Last name is required')
      return false
    }
    if (!formData.date_of_birth) {
      toast.error('Date of birth is required')
      return false
    }
    if (!phoneNumber.trim()) {
      toast.error('Phone number is required')
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    if (!formData.surgery_type) {
      toast.error('Surgery type is required')
      return false
    }
    if (!formData.surgery_date) {
      toast.error('Surgery date is required')
      return false
    }
    return true
  }

  const validateStep3 = (): boolean => {
    if (!formData.emergency_contact.name.trim()) {
      toast.error('Emergency contact name is required')
      return false
    }
    if (!formData.emergency_contact.relationship) {
      toast.error('Emergency contact relationship is required')
      return false
    }
    if (!emergencyPhoneNumber.trim()) {
      toast.error('Emergency contact phone is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    if (!validateStep3()) return

    setIsSubmitting(true)
    
    // Update phone numbers with country codes
    const submissionData = {
      ...formData,
      phone: `${countryCode}${phoneNumber}`,
      emergency_contact: {
        ...formData.emergency_contact,
        phone: `${emergencyCountryCode}${emergencyPhoneNumber}`
      }
    }
    
    try {
      await patientApi.register(submissionData)
      toast.success(`Patient ${formData.first_name} ${formData.last_name} registered successfully!`)
      navigate('/')
    } catch (error: any) {
      console.error('Error registering patient:', error)
      toast.error(error.response?.data?.message || 'Failed to register patient. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const stepTitles = ['Patient Info', 'Medical Details', 'Emergency Contact']

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
            Patient Registration
          </h1>
          <p className="text-sm md:text-base text-white/60">
            Enter patient information for post-surgery care management
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {stepTitles.map((title, index) => (
              <div key={title} className="flex items-center">
                <div className={`flex items-center ${currentStep >= index + 1 ? 'text-white' : 'text-white/40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= index + 1 ? 'border-white bg-white/10' : 'border-white/40'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden md:block">{title}</span>
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-white' : 'bg-white/40'}`} />
                )}
              </div>
            ))}
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
                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={updateField('first_name')}
                          placeholder="John"
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={updateField('last_name')}
                          placeholder="Doe"
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={updateField('date_of_birth')}
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Preferred Language */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Preferred Language
                      </label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <select
                          value={formData.preferred_language}
                          onChange={updateField('preferred_language')}
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          disabled={isSubmitting}
                          className="input-field w-[120px] pr-2 appearance-none cursor-pointer"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="relative group flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="234 567 8900"
                            required
                            disabled={isSubmitting}
                            className="input-field pl-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={updateField('email')}
                          placeholder="john.doe@example.com"
                          disabled={isSubmitting}
                          className="input-field pl-12"
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
                      Next: Medical Details
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Medical Details */}
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
                    <h2 className="text-2xl font-semibold text-white">Medical Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Surgery Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Surgery Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <select
                          value={formData.surgery_type}
                          onChange={updateField('surgery_type')}
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        >
                          <option value="">Select surgery type</option>
                          {surgeryTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Surgery Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Surgery Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="date"
                          value={formData.surgery_date}
                          onChange={updateField('surgery_date')}
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        <Pill className="inline w-4 h-4 mr-2" />
                        Medications
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                          placeholder="Enter medication name"
                          disabled={isSubmitting}
                          className="input-field flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="default"
                          onClick={addMedication}
                          disabled={isSubmitting || !newMedication.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.medications.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.medications.map((med, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                            >
                              {med}
                              <button
                                type="button"
                                onClick={() => removeMedication(index)}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Allergies */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        <AlertTriangle className="inline w-4 h-4 mr-2" />
                        Allergies
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="Enter allergy"
                          disabled={isSubmitting}
                          className="input-field flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="default"
                          onClick={addAllergy}
                          disabled={isSubmitting || !newAllergy.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                            >
                              {allergy}
                              <button
                                type="button"
                                onClick={() => removeAllergy(index)}
                                className="hover:text-red-300 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Conditions */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        <Heart className="inline w-4 h-4 mr-2" />
                        Medical Conditions
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          placeholder="Enter medical condition"
                          disabled={isSubmitting}
                          className="input-field flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="default"
                          onClick={addCondition}
                          disabled={isSubmitting || !newCondition.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.conditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                            >
                              {condition}
                              <button
                                type="button"
                                onClick={() => removeCondition(index)}
                                className="hover:text-purple-300 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Additional Notes
                      </label>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <textarea
                          value={formData.notes}
                          onChange={updateField('notes')}
                          placeholder="Any additional notes about the patient..."
                          rows={4}
                          disabled={isSubmitting}
                          className="input-field pl-12 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
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
                      type="button"
                      variant="gradient"
                      size="lg"
                      onClick={nextStep}
                      disabled={isSubmitting}
                    >
                      Next: Emergency Contact
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Emergency Contact */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-white/60" />
                    <h2 className="text-2xl font-semibold text-white">Emergency Contact</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Emergency Contact Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={formData.emergency_contact.name}
                          onChange={updateEmergencyContact('name')}
                          placeholder="Jane Doe"
                          required
                          disabled={isSubmitting}
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    {/* Relationship */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.emergency_contact.relationship}
                        onChange={updateEmergencyContact('relationship')}
                        required
                        disabled={isSubmitting}
                        className="input-field"
                      >
                        <option value="">Select relationship</option>
                        {relationshipTypes.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Emergency Phone */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={emergencyCountryCode}
                          onChange={(e) => setEmergencyCountryCode(e.target.value)}
                          disabled={isSubmitting}
                          className="input-field w-[120px] pr-2 appearance-none cursor-pointer"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="relative group flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                          <input
                            type="tel"
                            value={emergencyPhoneNumber}
                            onChange={(e) => setEmergencyPhoneNumber(e.target.value)}
                            placeholder="234 567 8900"
                            required
                            disabled={isSubmitting}
                            className="input-field pl-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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
                      disabled={isSubmitting}
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
