from fastapi import FastAPI, Request, HTTPException
# Import FastAPI core classes:
# - FastAPI to create app
# - Request to handle incoming requests
# - HTTPException to raise HTTP errors

from fastapi.middleware.cors import CORSMiddleware
# Middleware to handle Cross-Origin Resource Sharing (CORS),
# allowing frontend apps on different origins to access this backend

import chromadb
# Import ChromaDB client for vector search database

import traceback
# Import traceback to print detailed error stack traces for debugging

import os
# For environment variables and OS-level interaction

import httpx
# HTTP client for making async API requests

import json
# For JSON serialization/deserialization (not directly used here but common)

import re  # ← Added for cleaning up <s> tokens
# Regular expressions module, used to clean unwanted tokens from model output

from dotenv import load_dotenv
load_dotenv()  # This loads environment variables from the .env file
# Load environment variables from a .env file into process environment

app = FastAPI()
# Initialize the FastAPI app instance

# CORS (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins to access this API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize ChromaDB collection
chroma_client = chromadb.Client()
# Create a Chroma client instance to connect to the vector database

collection = chroma_client.get_or_create_collection(name="business-faqs")
# Get or create a collection named "business-faqs" to store/query vectors

# OpenRouter API key from environment variable
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
# Read the OpenRouter API key from environment variables

if not OPENROUTER_API_KEY:
    raise Exception("Missing OPENROUTER_API_KEY environment variable")
# Throw error if API key is not found — app won't start without this

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"  # OpenRouter endpoint
# URL endpoint for the OpenRouter chat completion API

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"}
# Basic health check route to confirm backend is running

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    # Parse incoming JSON body asynchronously from the request

    question = data.get("question")
    # Extract the 'question' field from the JSON payload

    print(f"[LOG] Received question: {question}")  # Log incoming question

    if not question:
        print("[LOG] Missing question in request")
        return {"error": "Missing question"}
    # Return error if 'question' is missing in request body

    # Query vector DB for context
    results = collection.query(query_texts=[question], n_results=3)
    # Query ChromaDB collection for top 3 related documents to the question

    relevant_docs = "\n".join(results["documents"][0]) if results["documents"] else ""
    # Join retrieved documents into one string as context for the prompt

    print(f"[LOG] Context from ChromaDB: {relevant_docs}")

    # Build the prompt to send to OpenRouter's language model
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
    # HTTP headers for the API request:
    # - Authorization with Bearer token
    # - Referer set to your frontend URL (for CORS/security)
    # - Content-Type JSON

    model = os.environ.get("OPENROUTER_MODEL", "mistralai/mistral-7b-i_


