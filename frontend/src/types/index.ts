export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  sessionId?: string
  functionCalled?: string
  functionResult?: any
}

export interface Doctor {
  id: number
  name: string
  specialty: string
  department: string
  created_at: string
  availability?: DoctorAvailability[]
}

export interface DoctorAvailability {
  id: number
  doctor_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface Patient {
  id: number
  name: string
  phone?: string
  email?: string
  created_at: string
}

export interface Appointment {
  id: number
  doctor_id: number
  patient_id: number
  appointment_date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  doctor?: Doctor
  patient?: Patient
}

export interface ChatResponse {
  response: string
  session_id: string
  function_called?: string
  function_result?: any
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface BookingFormData {
  doctorName: string
  patientName: string
  patientPhone: string
  appointmentDate: string
  appointmentTime: string
  notes?: string
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: () => void
  color: 'primary' | 'medical' | 'secondary'
}
