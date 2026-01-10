# External service webhooks (Vapi, Fireflies)
from fastapi import APIRouter, HTTPException, status, Request, Header
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from database import get_database
from config import settings
import logging
import hmac
import hashlib
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


def verify_vapi_webhook_signature(payload: bytes, signature: Optional[str]) -> bool:
    """
    Verify Vapi webhook signature for security.
    
    Args:
        payload: Raw request body as bytes
        signature: X-Vapi-Signature header value
        
    Returns:
        True if signature is valid, False otherwise
    """
    if not settings.VAPI_WEBHOOK_SECRET:
        # If no secret configured, skip verification (for development)
        logger.warning("VAPI_WEBHOOK_SECRET not configured, skipping signature verification")
        return True
    
    if not signature:
        logger.warning("No signature provided in webhook request")
        return False
    
    try:
        # Vapi uses HMAC-SHA256 for webhook signatures
        expected_signature = hmac.new(
            settings.VAPI_WEBHOOK_SECRET.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Use constant-time comparison to prevent timing attacks
        return hmac.compare_digest(signature, expected_signature)
    except Exception as e:
        logger.error(f"Error verifying webhook signature: {str(e)}")
        return False


@router.post("/vapi")
async def handle_vapi_webhook(
    request: Request,
    x_vapi_signature: Optional[str] = Header(None, alias="x-vapi-signature")
):
    """
    Handle incoming Vapi webhook events.
    
    This endpoint receives webhook events from Vapi.ai when calls are:
    - Started (call.started)
    - Ended (call.ended)
    - Updated (call.updated)
    - Failed (call.failed)
    
    The webhook payload is stored in the patient's history array.
    
    Args:
        request: FastAPI request object
        x_vapi_signature: Optional webhook signature header for verification
        
    Returns:
        Success response
    """
    try:
        # Get raw request body for signature verification (must be done before parsing JSON)
        body_bytes = await request.body()
        
        # Verify webhook signature if secret is configured
        if settings.VAPI_WEBHOOK_SECRET and x_vapi_signature:
            if not verify_vapi_webhook_signature(body_bytes, x_vapi_signature):
                logger.warning("Invalid webhook signature received")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid webhook signature"
                )
        
        # Parse webhook payload
        try:
            payload = json.loads(body_bytes.decode('utf-8'))
        except Exception as e:
            logger.error(f"Failed to parse webhook payload as JSON: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON payload"
            ) from e
        
        logger.info(f"Received Vapi webhook: {payload.get('type', 'unknown')}")
        
        # Extract call information
        # Vapi webhook structure: { "type": "call.ended", "call": { "id": "...", "metadata": {...}, ... } }
        call_data = payload.get("call", {})
        call_id = call_data.get("id") or payload.get("id")  # Try both locations
        event_type = payload.get("type", "unknown")
        
        if not call_id:
            logger.warning(f"Webhook payload missing call.id. Payload keys: {list(payload.keys())}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing call.id in webhook payload"
            )
        
        # Extract patient_id from metadata (we set this when creating the call)
        # Metadata can be in call.metadata or at top level
        metadata = call_data.get("metadata") or payload.get("metadata") or {}
        patient_id_str = metadata.get("patient_id")
        
        if not patient_id_str:
            logger.warning(f"Webhook for call {call_id} missing patient_id in metadata")
            # Still process the webhook but log the issue
            # In production, you might want to return an error or store in a different collection
            return {
                "status": "received",
                "message": "Webhook received but patient_id not found in metadata",
                "call_id": call_id
            }
        
        # Validate patient_id format
        try:
            patient_object_id = ObjectId(patient_id_str)
        except Exception as e:
            logger.error(f"Invalid patient_id format in webhook metadata: {patient_id_str}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid patient_id format: {patient_id_str}"
            ) from e
        
        # Get database
        db = get_database()
        
        # Verify patient exists
        patient = db.patients.find_one({"_id": patient_object_id})
        if not patient:
            logger.error(f"Patient {patient_id_str} not found for webhook call {call_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient {patient_id_str} not found"
            )
        
        # Prepare history entry
        history_entry = {
            "event_type": event_type,
            "call_id": call_id,
            "timestamp": datetime.utcnow(),
            "webhook_data": payload,  # Store full webhook payload for reference
            "call_status": call_data.get("status"),
            "call_duration": call_data.get("duration"),
            "recording_url": call_data.get("recordingUrl"),
            "transcript": call_data.get("transcript"),
            "summary": call_data.get("summary"),
        }
        
        # Add to patient's history array
        # Initialize history array if it doesn't exist
        update_result = db.patients.update_one(
            {"_id": patient_object_id},
            {
                "$push": {"history": history_entry},
                "$set": {
                    "updated_at": datetime.utcnow(),
                    "last_call_event": event_type,
                    "last_call_timestamp": datetime.utcnow()
                }
            }
        )
        
        if update_result.matched_count == 0:
            logger.error(f"Failed to update patient {patient_id_str} with webhook data")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update patient history"
            )
        
        logger.info(
            f"Successfully added webhook event {event_type} for call {call_id} "
            f"to patient {patient_id_str} history"
        )
        
        # If call ended, also update patient_state if needed
        if event_type == "call.ended":
            # Update patient_state to reflect latest call
            patient_state = db.patient_state.find_one({"patient_id": patient_object_id})
            if patient_state:
                db.patient_state.update_one(
                    {"patient_id": patient_object_id},
                    {
                        "$set": {
                            "last_call_date": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        },
                        "$inc": {
                            "total_calls": 1
                        }
                    }
                )
                
                # If call was successful, increment successful_calls
                call_status = call_data.get("status")
                if call_status in ["ended", "completed"]:
                    db.patient_state.update_one(
                        {"patient_id": patient_object_id},
                        {"$inc": {"successful_calls": 1}}
                    )
        
        return {
            "status": "success",
            "message": f"Webhook processed for patient {patient_id_str}",
            "call_id": call_id,
            "event_type": event_type
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Vapi webhook: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )


@router.post("/fireflies")
async def handle_fireflies_webhook(request: Request):
    """
    Handle incoming Fireflies.ai webhook events.
    
    This endpoint will process Fireflies completion webhooks
    after transcripts are processed.
    
    TODO: Implement Fireflies webhook handling
    """
    try:
        payload = await request.json()
        logger.info(f"Received Fireflies webhook: {payload}")
        
        # TODO: Implement Fireflies webhook processing
        # This should update call_logs with Fireflies transcript and analysis
        
        return {
            "status": "received",
            "message": "Fireflies webhook received (not yet implemented)"
        }
    except Exception as e:
        logger.error(f"Error processing Fireflies webhook: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )