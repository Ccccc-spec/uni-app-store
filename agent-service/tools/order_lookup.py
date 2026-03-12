import os
import httpx
from langchain_core.tools import tool


@tool
async def lookup_order(order_id: str, auth_token: str) -> dict:
    """Look up an order by ID on behalf of the user."""
    api_base = os.getenv("API_BASE_URL", "http://localhost:3000/api")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{api_base}/orders/{order_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=5.0,
            )
            data = resp.json()
            return data.get("data", {})
        except Exception:
            return {}
