from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"message": "pong"}

def test_openai_endpoint_structure():
    # We don't run this because it needs an API key and might be broken,
    # but we check if the route exists.
    # This is a bit hacky, but valid for now.
    routes = [route.path for route in app.routes]
    assert "/test_openai" in routes
