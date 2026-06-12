from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models.all import Wedding, WeddingBase
import uuid as uuid_pkg

router = APIRouter(prefix="/weddings", tags=["weddings"])

@router.get("/", response_model=List[Wedding])
def get_weddings(session: Session = Depends(get_session)):
    return session.exec(select(Wedding)).all()

@router.get("/{wedding_id}", response_model=Wedding)
def get_wedding(wedding_id: uuid_pkg.UUID, session: Session = Depends(get_session)):
    wedding = session.get(Wedding, wedding_id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return wedding

@router.patch("/{wedding_id}", response_model=Wedding)
def update_wedding(wedding_id: uuid_pkg.UUID, wedding_update: WeddingBase, session: Session = Depends(get_session)):
    db_wedding = session.get(Wedding, wedding_id)
    if not db_wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    wedding_data = wedding_update.dict(exclude_unset=True)
    for key, value in wedding_data.items():
        setattr(db_wedding, key, value)
    session.add(db_wedding)
    session.commit()
    session.refresh(db_wedding)
    return db_wedding
