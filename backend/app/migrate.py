from sqlalchemy import text
from .database import engine

def migrate():
    with engine.connect() as conn:
        print("Adding gifting columns to wedding table...")
        try:
            conn.execute(text("ALTER TABLE wedding ADD COLUMN bank_name VARCHAR"))
            conn.execute(text("ALTER TABLE wedding ADD COLUMN account_name VARCHAR"))
            conn.execute(text("ALTER TABLE wedding ADD COLUMN account_number VARCHAR"))
            conn.execute(text("ALTER TABLE wedding ADD COLUMN momo_name VARCHAR"))
            conn.execute(text("ALTER TABLE wedding ADD COLUMN momo_number VARCHAR"))
            conn.commit()
            print("Migration successful.")
        except Exception as e:
            print(f"Migration failed or columns already exist: {e}")

if __name__ == "__main__":
    migrate()
