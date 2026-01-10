# Patient Pydantic models
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from bson import ObjectId

class PyObjectId(ObjectId):
    """Custom ObjectId for Pydantic"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    start_date: Optional[date] = None

class EmergencyContact(BaseModel):
    name: str
    relationship: str
    phone: str

class CallSchedule(BaseModel):
    frequency: str = Field(default="daily", description="daily | every_other_day | weekly")
    preferred_time: str = Field(default="09:00", description="Time in HH:MM format")
    timezone: str = Field(default="America/New_York")
    enabled: bool = Field(default=True)

class PatientCreate(BaseModel):
    """Schema for creating a new patient"""
    doctor_id: str = Field(..., description="Doctor ID as string (will be converted to ObjectId)")
    
    # Demographics
    first_name: str
    last_name: str
    date_of_birth: date
    phone: str
    email: Optional[EmailStr] = None
    preferred_language: str = Field(default="en", description="Language code: en, es, zh, etc.")
    
    # Medical Information
    surgery_type: str
    surgery_date: date
    medications: List[Medication] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    conditions: List[str] = Field(default_factory=list)
    
    # Emergency Contact
    emergency_contact: Optional[EmergencyContact] = None
    
    # Call Scheduling
    call_schedule: Optional[CallSchedule] = None
    
    # Doctor Notes
    notes: Optional[str] = None

class PatientResponse(BaseModel):
    """Schema for patient response"""
    id: str = Field(alias="_id")
    doctor_id: str
    
    # Demographics
    first_name: str
    last_name: str
    date_of_birth: date
    phone: str
    email: Optional[str] = None
    preferred_language: str
    
    # Medical Information
    surgery_type: str
    surgery_date: date
    medications: List[Medication]
    allergies: List[str]
    conditions: List[str]
    
    # Emergency Contact
    emergency_contact: Optional[EmergencyContact] = None
    
    # Call Scheduling
    call_schedule: Optional[CallSchedule] = None
    
    # Doctor Notes
    notes: Optional[str] = None
    
    # Metadata
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if isinstance(v, datetime) else v,
            date: lambda v: v.isoformat() if isinstance(v, date) else v
        }
        
    @classmethod
    def from_mongo(cls, data: dict):
        """Helper method to create PatientResponse from MongoDB document"""
        # Create a copy to avoid modifying the original
        data = dict(data)
        # Convert ObjectIds to strings
        if "_id" in data and isinstance(data["_id"], ObjectId):
            data["_id"] = str(data["_id"])
        if "doctor_id" in data and isinstance(data["doctor_id"], ObjectId):
            data["doctor_id"] = str(data["doctor_id"])
        
        # Convert datetime fields back to date for date_of_birth and surgery_date
        if "date_of_birth" in data and isinstance(data["date_of_birth"], datetime):
            data["date_of_birth"] = data["date_of_birth"].date()
        if "surgery_date" in data and isinstance(data["surgery_date"], datetime):
            data["surgery_date"] = data["surgery_date"].date()
        
        # Convert medication start_date fields if present
        if "medications" in data and data["medications"]:
            for med in data["medications"]:
                if med.get("start_date") and isinstance(med["start_date"], datetime):
                    med["start_date"] = med["start_date"].date()
        
        return cls(**data)