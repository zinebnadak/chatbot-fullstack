This is a chatbot with local development in progress., hosting later... 

Here is how it works:
* Frontend: React app with a clean, minimal UI featuring chat bubbles and a dark mode toggle. You type a question here, and it sends the message to the backend.
* Backend: FastAPI + Uvicorn serving a POST /ask endpoint. It receives the question, processes it with AI (e.g., OpenAI), and sends the answer back.
* Deployment: Backend is deployed on Render, frontend runs locally on port 5173 during development.
* Environment: Uses .env files for API keys and secrets.
* Status: Last time, the backend was running and returning basic chatbot replies. The frontend successfully sends POST requests and displays responses.
* Goals: Continue improving UI/UX, add real AI integration, and fix bugs.