import axios from 'axios'
import { ChatResponse, Doctor, Appointment, BookingFormData, Patient, PatientRegistrationForm } from '../types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://doctor-chatbot-api-5v9h.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const chatApi = {
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await api.post('/chat', {
      message,
      session_id: sessionId,
    })
    return response.data
  },
}

export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get('/doctors/')
    return response.data
  },
  
  getBySpecialty: async (specialty: string): Promise<Doctor[]> => {
    const response = await api.get(`/doctors/specialty/${encodeURIComponent(specialty)}`)
    return response.data
  },
  
  create: async (doctor: Omit<Doctor, 'id' | 'created_at'>): Promise<Doctor> => {
    const response = await api.post('/doctors/', doctor)
    return response.data
  },
}

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/')
    return response.data
  },
  
  book: async (bookingData: BookingFormData): Promise<Appointment> => {
    const response = await api.post('/appointments/', bookingData)
    return response.data
  },
}

export const availabilityApi = {
  getDoctorAvailability: async (doctorId: number, date: string, time: string) => {
    const response = await api.post('/chat', {
      message: `Check availability for doctor ID ${doctorId} on ${date} at ${time}`,
    })
    return response.data
  },
  
  getAvailableDoctors: async (date: string, time: string) => {
    const response = await api.post('/chat', {
      message: `Get available doctors on ${date} at ${time}`,
    })
    return response.data
  },
}

export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get('/patients/')
    return response.data
  },
  
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`)
    return response.data
  },
  
  register: async (patientData: PatientRegistrationForm): Promise<Patient> => {
    const response = await api.post('/patients/', patientData)
    return response.data
  },
  
  update: async (id: number, patientData: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patientData)
    return response.data
  },
}

export default api
