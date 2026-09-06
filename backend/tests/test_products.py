from fastapi.testclient import TestClient

from app.main import app
from app.api.dependencies import get_db
from app.core.security import get_current_user


client = TestClient(app)


def override_get_db():
    yield None


def override_get_current_user():
    return {
        "id": 1,
        "role": "admin"
    }


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user


def test_product_not_found(monkeypatch):

    def fake_get_product(db, product_id):
        return None

    monkeypatch.setattr(
        "app.api.v1.products.get_product",
        fake_get_product
    )

    response = client.get(
        "/api/v1/products/99999"
    )

    assert response.status_code == 404

    assert response.json() == {
        "success": False,
        "status_code": 404,
        "message": "Product not found"
    }
def test_get_products(monkeypatch):

    fake_products = {
        "total": 0,
        "items": []
    }

    def fake_get_products(
        db,
        search=None,
        category_id=None,
        skip=0,
        limit=10,
        sort_by="id",
        order="asc"
    ):
        return fake_products

    monkeypatch.setattr(
        "app.api.v1.products.get_products",
        fake_get_products
    )

    response = client.get(
        "/api/v1/products/"
    )

    assert response.status_code == 200

    assert response.json() == {
        "total": 0,
        "items": []
    }