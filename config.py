from dotenv import load_dotenv
import os

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GEMMA_API_KEY = os.getenv("GEMMA_API_KEY")
GEMMA_API_URL = os.getenv("GEMMA_API_URL")  # e.g. https://api.gemma.example/v1/sentiment
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
PORT = int(os.getenv("PORT", 8051))
