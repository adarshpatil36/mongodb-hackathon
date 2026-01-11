export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface CallSchedule {
  frequency: string
  preferred_time: string
  next_call_date?: string
  timezone?: string
  enabled?: boolean
}

// Medication can be a string or an object from the API
export interface MedicationObject {
  name: string
  dosage: string
  frequency: string
  start_date?: string
}

export type Medication = string | MedicationObject

export interface Patient {
  _id?: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email?: string
  preferred_language: string
  surgery_type: string
  surgery_date: string
  medications: Medication[]
  allergies: string[]
  conditions: string[]
  emergency_contact: EmergencyContact
  call_schedule?: CallSchedule
  notes?: string
  doctor_id?: string
  created_at?: string
  updated_at?: string
}

export interface PatientRegistrationForm {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email?: string
  preferred_language: string
  surgery_type: string
  surgery_date: string
  medications: string[]
  allergies: string[]
  conditions: string[]
  emergency_contact: EmergencyContact
  notes?: string
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
