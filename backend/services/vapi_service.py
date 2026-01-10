# Vapi.ai integration
import httpx
import logging
from typing import Optional, Dict, Any
from config import settings
from database import get_database
from bson import ObjectId

logger = logging.getLogger(__name__)

VAPI_BASE_URL = settings.VAPI_BASE_URL
VAPI_API_KEY = settings.VAPI_API_KEY


async def create_call(
    patient_id: str,
    patient_phone: str,
    assistant_id: Optional[str] = None,
    phone_number_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create an outbound call using Vapi.ai API
    
    Args:
        patient_id: The patient's MongoDB ObjectId as string
        patient_phone: The patient's phone number (E.164 format, e.g., +15551234567)
        assistant_id: Optional Vapi assistant ID (defaults to config)
        phone_number_id: Optional Vapi phone number ID (defaults to config)
        metadata: Optional metadata to pass with the call
        
    Returns:
        Dict containing the Vapi call response with call_id and status
        
    Raises:
        ValueError: If required configuration is missing
        Exception: If the API call fails
    """
    if not VAPI_API_KEY:
        raise ValueError("VAPI_API_KEY is not configured. Please set it in your environment variables.")
    
    # Use provided IDs or fall back to config defaults
    assistant_id = assistant_id or settings.VAPI_ASSISTANT_ID
    phone_number_id = phone_number_id or settings.VAPI_PHONE_NUMBER_ID
    
    if not assistant_id:
        raise ValueError("Assistant ID is required. Either provide it or set VAPI_ASSISTANT_ID in environment.")
    
    if not phone_number_id:
        raise ValueError("Phone number ID is required. Either provide it or set VAPI_PHONE_NUMBER_ID in environment.")
    
    # Prepare the call payload
    call_payload = {
        "assistantId": assistant_id,
        "phoneNumberId": phone_number_id,
        "customer": {
            "number": patient_phone
        }
    }
    
    # Add metadata if provided (useful for tracking patient_id in webhooks)
    if metadata:
        call_payload["metadata"] = metadata
    else:
        call_payload["metadata"] = {
            "patient_id": patient_id
        }
    
    # Make the API request
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        logger.info(f"Creating Vapi call for patient {patient_id} to {patient_phone}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{VAPI_BASE_URL}/call",
                json=call_payload,
                headers=headers
            )
            response.raise_for_status()
            call_data = response.json()
            
            logger.info(f"Successfully created Vapi call. Call ID: {call_data.get('id')}")
            return call_data
            
    except httpx.HTTPStatusError as e:
        error_msg = f"Vapi API error: {e.response.status_code} - {e.response.text}"
        logger.error(error_msg)
        raise Exception(error_msg) from e
    except httpx.RequestError as e:
        error_msg = f"Failed to connect to Vapi API: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg) from e
    except Exception as e:
        logger.error(f"Unexpected error creating Vapi call: {str(e)}", exc_info=True)
        raise


async def create_call_for_patient(
    patient_id: str,
    patient_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create a call for a patient by fetching their data and building appropriate context.
    This is a higher-level function that prepares the call with patient context.
    
    Args:
        patient_id: The patient's MongoDB ObjectId as string
        patient_data: Optional patient data dict. If not provided, will fetch from database.
        
    Returns:
        Dict containing the Vapi call response
    """
    # Fetch patient data if not provided
    if patient_data is None:
        db = get_database()
        try:
            patient_obj_id = ObjectId(patient_id)
        except Exception as e:
            raise ValueError(f"Invalid patient_id format: {patient_id}") from e
        
        patient = db.patients.find_one({"_id": patient_obj_id})
        if not patient:
            raise ValueError(f"Patient with id {patient_id} not found")
        
        patient_data = patient
    
    # Extract phone number
    patient_phone = patient_data.get("phone")
    if not patient_phone:
        raise ValueError(f"Patient {patient_id} does not have a phone number")
    
    # Ensure phone number is in E.164 format (add + if missing)
    if not patient_phone.startswith("+"):
        # Assume US number if no country code
        if patient_phone.startswith("1") and len(patient_phone) == 11:
            patient_phone = "+" + patient_phone
        elif len(patient_phone) == 10:
            patient_phone = "+1" + patient_phone
        else:
            logger.warning(f"Phone number {patient_phone} may not be in E.164 format")
    
    # Build metadata with patient context for webhook handling
    metadata = {
        "patient_id": patient_id,
        "patient_name": f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}".strip(),
        "doctor_id": str(patient_data.get("doctor_id", ""))
    }
    
    # Create the call
    return await create_call(
        patient_id=patient_id,
        patient_phone=patient_phone,
        metadata=metadata
    )


async def get_call_status(call_id: str) -> Dict[str, Any]:
    """
    Get the status of a Vapi call
    
    Args:
        call_id: The Vapi call ID
        
    Returns:
        Dict containing call status and details
    """
    if not VAPI_API_KEY:
        raise ValueError("VAPI_API_KEY is not configured")
    
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{VAPI_BASE_URL}/call/{call_id}",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
            
    except httpx.HTTPStatusError as e:
        error_msg = f"Vapi API error getting call status: {e.response.status_code} - {e.response.text}"
        logger.error(error_msg)
        raise Exception(error_msg) from e
    except Exception as e:
        logger.error(f"Error getting call status: {str(e)}", exc_info=True)
        raise