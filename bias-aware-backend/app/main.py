from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# CORS setup (allow frontend requests)
origins = [
    "http://localhost:3000",  # Adjust for your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple health check route
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# Test route to call OpenAI API with a basic prompt
@app.get("/test_openai")
async def test_openai():
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Say hello"}
        ],
        max_tokens=5
    )
    return {"response": response.choices[0].message.content.strip()}
