import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  User,
  Calendar,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { externalPatientApi } from '../services/api'
import { Patient } from '../types'

interface PatientRecord {
  _id: string
  first_name: string
  last_name: string
  phone: string
  surgery_type: string
  last_contacted: string
  urgency: 'high' | 'medium' | 'low'
  notes?: string
}

// Helper function to derive urgency based on surgery date
const deriveUrgency = (surgeryDate: string): 'high' | 'medium' | 'low' => {
  const surgery = new Date(surgeryDate)
  const now = new Date()
  const daysSinceSurgery = Math.floor((now.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceSurgery <= 7) return 'high'
  if (daysSinceSurgery <= 30) return 'medium'
  return 'low'
}

// Transform Patient from API to PatientRecord for display
const transformPatientToRecord = (patient: Patient): PatientRecord => ({
  _id: patient._id || String(Math.random()),
  first_name: patient.first_name,
  last_name: patient.last_name,
  phone: patient.phone,
  surgery_type: patient.surgery_type,
  last_contacted: patient.updated_at || patient.created_at || new Date().toISOString(),
  urgency: deriveUrgency(patient.surgery_date),
  notes: patient.notes || `${patient.conditions?.join(', ') || 'No conditions noted'}`
})

const MedicalRecords: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const fetchPatients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await externalPatientApi.getAll()
      // Handle both array response and object with data property
      const patientData = Array.isArray(response) ? response : (response as { data?: Patient[] }).data || []
      const transformedPatients = patientData.map(transformPatientToRecord)
      setPatients(transformedPatients)
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to load patients. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // Sort by urgency (high first) and then by last contacted (most recent first)
  const sortedAndFilteredPatients = patients
    .filter(patient => {
      const matchesSearch = 
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.surgery_type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterUrgency === 'all' || patient.urgency === filterUrgency
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 }
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
      }
      return new Date(b.last_contacted).getTime() - new Date(a.last_contacted).getTime()
    })

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          label: 'High Priority'
        }
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          label: 'Medium Priority'
        }
      case 'low':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          label: 'Low Priority'
        }
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          label: 'Unknown'
        }
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const urgencyCounts = {
    high: patients.filter(p => p.urgency === 'high').length,
    medium: patients.filter(p => p.urgency === 'medium').length,
    low: patients.filter(p => p.urgency === 'low').length,
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
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
            Medical Records
          </h1>
          <p className="text-sm md:text-base text-white/60">
            View patient contact history and urgency status
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div 
            className={`card p-4 cursor-pointer transition-all ${filterUrgency === 'high' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilterUrgency(filterUrgency === 'high' ? 'all' : 'high')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{urgencyCounts.high}</p>
                <p className="text-xs text-white/60">High Priority</p>
              </div>
            </div>
          </div>
          <div 
            className={`card p-4 cursor-pointer transition-all ${filterUrgency === 'medium' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setFilterUrgency(filterUrgency === 'medium' ? 'all' : 'medium')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{urgencyCounts.medium}</p>
                <p className="text-xs text-white/60">Medium Priority</p>
              </div>
            </div>
          </div>
          <div 
            className={`card p-4 cursor-pointer transition-all ${filterUrgency === 'low' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setFilterUrgency(filterUrgency === 'low' ? 'all' : 'low')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{urgencyCounts.low}</p>
                <p className="text-xs text-white/60">Low Priority</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar and Refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name or surgery type..."
                className="input-field pl-12 w-full"
              />
            </div>
            <button
              onClick={fetchPatients}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-gray-700 rounded-xl flex items-center gap-2 text-white/80 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchPatients}
              className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="h-8 w-24 bg-gray-700 rounded-full" />
                </div>
              </div>
            ))
          ) : sortedAndFilteredPatients.length === 0 ? (
            <div className="card p-12 text-center">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No patients found</p>
            </div>
          ) : (
            sortedAndFilteredPatients.map((patient, index) => {
              const urgencyConfig = getUrgencyConfig(patient.urgency)
              const UrgencyIcon = urgencyConfig.icon
              const { date, time } = formatDateTime(patient.last_contacted)

              return (
                <motion.div
                  key={patient._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`card p-6 cursor-pointer border-l-4 ${urgencyConfig.border}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Patient Avatar */}
                    <div className={`w-12 h-12 ${urgencyConfig.bg} rounded-full flex items-center justify-center`}>
                      <User className={`w-6 h-6 ${urgencyConfig.color}`} />
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${urgencyConfig.bg} ${urgencyConfig.color}`}>
                          <UrgencyIcon className="w-3 h-3" />
                          {urgencyConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 truncate">{patient.surgery_type}</p>
                      {patient.notes && (
                        <p className="text-xs text-white/40 mt-1 truncate">{patient.notes}</p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{patient.phone}</span>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col items-end gap-1 min-w-[100px]">
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{time}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Results count */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 text-sm mt-6"
          >
            Showing {sortedAndFilteredPatients.length} of {patients.length} patients
            {filterUrgency !== 'all' && ` (filtered by ${filterUrgency} priority)`}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default MedicalRecords

