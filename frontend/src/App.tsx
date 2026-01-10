import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Header from './components/Header'
import ChatInterface from './components/ChatInterface'
import DoctorList from './components/DoctorList'
import AppointmentBooking from './components/AppointmentBooking'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import PatientRegistration from './components/PatientRegistration'
import TestComponent from './components/TestComponent'

// Types
import { ChatMessage, Doctor, Appointment } from './types'

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  return (
    <Router>
      <div className="min-h-screen bg-black text-white pt-16">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
        
        <Header />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Dashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatInterface 
                    messages={chatMessages}
                    setMessages={setChatMessages}
                  />
                </motion.div>
              } 
            />
            <Route 
              path="/doctors" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <DoctorList 
                    doctors={doctors}
                    setDoctors={setDoctors}
                  />
                </motion.div>
              } 
            />
            <Route 
              path="/book" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <AppointmentBooking 
                    appointments={appointments}
                    setAppointments={setAppointments}
                  />
                </motion.div>
              } 
            />
            <Route 
              path="/test" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <TestComponent />
                </motion.div>
              } 
            />
            <Route 
              path="/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login />
                </motion.div>
              } 
            />
            <Route 
              path="/register-patient" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <PatientRegistration />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
