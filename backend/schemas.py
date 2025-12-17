from pydantic import BaseModel
from datetime import datetime

class LikeCreate(BaseModel):
    breed: str
    image_url: str

class LikeResponse(BaseModel):
    id: int
    breed: str
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True

class ViewedCreate(BaseModel):
    breed: str