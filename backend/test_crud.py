from app.database.database import SessionLocal
from app.crud.user import create_user, get_user_by_email
from app.schemas.user import UserCreate

db = SessionLocal()

# Change the email if you've already used this one
new_user = UserCreate(
    username="subhani",
    email="subhani@gmail.com",
    password="Password@123"
)

existing = get_user_by_email(db, new_user.email)

if existing:
    print("User already exists")
else:
    user = create_user(db, new_user)
    print("User created successfully!")
    print(user.id, user.username, user.email)

db.close()