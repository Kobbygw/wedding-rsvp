from sqlmodel import Session, create_engine, select
from .database import engine, init_db
from .models.all import Wedding, Guest
import uuid as uuid_pkg

def seed_data():
    with Session(engine) as session:
        # Check if already seeded
        statement = select(Wedding)
        results = session.exec(statement)
        if results.first():
            print("Database already contains data.")
            return

        # Seed Wedding
        wedding = Wedding(
            id=uuid_pkg.UUID("f9d7c6b4-8e3d-4c5a-9a1b-2c3d4e5f6a7b"),
            couple_name="Emma & Daniel",
            date="2025-09-13",
            location="Villa Medici, Tuscany, Italy",
            story="We met on a rainy Tuesday at a tiny bookshop in Florence. Daniel reached for the same worn copy of Calvino's Invisible Cities, and neither of us could let go. Four years later — same bookshop, same edition — he asked me to marry him. We can't wait to celebrate with everyone who made this story possible.",
            rsvp_deadline="2025-08-01",
            cover_image="/images/cover.jpg",
            gallery=[
                "/images/gallery-1.jpg",
                "/images/gallery-2.jpg"
            ]
        )
        session.add(wedding)
        session.commit()
        session.refresh(wedding)

        # Seed Guests
        guests = [
            Guest(name="Sophia Marchetti", token="4fd92ab3", status="attending", plus_one=True, message="We're so thrilled to celebrate with you!", response_date="2024-12-10", wedding_id=wedding.id),
            Guest(name="Luca Romano",      token="8ce31f72", status="pending",   plus_one=False, message="", response_date=None, wedding_id=wedding.id),
            Guest(name="Valentina Cruz",   token="a1b2c3d4", status="not_attending", plus_one=False, message="So sorry, I'll be away on that date — sending all my love!", response_date="2024-12-12", wedding_id=wedding.id),
            Guest(name="James Whitfield",  token="de9f8012", status="pending",   plus_one=False, message="", response_date=None, wedding_id=wedding.id),
        ]
        session.add_all(guests)
        session.commit()
        print("Database successfully seeded.")

if __name__ == "__main__":
    init_db()
    seed_data()
