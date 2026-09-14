from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Form
)

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.models.user import User

from app.core.security import (
    verify_password,
    create_access_token,
    get_current_user
)

from app.api.dependencies import get_db

from app.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_username
)

from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token
)


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    if get_user_by_email(
        db,
        user.email
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check whether username already exists
    if get_user_by_username(
        db,
        user.username
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Role is NOT accepted from registration.
    #
    # The User model automatically gives
    # every new account:
    #
    # role = "user"

    return create_user(
        db,
        user
    )


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),

    # React frontend sends either:
    #
    # user
    # admin
    #
    # Optional so Swagger OAuth2 authorization
    # can continue working normally.
    role: str | None = Form(default=None),

    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # FIND ACCOUNT
    # -----------------------------------------------------

    db_user = get_user_by_email(
        db,
        form_data.username
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # VERIFY PASSWORD
    # -----------------------------------------------------

    if not verify_password(
        form_data.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # CHECK WHETHER ACCOUNT IS ACTIVE
    # -----------------------------------------------------

    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )


    # -----------------------------------------------------
    # VERIFY LOGIN ROLE
    # -----------------------------------------------------

    if role is not None:

        selected_role = role.strip().lower()

        # Only user/admin are valid
        if selected_role not in {
            "user",
            "admin"
        }:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role selected"
            )

        database_role = db_user.role.strip().lower()

        # Example:
        #
        # Database = user
        # Selected = admin
        #
        # Login is rejected.

        if database_role != selected_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Selected role does not match this account"
            )


    # -----------------------------------------------------
    # CREATE JWT TOKEN
    # -----------------------------------------------------

    access_token = create_access_token(
        data={
            "sub": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# CURRENT LOGGED-IN USER
# =========================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }