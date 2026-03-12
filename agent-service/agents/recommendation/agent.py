import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage


class RecommendationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.system_prompt = (
            "You are a product recommendation assistant for an online store. "
            "Help users discover products based on their preferences and needs. "
            "Be concise, friendly, and suggest 2-3 relevant products when appropriate."
        )

    async def run(self, message: str, history: list[dict]) -> str:
        messages = [SystemMessage(content=self.system_prompt)]
        for h in history[-6:]:
            messages.append(HumanMessage(content=h["user"]))
            messages.append(SystemMessage(content=h["assistant"]))
        messages.append(HumanMessage(content=message))

        response = await self.llm.ainvoke(messages)
        return response.content
