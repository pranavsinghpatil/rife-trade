# services/sentiment.py
import os
import requests
from textblob import TextBlob
from utils.logger import log
from dotenv import load_dotenv

load_dotenv()

# ENV variables
USE_GEMMA = os.getenv("USE_GEMMA", "false").lower() == "true"
USE_OLLAMA = os.getenv("USE_OLLAMA", "false").lower() == "true"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:20b")


def classify_sentiment_local(text: str) -> dict:
    """Fast local fallback using TextBlob."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.2:
        sentiment = "positive"
    elif polarity < -0.2:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return {"text": text, "sentiment": sentiment, "confidence": 0.70, "model": "textblob"}


def analyze_with_gemma(text: str) -> dict:
    """Analyze sentiment via Gemini API."""
    try:
        if not GEMINI_API_KEY:
            raise ValueError("Missing GEMINI_API_KEY")

        log("→ Using Gemma (Gemini API) for sentiment analysis")
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Classify this text as Positive, Negative, or Neutral: {text}"
        )

        sentiment_text = response.text.strip().lower()
        if "positive" in sentiment_text:
            sentiment, confidence = "positive", 0.98
        elif "negative" in sentiment_text:
            sentiment, confidence = "negative", 0.98
        elif "neutral" in sentiment_text:
            sentiment, confidence = "neutral", 0.95
        else:
            raise ValueError("Unclear response from Gemma")

        return {"text": text, "sentiment": sentiment, "confidence": confidence, "model": "gemma"}

    except Exception as e:
        log(f"Gemma failed: {e}")
        return None


def analyze_with_ollama(text: str) -> dict:
    """Analyze sentiment via local Ollama model."""
    try:
        log("→ Using Ollama for sentiment analysis")

        payload = {
            "model": OLLAMA_MODEL,
            "prompt": f"Classify this text as Positive, Negative, or Neutral: {text}",
            "stream": False
        }

        response = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=90)
        response.raise_for_status()
        result_text = response.text.lower()

        if "positive" in result_text:
            sentiment, confidence = "positive", 0.90
        elif "negative" in result_text:
            sentiment, confidence = "negative", 0.90
        elif "neutral" in result_text:
            sentiment, confidence = "neutral", 0.85
        else:
            raise ValueError("Unclear response from Ollama")

        return {"text": text, "sentiment": sentiment, "confidence": confidence, "model": "ollama"}

    except Exception as e:
        log(f"Ollama failed: {e}")
        return None


def get_sentiment(text: str):
    """
    Unified sentiment analysis entrypoint.
    - Uses Gemma if enabled.
    - Uses Ollama if enabled and Gemma not preferred.
    - Falls back to TextBlob otherwise.
    """
    result = None

    if USE_GEMMA:
        result = analyze_with_gemma(text)
        if result:
            return result

    if USE_OLLAMA and not result:
        result = analyze_with_ollama(text)
        if result:
            return result

    # fallback
    return classify_sentiment_local(text)
