from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.database.base import Base

print("Step 1: Imports successful")
print("Step 2: Settings imported")
print("DATABASE_URL:", settings.DATABASE_URL)

engine = create_engine(settings.DATABASE_URL)

print("Step 3: Engine created")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

print("Step 4: Database module loaded successfully")