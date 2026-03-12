import os
import httpx
from langchain_core.tools import tool


@tool
async def search_products(query: str, limit: int = 5) -> list[dict]:
    """Search for products in the store by keyword."""
    api_base = os.getenv("API_BASE_URL", "http://localhost:3000/api")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{api_base}/products",
                params={"keyword": query, "pageSize": limit},
                timeout=5.0,
            )
            data = resp.json()
            return data.get("data", {}).get("items", [])
        except Exception:
            return []
