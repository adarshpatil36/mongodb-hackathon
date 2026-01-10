import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Stethoscope,
  Heart,
  Star,
  Sparkles
} from 'lucide-react'
import { doctorApi } from '../services/api'
import { Doctor } from '../types'
import Button from './Button'
import { ArrowRight } from './Icons'

const Dashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorApi.getAll()
        setDoctors(data.slice(0, 3)) // Show only first 3 doctors
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Chat",
      description: "Intelligent conversations to help manage patient symptoms",
      color: "from-blue-500 to-cyan-500",
      href: "/chat"
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Access and manage patient information efficiently",
      color: "from-green-500 to-emerald-500",
      href: "/doctors"
    },
    {
      icon: Calendar,
      title: "Symptom Tracking",
      description: "Track and analyze patient symptoms over time",
      color: "from-purple-500 to-pink-500",
      href: "/book"
    }
  ]

  const stats = [
    { label: "Active Doctors", value: "5+", icon: Stethoscope },
    { label: "Specialties", value: "8+", icon: Heart },
    { label: "Patients Served", value: "500+", icon: Users },
    { label: "Success Rate", value: "99%", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:py-24 animate-fadeIn">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full"
            >
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Assistance for Doctors</span>
            </motion.div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-6 leading-tight mb-6"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em"
              }}
            >
              Tether <br />An assistance to doctors in managing patient symptoms
            </h1>
            
            <p className="text-sm md:text-base text-center max-w-2xl mx-auto px-6 mb-10 text-white/60">
              A comprehensive platform designed to help doctors efficiently manage and track patient symptoms, providing intelligent support for better patient care.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 mb-16"
            >
              <Link to="/register-patient">
                <Button variant="gradient" size="lg" className="rounded-lg flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Register Patient</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              
              <Link to="/chat">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chatting</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-medium mb-6"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em"
              }}
            >
              Why Choose Us?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              An intelligent system designed to assist doctors in managing patient symptoms effectively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card p-8 group cursor-pointer"
                >
                  <Link to={feature.href} className="block">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/60 mb-6">{feature.description}</p>
                    <div className="flex items-center text-white font-medium group-hover:text-white/80">
                      <span>Learn More</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-medium mb-6"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em"
              }}
            >
              Meet Our Doctors
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Expert medical professionals ready to help you
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-8 animate-pulse">
                  <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card p-8 group"
                >
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700/50">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{doctor.name}</h3>
                  <p className="text-white/80 font-medium mb-4">{doctor.specialty}</p>
                  <p className="text-white/60 mb-6">{doctor.department}</p>
                  <Link to="/book">
                    <Button variant="gradient" size="default" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900/50 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-medium text-white mb-6"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em"
              }}
            >
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              An assistance to doctors in managing patient symptoms with intelligent tracking and analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button variant="gradient" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chatting Now</span>
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Browse Doctors</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
