from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import traceback
import requests    # <-- for making local requests to Ollama

app = FastAPI()  # Creates a new web API

# CORS (for future frontend use)
app.add_middleware(
    CORSMiddleware,         # Allows requests from any origin (for frontend use).
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init ChromaDB
chroma_client = chromadb.Client()       # Connects to ChromaDB, a vector database.
collection = chroma_client.get_or_create_collection(name="business-faqs")       # Uses or creates a collection named "business-faqs"


# endpoints
@app.get("/")       # Just a health check.
def root():
    return {"status": "ok", "message": "Backend is running"}


@app.post("/ask")   # Takes a question from the user.
async def ask(request: Request):        # Handles POST requests to the /ask endpoint
    data = await request.json()         # Reads the JSON body sent in the request
    question = data.get("question")     # Gets the value of the "question" field from the request.

    if not question:                    # If it's missing, question will be None
        return {"error": "Missing question"}        # Checks if the question is empty or missing. If so, it sends back an error response.

    # Search ChromaDB
    results = collection.query(     # Sends the question to ChromaDB to find similar or relevant documents.
        query_texts=[question],     # This is the search input
        n_results=3                 # It will return the top 3 most relevant documents from the collection
    )

    relevant_docs = "\n".join(results["documents"][0]) if results["documents"] else ""          # Takes the top documents returned from ChromaDB (results["documents"]). Joins them into one string, separated by new lines (\n). If there are no results, it sets relevant_docs to an empty string.

    # now below Builds a prompt string that will be sent to the model. This helps GPT answer the question based on the documents found earlier.
    prompt = f"""       
You are a helpful business assistant.
Use the following context to answer the question:
{relevant_docs}

Question: {question}
Answer:
"""

    try:
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen:7b",
                "prompt": prompt,
                "stream": False
            }
        )
        ollama_response.raise_for_status()
        answer = ollama_response.json()["response"].strip()

    except Exception as e:          # Error handling, If anything goes wrong, it returns an error message.
        traceback.print_exc()       # <-- print full error traceback in your PyCharm terminal
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")   # <-- return 500 error with details to client

    return {"answer": answer}           # FINAL RETURN:  Sends the final answer back to the user.
