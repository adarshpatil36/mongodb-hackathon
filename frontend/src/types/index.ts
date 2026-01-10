export interface Symptom {
  id?: number
  description: string
  onset_date: string
  severity: 'mild' | 'moderate' | 'severe'
  duration_days?: number
  duration_hours?: number
  related_symptoms?: string
  notes?: string
}

export interface Patient {
  id?: number
  name: string
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  phone?: string
  email?: string
  address?: string
  medical_history?: string
  symptoms: Symptom[]
  created_at?: string
}

export interface PatientRegistrationForm {
  patient: {
    name: string
    age: number
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    phone?: string
    email?: string
    address?: string
    medical_history?: string
  }
  symptoms: Symptom[]
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: () => void
  color: 'primary' | 'medical' | 'secondary'
}
