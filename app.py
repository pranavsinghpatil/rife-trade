# app.py
from fastapi import FastAPI, Query
from services import news, market, sentiment, status
from models.schemas import PriceResponse, SentimentResponse, HeadlinesResponse, StatusResponse, HistoryResponse
from utils.logger import log

app = FastAPI(title="Rife Trade Backend", version="1.0")

@app.get("/", response_model=StatusResponse)
def check_status():
    return status.check_services()

@app.get("/headlines", response_model=HeadlinesResponse)
def get_headlines(market: str = "IN"):
    return news.get_headlines(market)

@app.get("/sentiment", response_model=SentimentResponse)
def analyze_sentiment(text: str = Query(..., min_length=5)):
    return sentiment.get_sentiment(text)

@app.get("/price", response_model=PriceResponse)
def get_price(ticker: str):
    return market.get_price(ticker)

@app.get("/history", response_model=HistoryResponse)
def get_history(ticker: str, period: str = "1mo"):
    return market.get_history(ticker, period)
