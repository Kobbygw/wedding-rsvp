from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
import uuid as uuid_pkg

class WeddingBase(SQLModel):
  couple_name: str
  date: str
  location: str
  story: str
  rsvp_deadline: str
  cover_image: Optional[str] = None
  gallery: List[str] = Field(default=[], sa_column=Column(JSON))
  # Gifting fields
  bank_name: Optional[str] = None
  account_name: Optional[str] = None
  account_number: Optional[str] = None
  momo_name: Optional[str] = None
  momo_number: Optional[str] = None
  momo_name_2: Optional[str] = None
  momo_number_2: Optional[str] = None

class Wedding(WeddingBase, table=True):
  id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, primary_key=True, index=True)
  guests: List["Guest"] = Relationship(back_populates="wedding")

class GuestBase(SQLModel):
  name: str
  status: str = "pending"
  plus_one: bool = False
  message: Optional[str] = ""
  response_date: Optional[str] = None

class GuestRSVPUpdate(SQLModel):
  status: str
  plus_one: bool = False
  message: Optional[str] = ""
  response_date: Optional[str] = None

class Guest(GuestBase, table=True):
  id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, primary_key=True, index=True)
  token: str = Field(unique=True, index=True)
  wedding_id: uuid_pkg.UUID = Field(foreign_key="wedding.id")
  wedding: Wedding = Relationship(back_populates="guests")
