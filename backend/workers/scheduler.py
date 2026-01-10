# APScheduler call scheduling
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, time as dt_time, timedelta
from bson import ObjectId
from database import get_database
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def get_eligible_patients_for_calls():
    """
    Fetches and returns list of eligible patients based on their call_schedules.
    
    This function:
    1. Queries MongoDB for patients with enabled call schedules
    2. Filters patients whose scheduled call time matches current time window
    3. Returns list of eligible patients
    
    Returns:
        list: List of eligible patient documents
    """
    try:
        logger.info("Fetching eligible patients for calls...")
        
        db = get_database()
        current_time = datetime.utcnow()
        
        # Fetch patients with enabled call schedules
        # Filter: call_schedule.enabled = true
        query = {
            "call_schedule.enabled": True
        }
        
        patients = db.patients.find(query)
        
        eligible_patients = []
        
        for patient in patients:
            call_schedule = patient.get("call_schedule", {})
            
            if not call_schedule:
                continue
            
            # Extract schedule information
            frequency = call_schedule.get("frequency", "daily")
            preferred_time_str = call_schedule.get("preferred_time", "09:00")
            timezone = call_schedule.get("timezone", "America/New_York")
            enabled = call_schedule.get("enabled", False)
            
            if not enabled:
                continue
            
            # Parse preferred_time (format: "HH:MM")
            try:
                preferred_hour, preferred_minute = map(int, preferred_time_str.split(":"))
                preferred_time = dt_time(preferred_hour, preferred_minute)
            except (ValueError, AttributeError):
                logger.warning(f"Invalid preferred_time format for patient {patient.get('_id')}: {preferred_time_str}")
                continue
            
            # Check if patient is eligible based on frequency and time
            # This is a simplified check - you may want to implement more sophisticated logic
            # that considers timezone, last call date, etc.
            is_eligible = _check_eligibility(
                patient=patient,
                frequency=frequency,
                preferred_time=preferred_time,
                current_time=current_time,
                timezone=timezone
            )
            
            if is_eligible:
                eligible_patients.append(patient)
        
        logger.info(f"Found {len(eligible_patients)} eligible patients for scheduled calls")
        return eligible_patients
        
    except Exception as e:
        logger.error(f"Error in get_eligible_patients_for_calls: {str(e)}", exc_info=True)
        raise


async def fetch_patients_for_calls():
    """
    Cron job that fetches patients based on their call_schedules and processes them.
    
    This function:
    1. Gets eligible patients via get_eligible_patients_for_calls()
    2. Processes eligible patients for outbound calls
    
    TODO: Implement the actual call triggering logic
    """
    try:
        logger.info("Starting scheduled patient fetch for calls...")
        
        eligible_patients = await get_eligible_patients_for_calls()
        
        # TODO: Process eligible patients and trigger calls
        # This is where you'll implement the actual call triggering logic
        for patient in eligible_patients:
            patient_id = str(patient.get("_id"))
            logger.info(f"Processing patient {patient_id} for scheduled call")
            
            # STUB: Implement call triggering logic here
            # Example:
            # - Check if call is already scheduled/processing
            # - Trigger outbound call via Vapi service
            # - Update scheduled_calls collection
            # - Handle any errors
            pass
        
        logger.info("Completed scheduled patient fetch for calls")
        
    except Exception as e:
        logger.error(f"Error in fetch_patients_for_calls: {str(e)}", exc_info=True)


def _check_eligibility(
    patient: dict,
    frequency: str,
    preferred_time: dt_time,
    current_time: datetime,
    timezone: str
) -> bool:
    """
    Check if a patient is eligible for a call based on their schedule.
    
    Checks:
    1. If current time is within ±1 hour of the preferred call time
    2. If enough time has passed since last call based on frequency
    
    Args:
        patient: Patient document from MongoDB
        frequency: Call frequency ("daily", "every_other_day", "weekly")
        preferred_time: Preferred call time
        current_time: Current UTC datetime
        timezone: Patient's timezone
        
    Returns:
        bool: True if patient is eligible for a call
    """
    # Step 1: Check if current time is within ±1 hour of preferred time
    preferred_datetime_today = datetime.combine(current_time.date(), preferred_time)
    preferred_datetime_tomorrow = preferred_datetime_today + timedelta(days=1)
    preferred_datetime_yesterday = preferred_datetime_today - timedelta(days=1)
    
    one_hour_in_seconds = 3600  # 1 hour = 3600 seconds
    time_window_match = False
    
    # Check if current time is within ±1 hour of preferred time (today, yesterday, or tomorrow)
    for preferred_datetime in [preferred_datetime_yesterday, preferred_datetime_today, preferred_datetime_tomorrow]:
        time_diff = abs((current_time - preferred_datetime).total_seconds())
        
        if time_diff <= one_hour_in_seconds:
            time_window_match = True
            break
    
    if not time_window_match:
        # Current time is outside the ±1 hour window
        return False
    
    # Step 2: Check if enough time has passed since last call based on frequency
    patient_id = patient.get("_id")
    if not patient_id:
        logger.warning(f"Patient missing _id, skipping frequency check")
        return False
    
    # Ensure patient_id is ObjectId for MongoDB queries
    if not isinstance(patient_id, ObjectId):
        try:
            patient_id = ObjectId(patient_id)
        except Exception:
            logger.warning(f"Invalid patient_id format: {patient_id}")
            return False
    
    db = get_database()
    
    # Get last call date - check patient_state first, then call_logs
    last_call_date = None
    
    # Try to get from patient_state collection
    patient_state = db.patient_state.find_one({"patient_id": patient_id})
    if patient_state and patient_state.get("last_call_date"):
        last_call_date = patient_state.get("last_call_date")
        if isinstance(last_call_date, datetime):
            pass  # Already a datetime
        else:
            # Convert to datetime if needed
            last_call_date = None
    
    # If not found in patient_state, check call_logs for most recent call
    if last_call_date is None:
        last_call = db.call_logs.find_one(
            {"patient_id": patient_id, "status": {"$in": ["completed", "voicemail"]}},
            sort=[("started_at", -1)]
        )
        if last_call and last_call.get("started_at"):
            last_call_date = last_call.get("started_at")
    
    # If no previous call found, patient is eligible (first call)
    if last_call_date is None:
        logger.debug(f"Patient {patient_id} has no previous calls, eligible for first call")
        return True
    
    # Calculate time since last call
    time_since_last_call = current_time - last_call_date
    
    # Define frequency requirements
    frequency_requirements = {
        "daily": timedelta(days=1),           # 24 hours
        "every_other_day": timedelta(days=2), # 48 hours
        "weekly": timedelta(days=7)           # 7 days
    }
    
    required_interval = frequency_requirements.get(frequency.lower())
    
    if required_interval is None:
        logger.warning(f"Unknown frequency '{frequency}' for patient {patient_id}, defaulting to daily")
        required_interval = timedelta(days=1)
    
    # Check if enough time has passed
    if time_since_last_call >= required_interval:
        logger.debug(
            f"Patient {patient_id} eligible: {time_since_last_call.days} days since last call "
            f"(required: {required_interval.days} days for {frequency})"
        )
        return True
    else:
        logger.debug(
            f"Patient {patient_id} not eligible: {time_since_last_call.days} days since last call "
            f"(required: {required_interval.days} days for {frequency})"
        )
        return False


def start_scheduler():
    """Start the APScheduler with configured cron jobs"""
    # Schedule the job to run every hour at minute 0
    # This can be adjusted based on your needs (e.g., every 30 minutes, every 15 minutes)
    scheduler.add_job(
        fetch_patients_for_calls,
        trigger=CronTrigger(minute=0),  # Run every hour at :00
        id="fetch_patients_for_calls",
        name="Fetch patients for scheduled calls",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Scheduler started - fetch_patients_for_calls job scheduled (every hour)")


def stop_scheduler():
    """Stop the APScheduler"""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped")
