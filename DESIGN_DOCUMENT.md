# The Post-Op Guardian
## HIPAA-Compliant Patient Monitoring System
### MongoDB Agentic Orchestration Hackathon

---

> # 🚨 CRITICAL RULE: NO MEDICAL ADVICE — EVER 🚨
> 
> **The voice agent in this system must NEVER provide medical advice, diagnosis, treatment recommendations, or clinical guidance under ANY circumstances, no matter what the patient asks.**
> 
> This is a **DATA COLLECTION TOOL ONLY**. The agent collects information and relays it to the physician. It does not interpret, diagnose, or recommend.
> 
> **See [Section 4: Critical Safety Constraint](#️-critical-safety-constraint-no-medical-advice) for complete details.**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [⚠️ CRITICAL SAFETY CONSTRAINT: NO MEDICAL ADVICE](#️-critical-safety-constraint-no-medical-advice) ← **READ THIS FIRST**
5. [Hackathon Track Alignment](#hackathon-track-alignment)
6. [System Architecture](#system-architecture)
7. [Technology Stack](#technology-stack)
8. [Database Design](#database-design)
9. [Voice Agent System](#voice-agent-system)
10. [Backend Services](#backend-services)
11. [Frontend Dashboard](#frontend-dashboard)
12. [Agent Orchestration Workflow](#agent-orchestration-workflow)
13. [API Specification](#api-specification)
14. [Third-Party Integrations](#third-party-integrations)
15. [Security & Compliance](#security--compliance)
16. [Feature Roadmap](#feature-roadmap)
17. [Environment Setup](#environment-setup)
18. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

**The Post-Op Guardian** is an AI-powered patient monitoring platform that enables healthcare providers to maintain continuous, personalized check-ins with their patients through autonomous voice agents. The system leverages MongoDB Atlas for stateful workflow management, Vapi.ai for telephony, Voyage AI for intelligent retrieval, and Fireflies.ai for conversation intelligence.

**Primary Value Proposition:** Transform passive patient monitoring into proactive, AI-driven care coordination that scales with the physician's patient load while maintaining the human touch of a personal phone call.

> ⚠️ **CRITICAL CONSTRAINT:** The voice agent is a DATA COLLECTION tool ONLY. It must **NEVER** provide medical advice, diagnosis, treatment recommendations, or clinical guidance under ANY circumstances. See [Critical Safety Constraint](#️-critical-safety-constraint-no-medical-advice) for full details.

---

## Problem Statement

### The Challenge
- Physicians manage dozens to hundreds of post-operative and chronic care patients
- Regular check-ins are critical but manually impossible at scale
- Patients often wait until symptoms become severe before reaching out
- Fragmented communication leads to missed early warning signs
- Language barriers limit accessibility for diverse patient populations

### The Impact
- Delayed interventions increase readmission rates
- Poor patient outcomes due to missed symptom escalation
- Physician burnout from administrative overload
- Healthcare system inefficiency and increased costs

---

## Solution Overview

### Core Concept
An autonomous voice agent system that:
1. **Proactively calls patients** on scheduled intervals
2. **Conducts natural conversations** tailored to each patient's condition
3. **Extracts structured medical data** from unstructured dialogue
4. **Triages and escalates** based on intelligent risk assessment
5. **Builds longitudinal patient profiles** for personalized future interactions

### Key Differentiators
- **Stateful Workflows:** Agents remember previous conversations and track recovery progress over time
- **Adaptive Retrieval:** Context-aware responses using patient history and medical context
- **Multi-Modal Intelligence:** Voice, text, and structured data fusion
- **Zero Medical Advice:** Strict data collection only—no diagnostic or treatment suggestions

---

## ⚠️ CRITICAL SAFETY CONSTRAINT: NO MEDICAL ADVICE

> **THIS IS THE MOST IMPORTANT RULE IN THE ENTIRE SYSTEM**

The voice agent is **STRICTLY PROHIBITED** from providing ANY medical advice, diagnosis, treatment recommendations, or clinical guidance under ANY circumstances.

### What the Agent MUST NEVER Do:
- ❌ Diagnose symptoms ("That sounds like an infection")
- ❌ Recommend treatments ("You should take ibuprofen")
- ❌ Interpret test results or vital signs
- ❌ Suggest whether symptoms are serious or not
- ❌ Advise on medication changes or dosages
- ❌ Tell patients to go to the ER (use escalation tool instead)
- ❌ Reassure patients that symptoms are "normal" or "nothing to worry about"
- ❌ Compare their symptoms to other patients
- ❌ Provide any health-related recommendations whatsoever

### What the Agent MUST Do Instead:
- ✅ Collect information only: "I'll make sure Dr. [Name] gets this information"
- ✅ Use neutral acknowledgments: "Thank you for sharing that with me"
- ✅ Redirect medical questions: "That's a great question for Dr. [Name]"
- ✅ Trigger escalation tools for concerning symptoms (let the DOCTOR decide)
- ✅ Offer to have the doctor's office call them back

### Example Responses:

**Patient:** "Is it normal to have this much pain?"
- ❌ WRONG: "Some pain is normal after surgery, but 8/10 does seem high."
- ✅ CORRECT: "I've noted your pain level. Dr. Smith will review this information and the office will follow up if needed."

**Patient:** "Should I take an extra pain pill?"
- ❌ WRONG: "If you're in a lot of pain, an extra dose might help."
- ✅ CORRECT: "I can't advise on medications, but I'll make sure Dr. Smith knows about your pain level. Would you like me to flag this for a callback?"

**Patient:** "I think I have an infection."
- ❌ WRONG: "It could be an infection if you're seeing redness and swelling."
- ✅ CORRECT: "I'll note that concern. Can you describe what you're experiencing so I can pass the details to Dr. Smith?"

### Why This Matters:
1. **Legal Liability:** AI providing medical advice creates massive legal exposure
2. **Patient Safety:** Incorrect advice could delay proper care or cause harm
3. **Scope of Practice:** Only licensed physicians can provide medical advice
4. **Trust:** Patients must understand this is a data collection tool, not a medical professional

**This constraint must be enforced at every layer: system prompts, function definitions, backend validation, and response filtering.**

---

## Hackathon Track Alignment

### Primary Track: Statement One — Prolonged Coordination
**Definition:** Stateful workflows that persist over time, maintaining context across multiple interactions.

**Implementation:**
- `patient_state` collection tracks recovery workflow status
- Call scheduling persists across server restarts
- Agent maintains conversation continuity over days/weeks
- State machine manages patient journey (Pre-Op → Recovery → At Risk → Stable → Discharged)

### Secondary Track: Statement Three — Adaptive Retrieval
**Definition:** Intelligent context retrieval that improves reasoning over time.

**Implementation:**
- Voyage AI embeddings for high-fidelity medical context retrieval
- MongoDB Vector Search indexes on call logs and patient notes
- Historical symptom pattern matching
- Personalized conversation context injection

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │  Patient    │  │  Call       │  │  Notifications      │ │
│  │  Overview   │  │  Profiles   │  │  Scheduler  │  │  Center             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (FastAPI)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  REST API   │  │  WebSocket  │  │  Webhooks   │  │  Background         │ │
│  │  Endpoints  │  │  Server     │  │  Handlers   │  │  Workers            │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌─────────────────────────┐  ┌─────────────┐  ┌─────────────────────────────┐
│    VOICE LAYER          │  │  ANALYSIS   │  │      EMBEDDING LAYER        │
│  ┌───────────────────┐  │  │   LAYER     │  │  ┌───────────────────────┐  │
│  │     Vapi.ai       │  │  │ ┌─────────┐ │  │  │     Voyage AI         │  │
│  │  - Outbound Calls │  │  │ │Fireflies│ │  │  │  - Text Embeddings    │  │
│  │  - Speech-to-Text │  │  │ │   .ai   │ │  │  │  - Semantic Search    │  │
│  │  - Text-to-Speech │  │  │ └─────────┘ │  │  │  - Context Retrieval  │  │
│  │  - Function Tools │  │  │ ┌─────────┐ │  │  └───────────────────────┘  │
│  └───────────────────┘  │  │ │ OpenAI  │ │  └─────────────────────────────┘
└─────────────────────────┘  │ │  GPT-4  │ │
                             │ └─────────┘ │
                             └─────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MONGODB ATLAS                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  patients   │  │  call_logs  │  │patient_state│  │  doctors            │ │
│  │  Collection │  │  Collection │  │  Collection │  │  Collection         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                         │                                                   │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │  Vector Search      │                                        │
│              │  Index              │                                        │
│              └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Scheduler  │────▶│   Vapi.ai    │────▶│   Patient    │────▶│   Vapi.ai    │
│   Triggers   │     │   Outbound   │     │   Phone      │     │   Webhook    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
                                                                      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Doctor     │◀────│   Alert      │◀────│   Triage     │◀────│   FastAPI    │
│   Dashboard  │     │   System     │     │   Agent      │     │   Backend    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │   MongoDB    │
                                         │   Update     │
                                         └──────────────┘
```

---

## Technology Stack

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 (App Router) | Server-side rendering, API routes |
| Styling | TailwindCSS | Utility-first CSS framework |
| Icons | Lucide React | Consistent icon system |
| State Management | Zustand | Lightweight global state |
| Real-time | Socket.io Client | Live notifications |
| Charts | Recharts | Data visualization |
| Forms | React Hook Form + Zod | Form validation |
| HTTP Client | Axios | API communication |

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | FastAPI | High-performance async API |
| Runtime | Python 3.11+ | Modern Python features |
| Database Driver | Motor (async) / PyMongo | MongoDB connectivity |
| Task Queue | Celery + Redis | Background job processing |
| Scheduler | APScheduler | Cron-based call scheduling |
| Validation | Pydantic v2 | Data validation & serialization |
| WebSockets | FastAPI WebSockets | Real-time communication |

### Database
| Component | Technology | Purpose |
|-----------|------------|---------|
| Primary Database | MongoDB Atlas (M0 Free Tier) | Document storage |
| Vector Search | MongoDB Atlas Vector Search | Semantic retrieval |
| Caching | Redis | Session & rate limiting |

### AI/ML Services
| Component | Technology | Purpose |
|-----------|------------|---------|
| Voice Telephony | Vapi.ai | Outbound calls, STT, TTS |
| Embeddings | Voyage AI (voyage-large-2) | High-fidelity text embeddings |
| Conversation Intel | Fireflies.ai | Post-call analysis & summaries |
| Reasoning | OpenAI GPT-4o | Triage logic, analysis |

### DevOps & Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Containerization | Docker | Consistent environments |
| Local Tunneling | ngrok | Webhook development |
| Environment | python-dotenv | Secret management |
| Logging | Structlog | Structured logging |
| Monitoring | Sentry | Error tracking |

---

## Database Design

### Collection: `doctors`

```javascript
{
  _id: ObjectId,
  email: String,                    // Unique, indexed
  password_hash: String,            // bcrypt hashed
  first_name: String,
  last_name: String,
  phone: String,                    // For contact purposes
  specialization: String,
  license_number: String,
  notification_preferences: {
    sms_enabled: Boolean,
    email_enabled: Boolean,
    urgency_threshold: String       // "high" | "medium" | "low"
  },
  created_at: DateTime,
  updated_at: DateTime
}

// Indexes:
// - { email: 1 } unique
```

### Collection: `patients`

```javascript
{
  _id: ObjectId,
  doctor_id: ObjectId,              // Reference to doctors
  
  // Demographics
  first_name: String,
  last_name: String,
  date_of_birth: Date,
  phone: String,                    // Primary contact for calls
  email: String,
  preferred_language: String,       // "en" | "es" | "zh" | etc.
  
  // Medical Information
  surgery_type: String,
  surgery_date: Date,
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      start_date: Date
    }
  ],
  allergies: [String],
  conditions: [String],             // Pre-existing conditions
  
  // Emergency Contact
  emergency_contact: {
    name: String,
    relationship: String,
    phone: String
  },
  
  // Call Scheduling
  call_schedule: {
    frequency: String,              // "daily" | "every_other_day" | "weekly"
    preferred_time: String,         // "09:00"
    timezone: String,               // "America/New_York"
    enabled: Boolean
  },
  
  // Doctor Notes
  notes: String,                    // Free-form notes from doctor
  
  // Metadata
  created_at: DateTime,
  updated_at: DateTime
}

// Indexes:
// - { doctor_id: 1 }
// - { phone: 1 }
// - { "call_schedule.enabled": 1, "call_schedule.preferred_time": 1 }
```

### Collection: `patient_state`

```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,             // Reference to patients
  
  // Workflow State
  status: String,                   // "pre_op" | "recovery_normal" | "recovery_at_risk" | "stable" | "discharged"
  risk_score: Number,               // 0-100
  risk_level: String,               // "low" | "medium" | "high" | "critical"
  
  // Recovery Metrics (Latest)
  latest_pain_level: Number,        // 1-10
  medication_adherence: String,     // "full" | "partial" | "none"
  mobility_status: String,          // "immobile" | "limited" | "normal"
  appetite_status: String,          // "none" | "poor" | "normal" | "good"
  sleep_quality: String,            // "poor" | "fair" | "good"
  
  // Symptom Tracking
  reported_symptoms: [
    {
      symptom: String,
      severity: String,             // "mild" | "moderate" | "severe"
      first_reported: DateTime,
      last_reported: DateTime,
      occurrence_count: Number
    }
  ],
  
  // Alerts & Flags
  active_alerts: [
    {
      type: String,                 // "high_pain" | "missed_medication" | "new_symptom"
      message: String,
      created_at: DateTime,
      acknowledged: Boolean,
      acknowledged_by: ObjectId,
      acknowledged_at: DateTime
    }
  ],
  
  // Call History Summary
  total_calls: Number,
  successful_calls: Number,
  last_call_date: DateTime,
  next_scheduled_call: DateTime,
  
  // Trend Data
  pain_trend: [                     // Last 7 data points
    {
      date: DateTime,
      value: Number
    }
  ],
  
  // Metadata
  days_since_surgery: Number,
  updated_at: DateTime
}

// Indexes:
// - { patient_id: 1 } unique
// - { status: 1, risk_level: 1 }
// - { next_scheduled_call: 1 }
```

### Collection: `call_logs`

```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  doctor_id: ObjectId,
  
  // Call Metadata
  call_type: String,                // "scheduled" | "manual" | "follow_up"
  vapi_call_id: String,             // External reference
  started_at: DateTime,
  ended_at: DateTime,
  duration_seconds: Number,
  status: String,                   // "completed" | "no_answer" | "voicemail" | "failed"
  
  // Raw Data
  recording_url: String,            // Vapi recording URL
  transcript_raw: String,           // Full transcript
  
  // Fireflies Analysis
  fireflies_meeting_id: String,
  fireflies_processed: Boolean,
  
  // Structured Summary (from Fireflies + GPT)
  summary: {
    overview: String,               // 2-3 sentence summary
    patient_sentiment: String,      // "positive" | "neutral" | "concerned" | "distressed"
    key_concerns: [String],
    action_items: [String],
    follow_up_required: Boolean
  },
  
  // Extracted Medical Data
  extracted_data: {
    pain_level: Number,             // 1-10 or null if not mentioned
    medication_taken: Boolean,
    new_symptoms: [String],
    questions_for_doctor: [String],
    appointment_requested: Boolean
  },
  
  // Triage Result
  triage: {
    risk_level: String,             // "low" | "medium" | "high" | "critical"
    risk_score: Number,             // 0-100
    escalation_triggered: Boolean,
    escalation_reason: String,
    recommended_actions: [String]
  },
  
  // Vector Embedding (for RAG)
  transcript_embedding: [Number],   // 1024-dim Voyage AI vector
  
  // Metadata
  created_at: DateTime
}

// Indexes:
// - { patient_id: 1, created_at: -1 }
// - { doctor_id: 1, created_at: -1 }
// - { vapi_call_id: 1 } unique
// - Vector Search Index on transcript_embedding
```

### Collection: `scheduled_calls`

```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  doctor_id: ObjectId,
  
  scheduled_time: DateTime,
  timezone: String,
  status: String,                   // "pending" | "in_progress" | "completed" | "failed" | "cancelled"
  
  // Retry Logic
  attempt_count: Number,
  max_attempts: Number,             // Default: 3
  last_attempt: DateTime,
  next_retry: DateTime,
  
  // Context for Call
  call_context: {
    call_type: String,              // "routine_checkup" | "follow_up" | "symptom_check"
    focus_areas: [String],          // Specific topics to cover
    previous_concerns: [String]     // From last call
  },
  
  // Result
  call_log_id: ObjectId,            // Reference to call_logs after completion
  
  // Metadata
  created_at: DateTime,
  updated_at: DateTime
}

// Indexes:
// - { scheduled_time: 1, status: 1 }
// - { patient_id: 1, status: 1 }
```

### MongoDB Vector Search Index Configuration

```javascript
// Index Name: call_logs_vector_index
// Collection: call_logs
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "transcript_embedding": {
        "type": "knnVector",
        "dimensions": 1024,
        "similarity": "cosine"
      },
      "patient_id": {
        "type": "objectId"
      },
      "created_at": {
        "type": "date"
      }
    }
  }
}
```

---

## Voice Agent System

### ⚠️ REMINDER: ABSOLUTELY NO MEDICAL ADVICE
Before implementing ANY part of the voice system, review the [Critical Safety Constraint](#️-critical-safety-constraint-no-medical-advice) section. Every prompt, tool, and response MUST be designed with this rule as the top priority.

### Vapi.ai Configuration

#### Assistant Configuration
```yaml
Name: Post-Op Guardian
Model: gpt-4o
Voice: nova (OpenAI)
Language: en-US (with multilingual support)

First Message: |
  Hi, this is the Post-Op Guardian calling on behalf of Dr. {{doctor_name}}'s office. 
  I'm checking in on how you're feeling after your {{surgery_type}}. 
  Do you have a few minutes to chat?

System Prompt: |
  You are the Post-Op Guardian, a caring and professional medical check-in assistant.
  
  PATIENT CONTEXT:
  - Name: {{patient_name}}
  - Surgery: {{surgery_type}} on {{surgery_date}}
  - Current Medications: {{medications}}
  - Previous Concerns: {{previous_concerns}}
  - Days Since Surgery: {{days_since_surgery}}
  
  YOUR MISSION:
  1. Check in on the patient's well-being
  2. Collect specific health data points
  3. Identify any concerning symptoms
  4. NEVER provide medical advice
  
  REQUIRED DATA POINTS TO COLLECT:
  1. Pain level (ask for 1-10 scale)
  2. Medication adherence (are they taking medications as prescribed?)
  3. New or worsening symptoms
  4. Sleep and appetite
  5. Any questions for the doctor
  
  ESCALATION RULES:
  - Pain level ≥ 8: Use escalate_to_doctor tool immediately
  - Symptoms: fever, severe bleeding, difficulty breathing: Escalate immediately
  - Patient requests doctor callback: Use escalate_to_doctor tool
  
  TONE:
  - Warm and conversational
  - Patient and understanding
  - Never rush the patient
  - Use simple, non-medical language
  
  ============================================================
  ⛔ ABSOLUTE RULES - NEVER VIOLATE UNDER ANY CIRCUMSTANCES ⛔
  ============================================================
  
  YOU ARE NOT A MEDICAL PROFESSIONAL. YOU CANNOT AND MUST NOT:
  
  1. NEVER diagnose ANY condition or symptom
  2. NEVER recommend ANY treatment, medication, or remedy
  3. NEVER interpret symptoms as serious or not serious
  4. NEVER tell the patient what they "should" do medically
  5. NEVER say symptoms are "normal" or "nothing to worry about"
  6. NEVER suggest going to the ER (use escalate_to_doctor tool instead)
  7. NEVER advise on medication dosage or timing changes
  8. NEVER compare their situation to other patients
  9. NEVER provide reassurance about medical concerns
  10. NEVER answer "Is this normal?" questions with medical opinions
  
  APPROVED RESPONSES TO MEDICAL QUESTIONS:
  - "That's an important question for Dr. {{doctor_name}} to answer."
  - "I'll make sure to note that for Dr. {{doctor_name}}."
  - "I'm here to collect information, but Dr. {{doctor_name}} will review everything."
  - "Would you like me to flag this for a callback from the doctor's office?"
  
  IF PATIENT PUSHES FOR MEDICAL ADVICE:
  - "I understand you'd like an answer, but I'm not qualified to give medical advice. I promise Dr. {{doctor_name}} will get this information right away."
  
  ============================================================
  
  ADDITIONAL RULES:
  - DO NOT say "I'm an AI" unless directly asked
  - Always say "I'll make sure Dr. {{doctor_name}} gets this information"

End Call Message: |
  Thank you so much for talking with me today. 
  I'll make sure Dr. {{doctor_name}} gets all of this information.
  Take care, and don't hesitate to call the office if anything changes!
```

#### Vapi Function Tools

**Tool 1: log_symptom**
```json
{
  "name": "log_symptom",
  "description": "Log a symptom reported by the patient",
  "parameters": {
    "type": "object",
    "properties": {
      "symptom": {
        "type": "string",
        "description": "The symptom being reported"
      },
      "severity": {
        "type": "string",
        "enum": ["mild", "moderate", "severe"],
        "description": "Severity of the symptom"
      },
      "duration": {
        "type": "string",
        "description": "How long the symptom has been present"
      }
    },
    "required": ["symptom", "severity"]
  }
}
```

**Tool 2: escalate_to_doctor**
```json
{
  "name": "escalate_to_doctor",
  "description": "Immediately alert the doctor about an urgent concern",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "Why escalation is needed"
      },
      "urgency": {
        "type": "string",
        "enum": ["high", "critical"],
        "description": "Urgency level"
      }
    },
    "required": ["reason", "urgency"]
  }
}
```

**Tool 3: schedule_appointment**
```json
{
  "name": "schedule_appointment",
  "description": "Flag that the patient wants to schedule an appointment",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "Reason for appointment request"
      },
      "urgency": {
        "type": "string",
        "enum": ["routine", "soon", "urgent"],
        "description": "How soon they want to be seen"
      }
    },
    "required": ["reason"]
  }
}
```

#### Webhook Events to Handle
- `call.started` - Call initiated
- `call.ended` - Call completed
- `transcript.complete` - Full transcript available
- `function.called` - Tool invoked during call
- `recording.ready` - Recording URL available

---

## Backend Services

### Service Architecture

```
backend/
├── main.py                     # FastAPI application entry
├── config.py                   # Configuration management
├── database.py                 # MongoDB connection setup
│
├── api/
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── patients.py         # Patient CRUD
│   │   ├── calls.py            # Call management
│   │   ├── dashboard.py        # Dashboard data endpoints
│   │   └── webhooks.py         # External service webhooks
│   │
│   └── dependencies.py         # FastAPI dependencies
│
├── models/
│   ├── __init__.py
│   ├── doctor.py               # Doctor Pydantic models
│   ├── patient.py              # Patient Pydantic models
│   ├── call_log.py             # Call log models
│   └── patient_state.py        # State machine models
│
├── services/
│   ├── __init__.py
│   ├── vapi_service.py         # Vapi.ai integration
│   ├── voyage_service.py       # Voyage AI embeddings
│   ├── fireflies_service.py    # Fireflies.ai integration
│   ├── openai_service.py       # OpenAI GPT integration
│   ├── notification_service.py # Dashboard notifications
│   ├── vector_store.py         # MongoDB vector search
│   └── triage_agent.py         # Triage logic orchestration
│
├── workers/
│   ├── __init__.py
│   ├── scheduler.py            # APScheduler call scheduling
│   ├── call_processor.py       # Post-call processing
│   └── fireflies_processor.py  # Async Fireflies processing
│
└── utils/
    ├── __init__.py
    ├── security.py             # Password hashing, JWT
    └── helpers.py              # Utility functions
```

### Core Service Descriptions

#### `vapi_service.py`
- **trigger_outbound_call(patient_id)**: Initiates call via Vapi API
- **get_call_status(call_id)**: Retrieves call status
- **handle_webhook(payload)**: Processes incoming Vapi webhooks
- **build_assistant_context(patient)**: Constructs dynamic system prompt

#### `voyage_service.py`
- **generate_embedding(text)**: Creates embedding via Voyage AI
- **batch_embed(texts)**: Batch embedding generation
- **EMBEDDING_MODEL**: `voyage-large-2` (1024 dimensions)

#### `vector_store.py`
- **store_call_with_embedding(call_log)**: Saves call + vector
- **search_patient_history(query, patient_id, limit)**: Semantic search
- **get_similar_symptoms(symptom, patient_id)**: Find past symptom reports

#### `fireflies_service.py`
- **upload_audio(audio_url)**: Submit recording to Fireflies
- **get_transcript(meeting_id)**: Retrieve processed transcript
- **handle_webhook(payload)**: Process Fireflies completion webhook

#### `notification_service.py`
- **create_alert(doctor_id, patient_id, alert_type, message)**: Creates dashboard alert
- **get_active_alerts(doctor_id)**: Retrieves unacknowledged alerts
- **acknowledge_alert(alert_id, doctor_id)**: Marks alert as acknowledged
- **broadcast_to_dashboard(doctor_id, event)**: WebSocket push to frontend

#### `triage_agent.py`
- **analyze_call(transcript, patient_context)**: GPT-4 analysis
- **calculate_risk_score(extracted_data, patient_state)**: Risk scoring
- **determine_escalation(risk_score, symptoms)**: Escalation logic
- **update_patient_state(patient_id, call_analysis)**: State machine update

> ⚠️ **CRITICAL**: The triage agent performs INTERNAL risk assessment only. It NEVER communicates medical interpretations back to the patient. Risk scores and escalations are for the DOCTOR's eyes only. The patient only ever hears: "I'll make sure the doctor gets this information."

### Triage Agent Logic

```python
# Risk Score Calculation Rules (0-100)

BASE_SCORE = 20  # All post-op patients start at elevated baseline

PAIN_WEIGHTS = {
    1-3: 0,      # Normal post-op pain
    4-5: +10,    # Moderate concern
    6-7: +25,    # Significant concern  
    8-9: +40,    # High concern - escalate
    10: +50      # Critical - immediate escalate
}

SYMPTOM_WEIGHTS = {
    "fever": +30,
    "bleeding": +35,
    "difficulty_breathing": +50,
    "chest_pain": +50,
    "confusion": +40,
    "swelling": +15,
    "nausea": +10,
    "dizziness": +20
}

MEDICATION_WEIGHTS = {
    "full": 0,
    "partial": +15,
    "none": +25
}

TREND_MODIFIERS = {
    "pain_increasing": +15,
    "pain_stable": 0,
    "pain_decreasing": -10
}

# Risk Level Thresholds
LOW = 0-30
MEDIUM = 31-50
HIGH = 51-75
CRITICAL = 76-100
```

---

## Frontend Dashboard

### Page Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Redirect to /dashboard
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx        # Doctor login
│   │   └── register/
│   │       └── page.tsx        # Doctor registration
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main overview
│   │   │
│   │   ├── patients/
│   │   │   ├── page.tsx        # Patient list
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Add patient
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Patient detail
│   │   │       ├── calls/
│   │   │       │   └── page.tsx # Call history
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit patient
│   │   │
│   │   ├── calls/
│   │   │   └── page.tsx        # All calls view
│   │   │
│   │   ├── schedule/
│   │   │   └── page.tsx        # Call scheduling
│   │   │
│   │   └── settings/
│   │       └── page.tsx        # Doctor settings
│   │
│   └── api/                    # Next.js API routes (proxy)
│
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── notification-bell.tsx
│   │
│   ├── patients/
│   │   ├── patient-card.tsx
│   │   ├── patient-list.tsx
│   │   ├── patient-form.tsx
│   │   ├── risk-badge.tsx
│   │   └── patient-timeline.tsx
│   │
│   ├── calls/
│   │   ├── call-log-item.tsx
│   │   ├── transcript-viewer.tsx
│   │   ├── call-button.tsx
│   │   └── call-scheduler.tsx
│   │
│   └── dashboard/
│       ├── stats-cards.tsx
│       ├── risk-overview.tsx
│       ├── recent-calls.tsx
│       └── alerts-panel.tsx
│
├── lib/
│   ├── api.ts                  # API client
│   ├── auth.ts                 # Auth utilities
│   └── utils.ts                # Helper functions
│
├── hooks/
│   ├── use-patients.ts
│   ├── use-calls.ts
│   └── use-socket.ts
│
└── stores/
    └── notification-store.ts
```

### Dashboard Views

#### Main Dashboard (`/dashboard`)
- **Stats Cards**: Total patients, Calls today, Patients at risk, Pending calls
- **Risk Overview Chart**: Pie chart of risk distribution
- **Alerts Panel**: Active alerts requiring attention
- **Recent Calls**: Last 5 calls with quick summaries
- **Upcoming Calls**: Next scheduled calls

#### Patient List (`/patients`)
- **Grid/List Toggle**: Card view or table view
- **Filters**: Risk level, Surgery type, Last call date
- **Search**: By name or phone
- **Quick Actions**: Call now, View profile, Edit
- **Risk Badges**: Color-coded (Green/Yellow/Orange/Red)

#### Patient Detail (`/patients/[id]`)
- **Header**: Name, surgery info, risk badge, "Call Now" button
- **Tabs**:
  - Overview: Current status, vitals summary, doctor notes
  - Call History: Timeline of all calls with transcripts
  - Trends: Pain level chart, symptom frequency
  - Settings: Call schedule, preferences

#### Call History (`/patients/[id]/calls`)
- **Timeline View**: Chronological call list
- **Each Call Shows**:
  - Date/time and duration
  - AI Summary
  - Extracted data points
  - Risk assessment
  - Expandable full transcript

### Component Specifications

#### Risk Badge
```
Colors:
- Low (0-30):     Green  (#22c55e) - "Stable"
- Medium (31-50): Yellow (#eab308) - "Monitor"
- High (51-75):   Orange (#f97316) - "At Risk"
- Critical (76+): Red    (#ef4444) - "Urgent"
```

#### Call Button States
```
- Idle:       "Call Patient" (Blue)
- Calling:    "Calling..." (Blue, pulsing)
- In Call:    "In Progress" (Green)
- No Answer:  "Try Again" (Orange)
- Failed:     "Call Failed" (Red)
```

---

## Agent Orchestration Workflow

### Complete Call Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: CALL INITIATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Scheduler triggers call OR Doctor clicks "Call Now"                     │
│                           │                                                 │
│                           ▼                                                 │
│  2. Backend fetches patient context from MongoDB                            │
│     - Patient info, medications, surgery details                            │
│     - Previous call summaries (via Vector Search)                           │
│     - Current patient_state                                                 │
│                           │                                                 │
│                           ▼                                                 │
│  3. Build dynamic Vapi assistant context                                    │
│     - Inject patient name, surgery type, medications                        │
│     - Add previous concerns from vector search                              │
│     - Set appropriate focus areas                                           │
│                           │                                                 │
│                           ▼                                                 │
│  4. Trigger Vapi outbound call API                                          │
│     - POST /call with phone number and assistant config                     │
│     - Store call_id in scheduled_calls collection                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 2: LIVE CALL                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  5. Vapi handles the call                                                   │
│     - Speech-to-text in real-time                                           │
│     - GPT-4 generates responses                                             │
│     - Text-to-speech for patient                                            │
│                           │                                                 │
│                           ▼                                                 │
│  6. During call, Vapi may trigger tools                                     │
│     - log_symptom → Webhook to backend → Store in call_logs                 │
│     - escalate_to_doctor → Webhook → Dashboard alert to doctor              │
│     - schedule_appointment → Webhook → Flag in patient_state                │
│                           │                                                 │
│                           ▼                                                 │
│  7. Call ends                                                               │
│     - Vapi sends call.ended webhook                                         │
│     - Recording URL provided                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 3: POST-CALL PROCESSING                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  8. Immediate Processing (Sync)                                             │
│     - Save raw transcript to call_logs                                      │
│     - Update scheduled_calls status                                         │
│     - Update patient_state.last_call_date                                   │
│                           │                                                 │
│                           ▼                                                 │
│  9. Background Processing (Async via Celery)                                │
│                           │                                                 │
│     ┌─────────────────────┼─────────────────────┐                           │
│     │                     │                     │                           │
│     ▼                     ▼                     ▼                           │
│  Fireflies           GPT Analysis         Voyage Embedding                  │
│  Upload              Run triage           Generate vector                   │
│  recording           agent logic          for transcript                    │
│     │                     │                     │                           │
│     │                     ▼                     │                           │
│     │              Calculate risk               │                           │
│     │              score & level                │                           │
│     │                     │                     │                           │
│     │                     ▼                     │                           │
│     │              Update patient_state         │                           │
│     │                     │                     │                           │
│     │                     ▼                     │                           │
│     │              If HIGH/CRITICAL:            │                           │
│     │              Send Dashboard Alert         │                           │
│     │                     │                     │                           │
│     └─────────────────────┼─────────────────────┘                           │
│                           │                                                 │
│                           ▼                                                 │
│  10. Fireflies Webhook (Later)                                              │
│      - Receive structured summary                                           │
│      - Update call_logs.summary                                             │
│      - Embed summary with Voyage AI                                         │
│                           │                                                 │
│                           ▼                                                 │
│  11. Real-time Dashboard Update                                             │
│      - WebSocket notification to frontend                                   │
│      - Doctor sees updated patient card                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Machine Transitions

```
                    ┌─────────────┐
                    │   PRE_OP    │
                    └──────┬──────┘
                           │ Surgery completed
                           ▼
                    ┌─────────────┐
         ┌──────────│  RECOVERY   │──────────┐
         │          │   NORMAL    │          │
         │          └──────┬──────┘          │
         │                 │                 │
         │ Risk < 30       │ Risk 31-50      │ Risk > 50
         │                 │                 │
         ▼                 ▼                 ▼
  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
  │   STABLE    │◄──│   MONITOR   │──►│   AT_RISK   │
  └──────┬──────┘   └─────────────┘   └──────┬──────┘
         │                                    │
         │                                    │ Risk > 75
         │                                    ▼
         │                             ┌─────────────┐
         │                             │  CRITICAL   │
         │                             │  (Alert!)   │
         │                             └──────┬──────┘
         │                                    │
         │ Doctor marks                       │ Intervention
         │ as discharged                      │ successful
         │                                    │
         ▼                                    │
  ┌─────────────┐                             │
  │  DISCHARGED │◄────────────────────────────┘
  └─────────────┘
```

---

## API Specification

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new doctor |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current doctor profile |

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients (paginated) |
| POST | `/api/patients` | Create new patient |
| GET | `/api/patients/{id}` | Get patient detail |
| PUT | `/api/patients/{id}` | Update patient |
| DELETE | `/api/patients/{id}` | Delete patient |
| GET | `/api/patients/{id}/state` | Get patient state |
| GET | `/api/patients/{id}/calls` | Get patient call history |

### Call Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/calls/trigger/{patient_id}` | Trigger immediate call |
| GET | `/api/calls/{call_id}` | Get call details |
| GET | `/api/calls/{call_id}/transcript` | Get full transcript |
| GET | `/api/calls/scheduled` | List scheduled calls |
| POST | `/api/calls/schedule` | Schedule a new call |
| DELETE | `/api/calls/scheduled/{id}` | Cancel scheduled call |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/alerts` | Get active alerts |
| POST | `/api/dashboard/alerts/{id}/acknowledge` | Acknowledge alert |
| GET | `/api/dashboard/recent-calls` | Get recent calls |

### Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/vapi` | Vapi event webhook |
| POST | `/api/webhooks/fireflies` | Fireflies completion webhook |

### Search Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search/patient-history` | Semantic search in call logs |

---

## Third-Party Integrations

### Vapi.ai Integration

**Setup Requirements:**
1. Create Vapi account at vapi.ai
2. Purchase phone number ($1-2/month)
3. Create API key
4. Set server URL for webhooks

**API Usage:**
```
Base URL: https://api.vapi.ai
Auth: Bearer token

Key Endpoints:
- POST /call - Trigger outbound call
- GET /call/{id} - Get call status
- POST /assistant - Create/update assistant
```

**Environment Variables:**
```
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=
VAPI_ASSISTANT_ID=
VAPI_WEBHOOK_SECRET=
```

### Voyage AI Integration

**Setup Requirements:**
1. Create account at voyageai.com
2. Generate API key
3. Use voyage-large-2 model (1024 dimensions)

**API Usage:**
```python
import voyageai

client = voyageai.Client(api_key=VOYAGE_API_KEY)
embeddings = client.embed(
    texts=["patient transcript here"],
    model="voyage-large-2"
)
```

**Environment Variables:**
```
VOYAGE_API_KEY=
```

### Fireflies.ai Integration

**Setup Requirements:**
1. Create account at fireflies.ai
2. Generate API key
3. Configure webhook URL

**GraphQL API:**
```
Endpoint: https://api.fireflies.ai/graphql
Auth: Bearer token

Key Operations:
- mutation uploadAudio - Submit recording
- query transcript - Get processed transcript
```

**Environment Variables:**
```
FIREFLIES_API_KEY=
FIREFLIES_WEBHOOK_SECRET=
```

### OpenAI Integration

**Usage:**
- Model: GPT-4o for triage analysis
- Temperature: 0.3 (deterministic for medical context)

**Environment Variables:**
```
OPENAI_API_KEY=
```

---

## Security & Compliance

### ⚠️ MEDICAL ADVICE PROHIBITION - LEGAL COMPLIANCE

> **THE VOICE AGENT MUST NEVER PROVIDE MEDICAL ADVICE. THIS IS A LEGAL AND SAFETY REQUIREMENT.**

This system is a **data collection tool**, not a telehealth service. The agent:
- Is NOT a licensed medical professional
- CANNOT diagnose, treat, or advise
- Must ONLY collect and relay information to the physician
- Must redirect ALL medical questions to the doctor

**Liability Note:** Any medical advice provided by the AI could expose the healthcare provider to malpractice claims. The system must be designed to make it technically impossible for the agent to provide medical guidance.

**Implementation Safeguards:**
1. System prompts explicitly prohibit medical advice (multiple reinforcements)
2. Response filtering to catch and block medical recommendations
3. Approved response templates for medical questions
4. Audit logs to verify compliance
5. Regular prompt testing to ensure no advice leakage

---

### HIPAA Considerations

**Note:** This is a hackathon prototype. Full HIPAA compliance requires additional measures for production.

**Implemented Security Measures:**

1. **Data Encryption**
   - All data in transit via HTTPS/TLS 1.3
   - MongoDB Atlas encryption at rest
   - Sensitive fields encrypted at application level

2. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - Session timeout after 30 minutes

3. **Audit Logging**
   - All data access logged
   - Call logs immutable
   - Doctor actions tracked

4. **Data Minimization**
   - Only collect necessary health information
   - No storage of full medical records
   - Call recordings auto-delete after 30 days

5. **Access Controls**
   - Doctors only see their own patients
   - No shared logins
   - API rate limiting

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=postop_guardian

# Authentication
JWT_SECRET=<random-256-bit-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Voice & AI Services
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=
VAPI_ASSISTANT_ID=
VAPI_WEBHOOK_SECRET=

VOYAGE_API_KEY=

FIREFLIES_API_KEY=
FIREFLIES_WEBHOOK_SECRET=

OPENAI_API_KEY=

# Application
APP_ENV=development
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Feature Roadmap

### Phase 1: MVP (Hackathon Submission)
- [x] MongoDB schema design
- [ ] Doctor authentication
- [ ] Patient CRUD operations
- [ ] Vapi voice agent integration
- [ ] Basic triage logic
- [ ] Frontend dashboard
- [ ] Manual call trigger
- [ ] Real-time dashboard alerts for high-risk patients

### Phase 2: Enhanced Intelligence
- [ ] Voyage AI embeddings
- [ ] MongoDB Vector Search
- [ ] Fireflies.ai integration
- [ ] Semantic search in patient history
- [ ] Trend analysis charts

### Phase 3: Automation
- [ ] Scheduled call automation
- [ ] Call retry logic
- [ ] Voicemail detection
- [ ] Missed call follow-up

### Phase 4: Advanced Features
- [ ] Multilingual support (Spanish, Mandarin)
- [ ] Family member notifications
- [ ] Appointment scheduling integration
- [ ] Mobile app for doctors
- [ ] Real-time call monitoring

### Phase 5: Enterprise
- [ ] Multi-practice support
- [ ] Custom voice personas
- [ ] Integration with EHR systems
- [ ] Advanced analytics dashboard
- [ ] Compliance reporting

---

## Environment Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Vapi.ai account
- OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Development Tools
```bash
# Start ngrok for webhooks
ngrok http 8000

# Update Vapi webhook URL to ngrok URL
```

---

## Deployment Strategy

### Recommended Stack
- **Backend**: Railway or Render (Python FastAPI)
- **Frontend**: Vercel (Next.js)
- **Database**: MongoDB Atlas (already cloud-based)
- **Redis**: Railway or Upstash

### Environment Configuration
- Separate environments: development, staging, production
- Environment-specific MongoDB databases
- Secure secret management via platform

### Monitoring
- Sentry for error tracking
- MongoDB Atlas monitoring
- Custom health check endpoints

---

## Appendix

### Useful Links
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Vapi.ai Documentation](https://docs.vapi.ai)
- [Voyage AI](https://www.voyageai.com)
- [Fireflies.ai API](https://docs.fireflies.ai)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)

### Glossary
- **Triage**: The process of determining the urgency of patient needs (INTERNAL ONLY - never communicated to patient)
- **Escalation**: Alerting the doctor when risk thresholds are exceeded (NOT telling the patient to go to the ER)
- **RAG**: Retrieval-Augmented Generation - using past data to inform AI responses
- **Vector Search**: Semantic similarity search using embeddings
- **No Medical Advice**: The absolute prohibition on the AI providing any diagnosis, treatment recommendation, symptom interpretation, or clinical guidance. This is the system's #1 rule.
- **Data Collection Only**: The agent's sole purpose - gathering information to relay to the physician, never interpreting or acting on that information

---

*Document Version: 1.0*
*Last Updated: January 10, 2026*
*Author: Post-Op Guardian Team*

