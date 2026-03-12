from collections import defaultdict
from typing import TypedDict


class HistoryEntry(TypedDict):
    user: str
    assistant: str


class ChatHistory:
    def __init__(self, max_history: int = 20):
        self._store: dict[str, list[HistoryEntry]] = defaultdict(list)
        self._max_history = max_history

    def get(self, session_id: str) -> list[HistoryEntry]:
        return self._store[session_id]

    def add(self, session_id: str, user_message: str, assistant_response: str) -> None:
        self._store[session_id].append(
            {"user": user_message, "assistant": assistant_response}
        )
        if len(self._store[session_id]) > self._max_history:
            self._store[session_id] = self._store[session_id][-self._max_history:]

    def clear(self, session_id: str) -> None:
        self._store.pop(session_id, None)
