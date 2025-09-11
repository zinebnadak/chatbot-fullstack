from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import traceback
import os
import httpx  # <-- new import

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

# ENV variable for remote/local Ollama server
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

    # Query vector DB for context
    results = collection.query(query_texts=[question], n_results=3)
    relevant_docs = "\n".join(results["documents"][0]) if results["documents"] else ""

    # Build the prompt
    prompt = f"""
You are a helpful business assistant.
Use the following context to answer the question:
{relevant_docs}

Question: {question}
Answer:
"""

    # Send request to Ollama asynchronously
    try:
        async with httpx.AsyncClient() as client:
            ollama_response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "llama3:latest",
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=30.0  # optional timeout
            )
            ollama_response.raise_for_status()
            answer = ollama_response.json().get("response", "").strip()

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

    return {"answer": answer}
