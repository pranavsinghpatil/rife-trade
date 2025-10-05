import requests
from utils.logger import log

def check_services():
    status = {
        "market": False,
        "news": False,
        "sentiment": False,
        "ollama": False
    }

    # --- Check Market ---
    try:
        import yfinance as yf
        yf.Ticker("AAPL")
        status["market"] = True
    except Exception as e:
        log(f"Market service error: {e}")

    # --- Check News ---
    try:
        import requests
        r = requests.get("https://newsapi.org", timeout=2)
        if r.status_code == 200:
            status["news"] = True
    except Exception as e:
        log(f"News service error: {e}")

    # --- Check Sentiment ---
    try:
        from textblob import TextBlob
        _ = TextBlob("This is great!").sentiment
        status["sentiment"] = True
    except Exception as e:
        log(f"Sentiment service error: {e}")

    # --- Check Ollama ---
    try:
        res = requests.get("http://localhost:11434/api/tags", timeout=2)
        if res.status_code == 200:
            status["ollama"] = True
    except Exception as e:
        log(f"Ollama not running: {e}")

    return status
