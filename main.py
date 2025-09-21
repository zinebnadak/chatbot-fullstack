from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import traceback
import os
import httpx
import json
import re  # ← Added for cleaning up <s> tokens

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

# OpenRouter API key from environment variable
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise Exception("Missing OPENROUTER_API_KEY environment variable")

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"  # OpenRouter endpoint

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
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Referer": "https://nadak-s-ai-chatbot.onrender.com",  # Your deployed URL here
        "Content-Type": "application/json",
    }

    model = os.environ.get("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct:free")

    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful business assistant."},
            {"role": "user", "content": question},
            {"role": "assistant",
             "content": f"Use the following context to answer the user's question:\n{relevant_docs}"},
        ],
        "max_tokens": 300,
        "temperature": 0.7,
    }

    try:
        print("[LOG] Calling OpenRouter API...")
        async with httpx.AsyncClient() as client:
            response = await client.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=30.0)
            print(f"[LOG] OpenRouter API response status: {response.status_code}")
            response.raise_for_status()
            response_json = response.json()

            # Clean unwanted tokens like <s> or </s>
            # === START OF SAFETY CHECK ===
            try:
                raw_answer = response_json["choices"][0]["message"]["content"].strip()
            except (KeyError, IndexError, TypeError) as e:
                print(f"[ERROR] Unexpected response format: {json.dumps(response_json, indent=2)}")
                raise HTTPException(status_code=500, detail="Malformed OpenRouter response.")
            # === END OF SAFETY CHECK ===
            cleaned_answer = re.sub(r"<\/?s>", "", raw_answer)
            answer = cleaned_answer
            print(f"[LOG] Cleaned OpenRouter answer: {answer}")

    except Exception as e:
        print(f"[ERROR] OpenRouter API call failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    return {"answer": answer}

