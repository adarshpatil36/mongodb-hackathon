# Configuration management
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb+srv://mongo-hack:Ambrosi%40@cluster0.uibdjo.mongodb.net")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "tether")

settings = Settings()
