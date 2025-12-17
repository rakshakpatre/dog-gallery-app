from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class LikedImage(Base):
    __tablename__ = "liked_images"

    id = Column(Integer, primary_key=True, index=True)
    breed = Column(String, index=True)
    image_url = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ViewedBreed(Base):
    __tablename__ = "viewed_breeds"

    id = Column(Integer, primary_key=True, index=True)
    breed = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

