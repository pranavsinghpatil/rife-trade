import os
import time
import requests
from dotenv import load_dotenv
from models.schemas import HeadlinesResponse, Headline
from utils.logger import log

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
    
    log(f"Fetching headlines from: {url}")

    # Check cache
    cache_key = f"{market}:{query or 'general'}"
    if cache_key in _CACHE:
        log("Returning cached headlines")
        return HeadlinesResponse(headlines=_CACHE[cache_key])
    
    # Fetch
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        r = response.json()
        log(f"NewsAPI response: {r}")
        articles = r.get("articles", [])
        
        if not articles:
            log("No articles found in NewsAPI response.")

        headlines = [
            Headline(
                title=a.get("title", "No title"),
                source=a.get("source", {}).get("name"),
                url=a.get("url"),
                published=a.get("publishedAt"),
            )
            for a in articles[:5]
        ]
        
        _CACHE[cache_key] = headlines
        return HeadlinesResponse(headlines=headlines)
    except requests.exceptions.RequestException as e:
        log(f"Error fetching headlines from NewsAPI: {e}")
        return HeadlinesResponse(headlines=[])
    except Exception as e:
        log(f"An unexpected error occurred in get_headlines: {e}")
        return HeadlinesResponse(headlines=[])