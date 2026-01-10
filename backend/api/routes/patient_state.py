# Patient state CRUD endpoints
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from models.patient_state import PatientStateCreate, PatientStateResponse, PatientStateUpdate
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/patient-states", tags=["patient-states"])

@router.post("", response_model=PatientStateResponse, status_code=status.HTTP_201_CREATED)
async def create_patient_state(state_data: PatientStateCreate):
    """
    Create a new patient state in MongoDB
    
    - **patient_id**: ID of the patient this state belongs to
    - **status**: Patient workflow status (pre_op, recovery_normal, recovery_at_risk, stable, discharged)
    - **risk_score**: Risk score from 0-100
    - **risk_level**: Risk level (low, medium, high, critical)
    """
    try:
        # Validate patient_id is a valid ObjectId
        try:
            patient_object_id = ObjectId(state_data.patient_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_id format: {state_data.patient_id}"
            )
        
        db = get_database()
        
        # Check if patient exists
        patient = db.patients.find_one({"_id": patient_object_id})
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with id {state_data.patient_id} not found"
            )
        
        # Check if patient_state already exists for this patient
        existing_state = db.patient_state.find_one({"patient_id": patient_object_id})
        if existing_state:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Patient state already exists for patient {state_data.patient_id}. Use PUT or PATCH to update."
            )
        
        # Prepare patient state document
        state_doc = state_data.model_dump(exclude={"patient_id"})
        state_doc["patient_id"] = patient_object_id
        state_doc["updated_at"] = datetime.utcnow()
        
        # Convert acknowledged_by strings to ObjectIds in active_alerts if present
        if state_doc.get("active_alerts"):
            for alert in state_doc["active_alerts"]:
                if alert.get("acknowledged_by") and isinstance(alert["acknowledged_by"], str):
                    try:
                        alert["acknowledged_by"] = ObjectId(alert["acknowledged_by"])
                    except InvalidId:
                        logger.warning(f"Invalid acknowledged_by ObjectId in alert: {alert.get('acknowledged_by')}")
                        alert["acknowledged_by"] = None
        
        # Insert patient state into MongoDB
        result = db.patient_state.insert_one(state_doc)
        
        # Retrieve the created patient state
        created_state = db.patient_state.find_one({"_id": result.inserted_id})
        
        if not created_state:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created patient state"
            )
        
        # Convert to response model
        return PatientStateResponse.from_mongo(created_state)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating patient state: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating patient state: {str(e)}"
        )

@router.get("/{patient_state_id}", response_model=PatientStateResponse)
async def get_patient_state(patient_state_id: str):
    """Get a patient state by ID"""
    try:
        try:
            state_object_id = ObjectId(patient_state_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_state_id format: {patient_state_id}"
            )
        
        db = get_database()
        patient_state = db.patient_state.find_one({"_id": state_object_id})
        
        if not patient_state:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient state with id {patient_state_id} not found"
            )
        
        return PatientStateResponse.from_mongo(patient_state)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving patient state: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving patient state: {str(e)}"
        )

@router.get("/patient/{patient_id}", response_model=PatientStateResponse)
async def get_patient_state_by_patient_id(patient_id: str):
    """Get a patient state by patient ID"""
    try:
        try:
            patient_object_id = ObjectId(patient_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_id format: {patient_id}"
            )
        
        db = get_database()
        patient_state = db.patient_state.find_one({"patient_id": patient_object_id})
        
        if not patient_state:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient state for patient id {patient_id} not found"
            )
        
        return PatientStateResponse.from_mongo(patient_state)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving patient state: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving patient state: {str(e)}"
        )
