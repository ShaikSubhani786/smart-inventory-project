from app.api.dependencies import get_db

generator = get_db()

db = next(generator)

print(db)

generator.close()