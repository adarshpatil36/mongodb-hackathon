import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Stethoscope,
  CheckCircle,
  ArrowRight,
  Heart,
  Brain,
  Eye,
  Bone
} from 'lucide-react'
import { doctorApi, appointmentApi } from '../services/api'
import { Doctor, Appointment, BookingFormData } from '../types'
import toast from 'react-hot-toast'

interface AppointmentBookingProps {
  appointments: Appointment[]
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  setAppointments 
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    doctorName: '',
    patientName: '',
    patientPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const specialties = [
    { value: 'Cardiology', label: 'Cardiology', icon: Heart },
    { value: 'Orthopedics', label: 'Orthopedics', icon: Bone },
    { value: 'Dermatology', label: 'Dermatology', icon: Eye },
    { value: 'General Medicine', label: 'General Medicine', icon: Stethoscope },
    { value: 'Neurology', label: 'Neurology', icon: Brain },
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const data = await doctorApi.getAll()
        setDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        toast.error('Failed to load doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const getSpecialtyIcon = (specialty: string) => {
    const specialtyData = specialties.find(s => s.value === specialty)
    return specialtyData?.icon || Stethoscope
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData(prev => ({ ...prev, doctorName: doctor.name }))
    setBookingStep(2)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    setIsSubmitting(true)
    try {
      const appointment = await appointmentApi.book(formData)
      setAppointments(prev => [...prev, appointment])
      toast.success('Appointment booked successfully!')
      setBookingStep(3)
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetBooking = () => {
    setBookingStep(1)
    setSelectedDoctor(null)
    setFormData({
      doctorName: '',
      patientName: '',
      patientPhone: '',
      appointmentDate: '',
      appointmentTime: '',
      notes: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card p-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 bg-slate-200 rounded mb-8 w-2/3"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Book an Appointment</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Schedule your visit with our expert medical professionals
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  bookingStep >= step 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    bookingStep > step ? 'bg-primary-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-16 mt-4">
            <span className={`text-sm ${bookingStep >= 1 ? 'text-primary-600 font-medium' : 'text-slate-500'}`}>
              Select Doctor
            </span>
            <span className={`text-sm ${bookingStep >= 2 ? 'text-primary-600 font-medium' : 'text-slate-500'}`}>
              Book Appointment
            </span>
            <span className={`text-sm ${bookingStep >= 3 ? 'text-primary-600 font-medium' : 'text-slate-500'}`}>
              Confirmation
            </span>
          </div>
        </motion.div>

        {/* Step 1: Select Doctor */}
        {bookingStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Doctor</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {doctors.map((doctor, index) => {
                const Icon = getSpecialtyIcon(doctor.specialty)
                return (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="p-6 border border-slate-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                        <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                        <p className="text-slate-600 text-sm">{doctor.department}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Book Appointment */}
        {bookingStep === 2 && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Book with {selectedDoctor.name}</h2>
                <p className="text-slate-600">{selectedDoctor.specialty} • {selectedDoctor.department}</p>
              </div>
              <button
                onClick={() => setBookingStep(1)}
                className="text-slate-500 hover:text-slate-700"
              >
                Change Doctor
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.patientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Appointment Time *
                  </label>
                  <select
                    required
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field h-24 resize-none"
                  placeholder="Any specific concerns or information you'd like to share..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Booking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Book Appointment</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Appointment Booked!</h2>
            <p className="text-slate-600 mb-8">
              Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-slate-900 mb-4">Appointment Details</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-600">Doctor:</span>
                  <span className="font-medium">{formData.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">{formData.appointmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-medium">{formData.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Patient:</span>
                  <span className="font-medium">{formData.patientName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={resetBooking}
                className="btn-primary flex-1"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => window.location.href = '/doctors'}
                className="btn-secondary flex-1"
              >
                View All Doctors
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AppointmentBooking
