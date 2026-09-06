from fastapi.testclient import TestClient

from app.main import app
from app.core.security import verify_access_token

client = TestClient(app)


def test_invalid_access_token():

    result = verify_access_token(
        "this-is-not-a-valid-jwt-token"
    )

    assert result is None
    