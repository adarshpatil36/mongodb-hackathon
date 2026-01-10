# MongoDB connection setup
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    """MongoDB connection manager"""
    
    client: MongoClient = None
    database: Database = None

db = MongoDB()

async def connect_to_mongo():
    """Create MongoDB connection"""
    try:
        db.client = MongoClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
        )
        # Test the connection
        db.client.admin.command('ping')
        db.database = db.client[settings.MONGODB_DB_NAME]
        logger.info(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")
        return db.database
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")

def get_database() -> Database:
    """Get MongoDB database instance"""
    if db.database is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo() first.")
    return db.database