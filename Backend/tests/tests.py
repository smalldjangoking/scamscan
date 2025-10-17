import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_router_check_valid_link():
    response = client.get("/api/scan/router", params={"value": "https://www.google.com"})
    assert response.status_code == 200
    assert response.json() == {"result": "success"}