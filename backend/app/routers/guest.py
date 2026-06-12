from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models.all import Guest, GuestBase, GuestRSVPUpdate
import uuid as uuid_pkg
import secrets

router = APIRouter(prefix="/guests", tags=["guests"])

def send_rsvp_notification(guest_name: str, status: str):
    # This simulates a background task (e.g., sending an email)
    print(f"NOTIFICATION: {guest_name} has RSVPed as {status}")

@router.get("/", response_model=List[Guest])
def get_guests(wedding_id: uuid_pkg.UUID, session: Session = Depends(get_session)):
    statement = select(Guest).where(Guest.wedding_id == wedding_id)
    return session.exec(statement).all()

@router.post("/", response_model=Guest)
def create_guest(guest_data: GuestBase, wedding_id: uuid_pkg.UUID, session: Session = Depends(get_session)):
    token = secrets.token_hex(4) # Generate short unique token
    new_guest = Guest(**guest_data.dict(), token=token, wedding_id=wedding_id)
    session.add(new_guest)
    session.commit()
    session.refresh(new_guest)
    return new_guest

@router.get("/invite/{token}", response_model=Guest)
def get_guest_by_token(token: str, session: Session = Depends(get_session)):
    statement = select(Guest).where(Guest.token == token)
    guest = session.exec(statement).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Invitation not found")
    return guest

@router.patch("/invite/{token}", response_model=Guest)
def update_rsvp(token: str, rsvp_update: GuestRSVPUpdate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    statement = select(Guest).where(Guest.token == token)
    db_guest = session.exec(statement).first()
    if not db_guest:
        raise HTTPException(status_code=404, detail="Invitation not found")
        
    from datetime import date
    from ..models.all import Wedding
    wedding = session.exec(select(Wedding).where(Wedding.id == db_guest.wedding_id)).first()
    if wedding and wedding.rsvp_deadline:
        if date.today().isoformat() > wedding.rsvp_deadline:
            raise HTTPException(status_code=400, detail="RSVP deadline has passed")
    
    # Update only RSVP fields
    db_guest.status = rsvp_update.status
    db_guest.plus_one = rsvp_update.plus_one
    db_guest.message = rsvp_update.message
    db_guest.response_date = rsvp_update.response_date

    session.add(db_guest)
    session.commit()
    session.refresh(db_guest)
    
    # Trigger async notification
    background_tasks.add_task(send_rsvp_notification, db_guest.name, db_guest.status)
    
    return db_guest
