import os
from dotenv import load_dotenv

load_dotenv()

MODEL_SWITCH = {
    "gemma": os.getenv("USE_GEMMA", "true").lower() == "true",
    "ollama": os.getenv("USE_OLLAMA", "false").lower() == "true"
}

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:20b")
GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemini-2.0-flash")
