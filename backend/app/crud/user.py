from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password


def get_user_by_email(db: Session, email: str):
    """
    Returns a user if the email exists,
    otherwise returns None.
    """
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    """
    Returns a user if the username exists,
    otherwise returns None.
    """
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate):
    """
    Creates a new user in the database.
    """

    hashed_pwd = hash_password(user.password)

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user