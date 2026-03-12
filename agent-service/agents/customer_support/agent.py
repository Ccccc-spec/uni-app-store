import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage


class CustomerSupportAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.system_prompt = (
            "You are a customer support assistant for an online store. "
            "Help users with order inquiries, returns, shipping questions, and general support. "
            "Be empathetic, professional, and solution-oriented."
        )

    async def run(self, message: str, history: list[dict]) -> str:
        messages = [SystemMessage(content=self.system_prompt)]
        for h in history[-6:]:
            messages.append(HumanMessage(content=h["user"]))
            messages.append(SystemMessage(content=h["assistant"]))
        messages.append(HumanMessage(content=message))

        response = await self.llm.ainvoke(messages)
        return response.content
