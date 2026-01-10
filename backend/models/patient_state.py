# Patient state Pydantic models
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class ReportedSymptom(BaseModel):
    """Model for reported symptoms"""
    symptom: str
    severity: str = Field(description="mild | moderate | severe")
    first_reported: datetime
    last_reported: datetime
    occurrence_count: int = Field(default=1, ge=1)

class ActiveAlert(BaseModel):
    """Model for active alerts"""
    type: str = Field(description="high_pain | missed_medication | new_symptom")
    message: str
    created_at: datetime
    acknowledged: bool = Field(default=False)
    acknowledged_by: Optional[str] = None  # Doctor ID as string
    acknowledged_at: Optional[datetime] = None

class PainTrend(BaseModel):
    """Model for pain trend data points"""
    date: datetime
    value: int = Field(ge=0, le=10, description="Pain level 0-10")

class PatientStateCreate(BaseModel):
    """Schema for creating a new patient state"""
    patient_id: str = Field(..., description="Patient ID as string (will be converted to ObjectId)")
    
    # Workflow State
    status: str = Field(
        default="pre_op",
        description="pre_op | recovery_normal | recovery_at_risk | stable | discharged"
    )
    risk_score: int = Field(default=0, ge=0, le=100, description="Risk score 0-100")
    risk_level: str = Field(
        default="low",
        description="low | medium | high | critical"
    )
    
    # Recovery Metrics (Latest)
    latest_pain_level: Optional[int] = Field(None, ge=0, le=10, description="Pain level 1-10")
    medication_adherence: Optional[str] = Field(None, description="full | partial | none")
    mobility_status: Optional[str] = Field(None, description="immobile | limited | normal")
    appetite_status: Optional[str] = Field(None, description="none | poor | normal | good")
    sleep_quality: Optional[str] = Field(None, description="poor | fair | good")
    
    # Symptom Tracking
    reported_symptoms: List[ReportedSymptom] = Field(default_factory=list)
    
    # Alerts & Flags
    active_alerts: List[ActiveAlert] = Field(default_factory=list)
    
    # Call History Summary
    total_calls: int = Field(default=0, ge=0)
    successful_calls: int = Field(default=0, ge=0)
    last_call_date: Optional[datetime] = None
    next_scheduled_call: Optional[datetime] = None
    
    # Trend Data
    pain_trend: List[PainTrend] = Field(default_factory=list, max_items=7)
    
    # Metadata
    days_since_surgery: Optional[int] = Field(None, ge=0)

class PatientStateUpdate(BaseModel):
    """Schema for updating patient state (all fields optional)"""
    status: Optional[str] = Field(None, description="pre_op | recovery_normal | recovery_at_risk | stable | discharged")
    risk_score: Optional[int] = Field(None, ge=0, le=100)
    risk_level: Optional[str] = Field(None, description="low | medium | high | critical")
    
    latest_pain_level: Optional[int] = Field(None, ge=0, le=10)
    medication_adherence: Optional[str] = Field(None, description="full | partial | none")
    mobility_status: Optional[str] = Field(None, description="immobile | limited | normal")
    appetite_status: Optional[str] = Field(None, description="none | poor | normal | good")
    sleep_quality: Optional[str] = Field(None, description="poor | fair | good")
    
    reported_symptoms: Optional[List[ReportedSymptom]] = None
    active_alerts: Optional[List[ActiveAlert]] = None
    
    total_calls: Optional[int] = Field(None, ge=0)
    successful_calls: Optional[int] = Field(None, ge=0)
    last_call_date: Optional[datetime] = None
    next_scheduled_call: Optional[datetime] = None
    
    pain_trend: Optional[List[PainTrend]] = None
    days_since_surgery: Optional[int] = Field(None, ge=0)

class PatientStateResponse(BaseModel):
    """Schema for patient state response"""
    id: str = Field(alias="_id")
    patient_id: str
    
    # Workflow State
    status: str
    risk_score: int
    risk_level: str
    
    # Recovery Metrics (Latest)
    latest_pain_level: Optional[int] = None
    medication_adherence: Optional[str] = None
    mobility_status: Optional[str] = None
    appetite_status: Optional[str] = None
    sleep_quality: Optional[str] = None
    
    # Symptom Tracking
    reported_symptoms: List[ReportedSymptom]
    
    # Alerts & Flags
    active_alerts: List[ActiveAlert]
    
    # Call History Summary
    total_calls: int
    successful_calls: int
    last_call_date: Optional[datetime] = None
    next_scheduled_call: Optional[datetime] = None
    
    # Trend Data
    pain_trend: List[PainTrend]
    
    # Metadata
    days_since_surgery: Optional[int] = None
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if isinstance(v, datetime) else v
        }
    
    @classmethod
    def from_mongo(cls, data: dict):
        """Helper method to create PatientStateResponse from MongoDB document"""
        # Create a copy to avoid modifying the original
        data = dict(data)
        # Convert ObjectIds to strings
        if "_id" in data and isinstance(data["_id"], ObjectId):
            data["_id"] = str(data["_id"])
        if "patient_id" in data and isinstance(data["patient_id"], ObjectId):
            data["patient_id"] = str(data["patient_id"])
        
        # Convert acknowledged_by ObjectIds in active_alerts
        if "active_alerts" in data and data["active_alerts"]:
            for alert in data["active_alerts"]:
                if alert.get("acknowledged_by") and isinstance(alert["acknowledged_by"], ObjectId):
                    alert["acknowledged_by"] = str(alert["acknowledged_by"])
        
        return cls(**data)
