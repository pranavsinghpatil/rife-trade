# app.py
from fastapi import FastAPI, Query
from services import news, market, sentiment, status
from models.schemas import PriceResponse, SentimentResponse, HeadlinesResponse, StatusResponse, HistoryResponse
from utils.logger import log
from fastapi.middleware.cors import CORSMiddleware
from routes import data 

app = FastAPI(title="Rife Trade Backend", version="1.0")

# Allow frontend (React) access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=StatusResponse)
def check_status():
    return status.check_services()

@app.get("/headlines", response_model=HeadlinesResponse)
def get_headlines(market: str, query: str = None):
    return news.get_headlines(market, query)


@app.get("/sentiment", response_model=SentimentResponse)
def analyze_sentiment(text: str = Query(..., min_length=5)):
    return sentiment.get_sentiment(text)

@app.get("/price", response_model=PriceResponse)
def get_price(ticker: str):
    return market.get_price(ticker)

@app.get("/history", response_model=HistoryResponse)
def get_history(ticker: str, period: str = "1mo"):
    return market.get_history(ticker, period)

app.include_router(data.router, prefix="/api")

@app.get("/cache/clear")
def clear_cache():
    """
    Manually clear all cached news data.
    Useful during testing or development.
    """
    result = news.clear_news_cache()
    return result
