# Call management endpoints
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from pydantic import BaseModel

from workers.scheduler import get_eligible_patients_for_calls
from models.patient import PatientResponse
from services.vapi_service import create_call_for_patient, create_call
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/calls", tags=["calls"])


class CreateCallRequest(BaseModel):
    """Request model for creating a call"""
    patient_id: str
    patient_phone: Optional[str] = None  # Optional, will use patient's phone if not provided


class CallResponse(BaseModel):
    """Response model for call creation"""
    call_id: str
    status: str
    patient_id: str
    patient_phone: str
    message: str

@router.post("/fetch-eligible-patients", response_model=List[PatientResponse])
async def fetch_eligible_patients():
    """
    Manually trigger fetching of eligible patients for scheduled calls.
    
    This endpoint:
    1. Calls the same logic used by the cron job to find eligible patients
    2. Returns the list of patients that are eligible for calls based on their call_schedules
    
    Returns:
        List of eligible patient objects
    """
    try:
        logger.info("API endpoint triggered: fetch_eligible_patients")
        
        # Get eligible patients using the scheduler function
        eligible_patients = await get_eligible_patients_for_calls()
        
        # Convert MongoDB documents to PatientResponse models
        patient_responses = []
        for patient in eligible_patients:
            try:
                # Convert ObjectId to string for response
                patient["_id"] = str(patient["_id"])
                if "doctor_id" in patient and isinstance(patient["doctor_id"], ObjectId):
                    patient["doctor_id"] = str(patient["doctor_id"])
                
                # Use the PatientResponse model to format the response
                patient_response = PatientResponse.from_mongo(patient)
                patient_responses.append(patient_response)
            except Exception as e:
                logger.warning(f"Error converting patient {patient.get('_id')} to response: {str(e)}")
                continue
        
        logger.info(f"Returning {len(patient_responses)} eligible patients")
        return patient_responses
        
    except Exception as e:
        logger.error(f"Error in fetch_eligible_patients endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching eligible patients: {str(e)}"
        )


@router.post("/trigger", response_model=CallResponse)
async def trigger_call(request: CreateCallRequest):
    """
    Trigger an immediate outbound call to a patient using Vapi.ai.
    
    This endpoint:
    1. Validates the patient exists
    2. Retrieves patient information
    3. Creates an outbound call via Vapi API
    4. Returns the call ID and status
    
    Args:
        request: CreateCallRequest with patient_id and optional patient_phone
    
    Returns:
        CallResponse with call_id, status, and patient information
    """
    try:
        logger.info(f"Triggering call for patient {request.patient_id}")
        
        # Validate patient_id format
        try:
            patient_object_id = ObjectId(request.patient_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_id format: {request.patient_id}"
            ) from e
        
        # Fetch patient data
        db = get_database()
        patient = db.patients.find_one({"_id": patient_object_id})
        
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with id {request.patient_id} not found"
            )
        
        # Use provided phone or patient's phone from database
        patient_phone = request.patient_phone or patient.get("phone")
        
        if not patient_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient phone number is required. Provide patient_phone or ensure patient has phone number in database."
            )
        
        # Create the call
        try:
            if request.patient_phone:
                # If phone is explicitly provided, use simpler create_call
                call_data = await create_call(
                    patient_id=request.patient_id,
                    patient_phone=patient_phone
                )
            else:
                # Use the higher-level function that includes patient context
                call_data = await create_call_for_patient(
                    patient_id=request.patient_id,
                    patient_data=patient
                )
            
            call_id = call_data.get("id", "")
            call_status = call_data.get("status", "unknown")
            
            logger.info(f"Successfully triggered call {call_id} for patient {request.patient_id}")
            
            return CallResponse(
                call_id=call_id,
                status=call_status,
                patient_id=request.patient_id,
                patient_phone=patient_phone,
                message=f"Call created successfully. Call ID: {call_id}"
            )
            
        except ValueError as e:
            # Configuration errors
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Vapi configuration error: {str(e)}"
            ) from e
        except Exception as e:
            # API errors
            logger.error(f"Error creating Vapi call: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create call: {str(e)}"
            ) from e
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in trigger_call endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )
