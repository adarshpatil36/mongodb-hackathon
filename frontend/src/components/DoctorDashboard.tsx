import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Video,
  FileText,
  Pill,
  FlaskConical,
  Paperclip,
  ClipboardList,
  Calendar,
  Send,
  HelpCircle,
  FileEdit,
  Zap,
  Stethoscope,
  BarChart3,
  TrendingUp,
  UserX,
  Timer,
  Plus,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react'
import Button from './Button'

// Mock data for today's patients
const todaysPatients = [
  { id: '1', name: 'John Doe', time: '9:00 AM', type: 'Follow-up', priority: 'high', status: 'waiting' },
  { id: '2', name: 'Jane Smith', time: '9:30 AM', type: 'Post-op', priority: 'high', status: 'in-progress' },
  { id: '3', name: 'Robert Johnson', time: '10:00 AM', type: 'Consultation', priority: 'medium', status: 'waiting' },
  { id: '4', name: 'Emily Williams', time: '10:30 AM', type: 'Check-up', priority: 'low', status: 'scheduled' },
  { id: '5', name: 'Michael Brown', time: '11:00 AM', type: 'Televisit', priority: 'medium', status: 'scheduled' },
]

// Mock data for tasks
const tasks = [
  { id: '1', type: 'lab', title: 'Review lab results - John Doe', urgent: true, completed: false },
  { id: '2', type: 'note', title: 'Sign consultation note - Jane Smith', urgent: false, completed: false },
  { id: '3', type: 'refill', title: 'Approve refill - Lisinopril 10mg', urgent: false, completed: true },
  { id: '4', type: 'followup', title: 'Schedule follow-up - Robert Johnson', urgent: true, completed: false },
  { id: '5', type: 'lab', title: 'Review MRI results - Emily Williams', urgent: false, completed: false },
]

// Mock patient chart data
const patientChart = {
  name: 'John Doe',
  age: 45,
  surgery: 'Total Knee Arthroplasty',
  surgeryDate: '2024-01-20',
  timeline: [
    { date: '2026-01-10', event: 'Post-op Day 14 Check', type: 'visit' },
    { date: '2026-01-05', event: 'Physical Therapy Session', type: 'therapy' },
    { date: '2024-01-20', event: 'Surgery Completed', type: 'surgery' },
  ],
  medications: ['Oxycodone 5mg PRN', 'Aspirin 81mg Daily', 'Gabapentin 300mg TID'],
  recentLabs: [
    { name: 'CBC', date: '2026-01-08', status: 'normal' },
    { name: 'CMP', date: '2026-01-08', status: 'normal' },
    { name: 'PT/INR', date: '2026-01-08', status: 'abnormal' },
  ],
}

// Templates data
const templates = {
  notes: ['Post-Op Day 1', 'Follow-Up Visit', 'Discharge Summary', 'Consultation Note'],
  orders: ['Post-Op Labs', 'PT Referral', 'Home Health', 'DME Order'],
  diagnoses: ['M17.11 - Primary OA, Right Knee', 'Z96.651 - Right Knee Replacement', 'M25.561 - Pain in Right Knee'],
}

// Analytics data
const analytics = {
  patientVolume: { today: 12, week: 67, trend: '+8%' },
  noShows: { today: 1, week: 4, rate: '5.9%' },
  avgConsultTime: { today: '18 min', week: '16 min', trend: '-2 min' },
}

const DoctorDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient] = useState(patientChart)
  const [chartTab, setChartTab] = useState<'timeline' | 'notes' | 'meds' | 'labs' | 'attachments'>('timeline')
  const [taskList, setTaskList] = useState(tasks)

  const toggleTask = (taskId: string) => {
    setTaskList(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': return { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle }
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertCircle }
      default: return { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle }
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in-progress': return { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Progress' }
      case 'waiting': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Waiting' }
      default: return { color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Scheduled' }
    }
  }

  const filteredPatients = todaysPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="text-sm text-white/60">Welcome back, Dr. Smith</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/register-patient">
              <Button variant="gradient" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Patient
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Patient Queue & Tasks */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Today's Patient List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/60" />
                  Today's Patients
                </h2>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {todaysPatients.length}
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>

              {/* Patient Queue */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredPatients.map((patient) => {
                  const priorityConfig = getPriorityConfig(patient.priority)
                  const statusConfig = getStatusConfig(patient.status)
                  const PriorityIcon = priorityConfig.icon

                  return (
                    <div
                      key={patient.id}
                      className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white text-sm">{patient.name}</span>
                        <PriorityIcon className={`w-4 h-4 ${priorityConfig.color}`} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Clock className="w-3 h-3" />
                          {patient.time}
                          <span className="text-white/40">•</span>
                          {patient.type}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-white/60" />
                  Tasks
                </h2>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {taskList.filter(t => !t.completed).length} pending
                </span>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {taskList.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      task.completed 
                        ? 'bg-gray-800/20 border-gray-800/30 opacity-60' 
                        : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {task.type === 'lab' && <FlaskConical className="w-3 h-3 text-purple-400" />}
                          {task.type === 'note' && <FileEdit className="w-3 h-3 text-blue-400" />}
                          {task.type === 'refill' && <Pill className="w-3 h-3 text-green-400" />}
                          {task.type === 'followup' && <Calendar className="w-3 h-3 text-orange-400" />}
                          <span className="text-xs text-white/40 capitalize">{task.type}</span>
                          {task.urgent && !task.completed && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Urgent</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Patient Chart Viewer */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedPatient.name}</h2>
                    <p className="text-sm text-white/60">
                      {selectedPatient.age} years • {selectedPatient.surgery}
                    </p>
                  </div>
                </div>
                <Link to="/medical-records">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Full Chart
                  </Button>
                </Link>
              </div>

              {/* Chart Tabs */}
              <div className="flex items-center gap-1 mb-4 p-1 bg-gray-800/50 rounded-lg">
                {[
                  { id: 'timeline', label: 'Timeline', icon: Clock },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'meds', label: 'Meds', icon: Pill },
                  { id: 'labs', label: 'Labs', icon: FlaskConical },
                  { id: 'attachments', label: 'Files', icon: Paperclip },
                ].map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setChartTab(tab.id as typeof chartTab)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                        chartTab === tab.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Chart Content */}
              <div className="min-h-[300px]">
                {chartTab === 'timeline' && (
                  <div className="space-y-4">
                    {patientChart.timeline.map((item, index) => {
                      const getDotColor = (type: string) => {
                        if (type === 'surgery') return 'bg-red-400'
                        if (type === 'therapy') return 'bg-green-400'
                        return 'bg-blue-400'
                      }
                      const dotColor = getDotColor(item.type)
                      return (
                      <div key={`${item.date}-${item.event}`} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                          {index < patientChart.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-700" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-white">{item.event}</p>
                          <p className="text-xs text-white/60">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )})}
                  </div>
                )}

                {chartTab === 'meds' && (
                  <div className="space-y-2">
                    {patientChart.medications.map((med) => (
                      <div key={med} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Pill className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">{med}</span>
                      </div>
                    ))}
                  </div>
                )}

                {chartTab === 'labs' && (
                  <div className="space-y-2">
                    {patientChart.recentLabs.map((lab) => (
                      <div key={`${lab.name}-${lab.date}`} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FlaskConical className={`w-4 h-4 ${lab.status === 'normal' ? 'text-green-400' : 'text-red-400'}`} />
                          <span className="text-sm text-white">{lab.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60">{lab.date}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            lab.status === 'normal' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {lab.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chartTab === 'notes' && (
                  <div className="text-center py-8 text-white/40">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notes available</p>
                  </div>
                )}

                {chartTab === 'attachments' && (
                  <div className="text-center py-8 text-white/40">
                    <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No attachments</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Televisit Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-white/60" />
                Televisit Controls
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-green-500/20 rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-all">
                  <Video className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-green-400">Start Call</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all">
                  <Send className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-blue-400">Send Link</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-orange-500/20 rounded-xl border border-orange-500/30 hover:bg-orange-500/30 transition-all">
                  <HelpCircle className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-orange-400">Troubleshoot</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Templates & Analytics */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Templates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-4"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-white/60" />
                Quick Templates
              </h2>

              <div className="space-y-4">
                {/* Note Templates */}
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileEdit className="w-3 h-3" /> Note Templates
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {templates.notes.map((template) => (
                      <button
                        key={template}
                        className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-all"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Common Orders */}
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ClipboardList className="w-3 h-3" /> Common Orders
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {templates.orders.map((order) => (
                      <button
                        key={order}
                        className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-all"
                      >
                        {order}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diagnosis Shortcuts */}
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Stethoscope className="w-3 h-3" /> Diagnoses
                  </h3>
                  <div className="space-y-1">
                    {templates.diagnoses.map((dx) => (
                      <button
                        key={dx}
                        className="w-full text-left px-3 py-2 text-xs bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all truncate"
                      >
                        {dx}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-white/60" />
                Analytics
              </h2>

              <div className="space-y-4">
                {/* Patient Volume */}
                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/80">Patient Volume</span>
                    </div>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {analytics.patientVolume.trend}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{analytics.patientVolume.today}</span>
                    <span className="text-xs text-white/40">today</span>
                    <span className="text-sm text-white/60">/ {analytics.patientVolume.week} this week</span>
                  </div>
                </div>

                {/* No-Shows */}
                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-white/80">No-Shows</span>
                    </div>
                    <span className="text-xs text-white/60">{analytics.noShows.rate} rate</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{analytics.noShows.today}</span>
                    <span className="text-xs text-white/40">today</span>
                    <span className="text-sm text-white/60">/ {analytics.noShows.week} this week</span>
                  </div>
                </div>

                {/* Avg Consult Time */}
                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white/80">Avg Consult Time</span>
                    </div>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {analytics.avgConsultTime.trend}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{analytics.avgConsultTime.today}</span>
                    <span className="text-xs text-white/40">today</span>
                    <span className="text-sm text-white/60">/ {analytics.avgConsultTime.week} avg</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
