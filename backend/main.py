from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, LikedImage, ViewedBreed
from schemas import LikeCreate, ViewedCreate
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Dog Gallery Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------ LIKE APIs -------      

@app.post("/like")
def like_image(payload: LikeCreate, db: Session = Depends(get_db)):
    existing = db.query(LikedImage).filter(
        LikedImage.image_url == payload.image_url
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Image already liked")
    
    like = LikedImage(
        breed=payload.breed,
        image_url=payload.image_url
    )
    db.add(like)
    db.commit()
    db.refresh(like)

    return{"message" : "Image Liked Successfully"}

@app.delete("/like")
def unlike_image(image_url: str, db: Session = Depends(get_db)):
    deleted = db.query(LikedImage).filter(
        LikedImage.image_url == image_url
    ).delete()

    db.commit()

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Like not found")
    
    return{"message" : "Image unliked successfully"}

@app.get("/likes")
def get_liked_images(db: Session = Depends(get_db)):
    return db.query(LikedImage).all()


# ------ VIEWED BREEDS APIs ------

@app.post("/viewed")
def add_viewed(payload: ViewedCreate, db: Session = Depends(get_db)):
    breed = payload.breed.lower()

    # Remove duplicates
    db.query(ViewedBreed).filter(ViewedBreed.breed == breed).delete()

    # Add new viewed breed
    viewed = ViewedBreed(breed=breed)
    db.add(viewed)

    # Keep only last 5 viewed
    excess = (
        db.query(ViewedBreed)
        .order_by(ViewedBreed.created_at.desc())
        .offset(5)
        .all()
    )

    for item in excess:
        db.delete(item)

    db.commit()

    return {"message": "Viewed breed saved"}


@app.get("/viewed")
def get_viewed(db: Session = Depends(get_db)):
    breeds = (
        db.query(ViewedBreed.breed)
        .order_by(ViewedBreed.created_at.desc())
        .limit(5)
        .all()
    )

    return [b.breed for b in breeds]

@app.get("/stats/liked-breeds")
def liked_breeds_stats(db: Session = Depends(get_db)):
    results = (
        db.query(
            LikedImage.breed,
            func.count(LikedImage.id).label("count")
        )
        .group_by(LikedImage.breed)
        .order_by(func.count(LikedImage.id).desc())
        .all()
    )

    return [
        {"breed": breed, "count": count}
        for breed, count in results
    ]


# ------ BACKEND STATUS CHECK --------

@app.get("/")
def root():
    return {"status" : "Dog Gallery Backend Running"}