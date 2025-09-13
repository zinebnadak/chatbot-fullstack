from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import traceback
import os
import httpx
import openai
import json

from dotenv import load_dotenv
load_dotenv()  # This loads environment variables from the .env file

app = FastAPI()

# CORS (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB collection
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="business-faqs")

# OpenAI API key from environment variable
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise Exception("Missing OPENAI_API_KEY environment variable")

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"  # <-- Updated URL for chat completions

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question")
    print(f"[LOG] Received question: {question}")  # Log incoming question

    if not question:
        print("[LOG] Missing question in request")
        return {"error": "Missing question"}

    # Query vector DB for context
    results = collection.query(query_texts=[question], n_results=3)
    relevant_docs = "\n".join(results["documents"][0]) if results["documents"] else ""
    print(f"[LOG] Context from ChromaDB: {relevant_docs}")

    # Build the prompt
    prompt = f"""
You are a helpful business assistant.
Use the following context to answer the question:
{relevant_docs}

Question: {question}
Answer:
"""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-3.5-turbo",  # Use chat model
        "messages": [
            {"role": "system", "content": "You are a helpful business assistant."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 300,
        "temperature": 0.7,
    }

    # Send request to OpenAI asynchronously
    try:
        print("[LOG] Calling OpenAI API...")
        async with httpx.AsyncClient() as client:
            response = await client.post(OPENAI_API_URL, headers=headers, json=payload, timeout=30.0)
            print(f"[LOG] OpenAI API response status: {response.status_code}")
            response.raise_for_status()
            response_json = response.json()
            answer = response_json["choices"][0]["message"]["content"].strip()
            print(f"[LOG] OpenAI answer: {answer}")

    except Exception as e:
        print(f"[ERROR] OpenAI API call failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    return {"answer": answer}
