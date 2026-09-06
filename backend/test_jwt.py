from app.core.security import (
    create_access_token,
    verify_access_token
)

data = {
    "sub": "1",
    "username": "subhani"
}

token = create_access_token(data)

print("TOKEN\n")
print(token)

print("\nDecoded Token\n")

decoded = verify_access_token(token)

print(decoded)