import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Stethoscope, 
  Search, 
  Star, 
  Clock, 
  Calendar,
  Phone,
  Heart,
  Brain,
  Eye,
  Bone,
  Activity
} from 'lucide-react'
import { doctorApi } from '../services/api'
import { Doctor } from '../types'
import toast from 'react-hot-toast'

interface DoctorListProps {
  doctors: Doctor[]
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, setDoctors }) => {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])

  const specialties = [
    { value: 'all', label: 'All Specialties', icon: Activity },
    { value: 'Cardiology', label: 'Cardiology', icon: Heart },
    { value: 'Orthopedics', label: 'Orthopedics', icon: Bone },
    { value: 'Dermatology', label: 'Dermatology', icon: Eye },
    { value: 'General Medicine', label: 'General Medicine', icon: Stethoscope },
    { value: 'Neurology', label: 'Neurology', icon: Brain },
  ]

  const getSpecialtyIcon = (specialty: string) => {
    const specialtyData = specialties.find(s => s.value === specialty)
    return specialtyData?.icon || Stethoscope
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const data = await doctorApi.getAll()
        setDoctors(data)
        setFilteredDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        toast.error('Failed to load doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [setDoctors])

  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty)
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchTerm, selectedSpecialty])

  const DoctorCard: React.FC<{ doctor: Doctor; index: number }> = ({ doctor, index }) => {
    const Icon = getSpecialtyIcon(doctor.specialty)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="card p-6 group cursor-pointer"
      >
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-medical-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{doctor.name}</h3>
            <p className="text-primary-600 font-medium mb-2">{doctor.specialty}</p>
            <p className="text-slate-600 mb-4">{doctor.department}</p>
            
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.9</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Available Today</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="btn-primary flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </button>
          <button className="btn-secondary">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Our Medical Team</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Meet our expert doctors and specialists ready to provide you with the best medical care
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialty, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
              
              {/* Specialty Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="input-field"
                >
                  {specialties.map(specialty => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specialty Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => {
              const Icon = specialty.icon
              return (
                <button
                  key={specialty.value}
                  onClick={() => setSelectedSpecialty(specialty.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    selectedSpecialty === specialty.value
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{specialty.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-slate-600">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSpecialty !== 'all' && ` in ${selectedSpecialty}`}
          </p>
        </motion.div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No doctors found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialty('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorList
