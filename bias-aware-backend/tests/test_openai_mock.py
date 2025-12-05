from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@patch("app.main.client.chat.completions.create")
def test_openai_endpoint_mock(mock_create):
    # Mock the response from OpenAI
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="Hello there"))]
    mock_create.return_value = mock_response

    response = client.get("/test_openai")
    
    assert response.status_code == 200
    assert response.json() == {"response": "Hello there"}
    
    # Verify the mock was called with correct arguments
    mock_create.assert_called_once()
    call_args = mock_create.call_args
    assert call_args.kwargs['model'] == "gpt-3.5-turbo"
    assert call_args.kwargs['messages'] == [{"role": "user", "content": "Say hello"}]
