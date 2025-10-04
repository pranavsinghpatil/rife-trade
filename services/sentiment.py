import requests
from models.schemas import SentimentResponse

OLLAMA_URL = "http://localhost:11434/api/generate"

def get_sentiment(text: str) -> SentimentResponse:
    try:
        payload = {
            "model": "gpt-oss:20b",  # <-- use your local model
            "prompt": f"Classify sentiment (Positive, Negative, Neutral): {text}"
        }
        r = requests.post(OLLAMA_URL, json=payload, stream=True)

        output = ""
        for line in r.iter_lines():
            if line:
                chunk = line.decode("utf-8")
                output += chunk

        sentiment = "Neutral"
        if "positive" in output.lower():
            sentiment = "Positive"
        elif "negative" in output.lower():
            sentiment = "Negative"

        return SentimentResponse(sentiment=sentiment, raw=output)

    except Exception as e:
        return SentimentResponse(sentiment="Error", raw=str(e))
