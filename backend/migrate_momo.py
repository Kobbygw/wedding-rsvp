import sys
from sqlalchemy import text
from app.database import engine

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE wedding ADD COLUMN momo_name_2 VARCHAR;"))
            conn.execute(text("ALTER TABLE wedding ADD COLUMN momo_number_2 VARCHAR;"))
            conn.commit()
            print("Successfully added momo_name_2 and momo_number_2 to wedding table.")
        except Exception as e:
            print(f"Migration failed or already applied: {e}")

if __name__ == "__main__":
    migrate()
