import sys
from sqlalchemy import text
from app.database import engine

def clear_db():
    with engine.connect() as conn:
        try:
            # Delete all guests
            conn.execute(text("DELETE FROM guest;"))
            conn.commit()
            print("Successfully deleted all guests.")
        except Exception as e:
            print(f"Failed to delete: {e}")

if __name__ == "__main__":
    clear_db()
