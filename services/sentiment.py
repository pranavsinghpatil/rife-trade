# services/sentiment.py
import os
import requests
from textblob import TextBlob
from utils.logger import log
from dotenv import load_dotenv

load_dotenv()

# ENV variables
USE_GEMMA = os.getenv("USE_GEMMA", "False").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:20b")

def classify_sentiment(text: str) -> str:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.2:
        return "positive"
    elif polarity < -0.2:
        return "negative"
    else:
        return "neutral"

def get_sentiment(text: str):
    sentiment = "unknown"
    confidence = 0
    model_used = "none"

    # ---------- USE GEMMA ----------
    if USE_GEMMA:
        try:
            if not GEMINI_API_KEY:
                raise ValueError("Missing GEMINI_API_KEY")
            log("Using Gemma (Gemini API) for sentiment analysis")
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"Classify this text as Positive, Negative, or Neutral: {text}"
            )
            sentiment_text = response.text.strip().lower()
            if "positive" in sentiment_text:
                sentiment, confidence, model_used = "positive", 0.98, "gemma"
            elif "negative" in sentiment_text:
                sentiment, confidence, model_used = "negative", 0.98, "gemma"
            elif "neutral" in sentiment_text:
                sentiment, confidence, model_used = "neutral", 0.95, "gemma"
            return {"text": text, "sentiment": sentiment, "confidence": confidence, "model": model_used}
        except Exception as e:
            log(f"Gemma failed: {e}")

    # ---------- USE OLLAMA ----------
    else:
        try:
            log("Using Ollama for sentiment analysis")
            payload = {
                "model": OLLAMA_MODEL,
                "prompt": f"Classify this text as Positive, Negative, or Neutral: {text}",
                "stream": False
            }
            response = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=120)
            response.raise_for_status()
            result_text = response.text.lower()
            if "positive" in result_text:
                sentiment, confidence, model_used = "positive", 0.90, "ollama"
            elif "negative" in result_text:
                sentiment, confidence, model_used = "negative", 0.90, "ollama"
            elif "neutral" in result_text:
                sentiment, confidence, model_used = "neutral", 0.85, "ollama"
            return {"text": text, "sentiment": sentiment, "confidence": confidence, "model": model_used}
        except Exception as e:
            log(f"Ollama failed: {e}")

    # ---------- FALLBACK ----------
    sentiment = classify_sentiment(text)
    return {"text": text, "sentiment": sentiment, "confidence": 0.70, "model": "textblob"}
