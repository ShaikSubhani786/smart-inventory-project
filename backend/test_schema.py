from app.schemas.user import UserCreate

user = UserCreate(
    username="Subhani",
    email="abc",
    password="Password@123"
)

print(user)