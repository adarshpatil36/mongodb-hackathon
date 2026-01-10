# Configuration management
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "<URI>")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "tether")

settings = Settings()
