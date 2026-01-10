# Patient CRUD endpoints
from fastapi import APIRouter, HTTPException, status
from datetime import datetime, date, time
from bson import ObjectId
from bson.errors import InvalidId

from models.patient import PatientCreate, PatientResponse
from database import get_database

router = APIRouter(prefix="/api/v1/patients", tags=["patients"])

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(patient_data: PatientCreate):
    """
    Create a new patient in MongoDB
    
    - **doctor_id**: ID of the doctor who owns this patient
    - **first_name**, **last_name**: Patient's name
    - **date_of_birth**: Patient's date of birth
    - **phone**: Primary contact phone number
    - **surgery_type**: Type of surgery
    - **surgery_date**: Date of surgery
    """
    try:
        # Validate doctor_id is a valid ObjectId
        try:
            doctor_object_id = ObjectId(patient_data.doctor_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid doctor_id format: {patient_data.doctor_id}"
            )
        
        db = get_database()
        
        # Prepare patient document
        patient_doc = patient_data.model_dump(exclude={"doctor_id"})
        patient_doc["doctor_id"] = doctor_object_id
        patient_doc["created_at"] = datetime.utcnow()
        patient_doc["updated_at"] = datetime.utcnow()
        
        # Convert date fields to datetime (MongoDB requirement)
        if isinstance(patient_doc.get("date_of_birth"), date):
            patient_doc["date_of_birth"] = datetime.combine(patient_doc["date_of_birth"], time.min)
        if isinstance(patient_doc.get("surgery_date"), date):
            patient_doc["surgery_date"] = datetime.combine(patient_doc["surgery_date"], time.min)
        
        # Convert medication start_date fields if present
        if patient_doc.get("medications"):
            for med in patient_doc["medications"]:
                if med.get("start_date") and isinstance(med["start_date"], date):
                    med["start_date"] = datetime.combine(med["start_date"], time.min)
        
        # Set default call_schedule if not provided
        if patient_doc.get("call_schedule") is None:
            patient_doc["call_schedule"] = {
                "frequency": "daily",
                "preferred_time": "09:00",
                "timezone": "America/New_York",
                "enabled": True
            }
        
        # Insert patient into MongoDB
        result = db.patients.insert_one(patient_doc)
        
        # Retrieve the created patient
        created_patient = db.patients.find_one({"_id": result.inserted_id})
        
        if not created_patient:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created patient"
            )
        
        # Convert ObjectId to string for response using helper method
        return PatientResponse.from_mongo(created_patient)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating patient: {str(e)}"
        )

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: str):
    """Get a patient by ID"""
    try:
        # Validate patient_id is a valid ObjectId
        try:
            patient_object_id = ObjectId(patient_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_id format: {patient_id}"
            )
        
        db = get_database()
        patient = db.patients.find_one({"_id": patient_object_id})
        
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with id {patient_id} not found"
            )
        
        # Convert ObjectId to string for response using helper method
        return PatientResponse.from_mongo(patient)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving patient: {str(e)}"
        )
