import os, requests
from dotenv import load_dotenv
from models.schemas import HeadlinesResponse

load_dotenv()
API_KEY = os.getenv("NEWS_API_KEY")

def get_headlines(market: str) -> HeadlinesResponse:
    if not API_KEY:
        return HeadlinesResponse(headlines=[{"title": "No API key found", "source": "System"}])
    url = f"https://newsapi.org/v2/top-headlines?country={market.lower()}&apiKey={API_KEY}"
    r = requests.get(url).json()
    headlines = [{"title": a["title"], "source": a["source"]["name"]} for a in r.get("articles", [])[:5]]
    return HeadlinesResponse(headlines=headlines)
