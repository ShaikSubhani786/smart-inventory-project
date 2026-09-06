from app.core.security import hash_password, verify_password

password = "Password@123"

hashed = hash_password(password)

print("Hash:")
print(hashed)

print("\nVerification:")
print(verify_password(password, hashed))