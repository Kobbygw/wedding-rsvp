import uuid
from sqlmodel import Session, select
from app.database import engine
from app.models.all import Wedding

def update_photos():
    with Session(engine) as session:
        statement = select(Wedding).where(Wedding.id == uuid.UUID("f9d7c6b4-8e3d-4c5a-9a1b-2c3d4e5f6a7b"))
        results = session.exec(statement)
        wedding = results.first()
        
        if wedding:
            wedding.cover_image = "/images/cover.jpg"
            wedding.gallery = ["/images/gallery-1.jpg", "/images/gallery-2.jpg"]
            session.add(wedding)
            session.commit()
            print("Wedding photos updated successfully!")
        else:
            print("Wedding record not found.")

if __name__ == "__main__":
    update_photos()
