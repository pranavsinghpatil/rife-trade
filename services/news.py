import os
import time
import requests
from dotenv import load_dotenv
from models.schemas import HeadlinesResponse, Headline

load_dotenv()
API_KEY = os.getenv("NEWS_API_KEY")

# 🧠 Simple in-memory cache: { key: (timestamp, response) }
_CACHE = {}
CACHE_TTL = 15 * 60  # 15 minutes



# optional simple cache
_CACHE = {}

def get_headlines(market: str, query: str = None) -> HeadlinesResponse:
    """
    Fetch latest headlines based on market or company name.
    - market: "indian" or "global"
    - query: optional company name (e.g., 'RELIANCE', 'TCS')
    """
    # Convert market to correct country code or source
    if market.lower() == "indian":
        country_code = "in"
    elif market.lower() == "us":
        country_code = "us"
    else:
        country_code = None  # use global
    
    # Build NewsAPI URL
    if query:
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={API_KEY}"
    elif country_code:
        url = f"https://newsapi.org/v2/top-headlines?country={country_code}&language=en&apiKey={API_KEY}"
    else:
        url = f"https://newsapi.org/v2/top-headlines?language=en&apiKey={API_KEY}"
    
    # Check cache
    cache_key = f"{market}:{query or 'general'}"
    if cache_key in _CACHE:
        return HeadlinesResponse(headlines=_CACHE[cache_key])
    
    # Fetch
    r = requests.get(url).json()
    articles = r.get("articles", [])
    
    headlines = [
        Headline(
            title=a.get("title", "No title"),
            sentiment="neutral",  # default, sentiment handled elsewhere
            confidence=0.0,
        )
        for a in articles[:5]
    ]
    
    _CACHE[cache_key] = headlines
    return HeadlinesResponse(headlines=headlines)