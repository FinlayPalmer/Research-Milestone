import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Chat Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    model: str
    status: str


@app.get("/health")
def health():
    return {"status": "ok", "model_connected": False}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Simulate model processing time
    await asyncio.sleep(1)

    # TODO: Replace with real model call later
    # response = model.generate(message)

    return ChatResponse(
        reply=f"Mock response from Python! You said: {message}",
        model="dummy-model-v1",
        status="success",
    )
