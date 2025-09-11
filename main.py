from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import traceback
import requests
import os

app = FastAPI()

# CORS (for future frontend use)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init ChromaDB
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="business-faqs")

# ENV variable for Ollama
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")


@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"}


@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question")
    if not question:
        return {"error": "Missing question"}

    results = collection.query(query_texts=[question], n_results=3)
    relevant_docs = "\n".join(results["documents"][0]) if results["documents"] else ""

    prompt = f"""
You are a helpful business assistant.
Use the following context to answer the question:
{relevant_docs}

Question: {question}
Answer:
"""

    try:
        ollama_response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": "qwen:7b",
                "prompt": prompt,
                "stream": False
            }
        )
        ollama_response.raise_for_status()
        answer = ollama_response.json()["response"].strip()

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

    return {"answer": answer}
