from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from agents.recommendation.agent import RecommendationAgent
from agents.customer_support.agent import CustomerSupportAgent
from memory.chat_history import ChatHistory

router = APIRouter()

recommendation_agent = RecommendationAgent()
support_agent = CustomerSupportAgent()
chat_history = ChatHistory()


class ChatMessage(BaseModel):
    session_id: str
    message: str
    agent_type: Optional[str] = "support"


class ChatResponse(BaseModel):
    session_id: str
    response: str
    agent_type: str


@router.post("/message", response_model=ChatResponse)
async def send_message(payload: ChatMessage):
    history = chat_history.get(payload.session_id)

    if payload.agent_type == "recommendation":
        response = await recommendation_agent.run(payload.message, history)
    else:
        response = await support_agent.run(payload.message, history)

    chat_history.add(payload.session_id, payload.message, response)

    return ChatResponse(
        session_id=payload.session_id,
        response=response,
        agent_type=payload.agent_type or "support",
    )
