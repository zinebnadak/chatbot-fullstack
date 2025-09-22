AI Chatbot — Fullstack App (React + FastAPI + Ollama)

This is a full-stack AI chatbot built with React (frontend) and FastAPI (backend). Users type questions into a minimalist, dark-mode chat interface. Messages are sent to a Python backend via a REST API, which processes them using a locally hosted language model via Ollama (such as Mistral, Qwen, or LLaMA3).
The app was originally tested with OpenAI's API, but later transitioned to free, private local models using Ollama. It also supports optional cloud-based fallback via OpenRouter.

Tech Stack:
Backend: FastAPI + Uvicorn
AI Models: Ollama (local), OpenRouter (cloud fallback)
Frontend: React (Vite-powered)
Styling: CSS Modules (dark mode support)
Hosting: Google Cloud VM (for backend + Ollama)
Communication: REST API (POST /ask)
Optional: ChromaDB for retrieval-augmented generation (RAG)
Deployed and tested both locally and in production on a cloud VM, with seamless frontend-backend integration.