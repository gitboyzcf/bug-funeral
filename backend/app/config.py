import os

DB_PATH = os.environ.get("FUNERAL_DB_PATH", os.path.join(os.path.dirname(__file__), "data", "funeral.db"))

LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
LLM_MODEL = os.environ.get("LLM_MODEL", "")

LLM_TIMEOUT_SECONDS = 15