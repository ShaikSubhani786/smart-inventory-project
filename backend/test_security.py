from app.core.security import hash_password, verify_password

password = "Password@123"

hashed = hash_password(password)

print("Original Password :", password)
print("Hashed Password   :", hashed)

print("\nCorrect Password")
print(verify_password("Password@123", hashed))

print("\nWrong Password")
print(verify_password("Hello123", hashed))