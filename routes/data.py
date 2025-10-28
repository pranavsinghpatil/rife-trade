# routes/data.py
from fastapi import APIRouter, Query
from services import market, news, sentiment
from datetime import datetime
from utils.logger import log

router = APIRouter()

@router.get("/data")
def get_combined_data(ticker: str = Query(...), period: str = "1mo", market_code: str = "IN"):
    """Fetch combined stock, sentiment, and news data."""
    price_data = market.get_price(ticker)
    history_data = market.get_history(ticker, period)
    news_query = ticker.split('.')[0]
    log(f"News query: {news_query}")
    headlines_data = news.get_headlines(market=market_code, query=news_query)
    log(f"Headlines data from news service: {headlines_data}")

    # Combine headlines’ text for sentiment analysis
    headlines_with_sentiment = []
    if headlines_data.headlines:
        for h in headlines_data.headlines[:5]:  # Limit to first 5 for performance
            sentiment_result = sentiment.get_sentiment(h.title)
            h_dict = h.model_dump()
            h_dict["sentiment"] = sentiment_result.get("sentiment", "neutral")
            h_dict["confidence"] = sentiment_result.get("confidence", 0.0)
            headlines_with_sentiment.append(h_dict)
    
    log(f"Headlines with sentiment: {headlines_with_sentiment}")

    combined_text = " ".join([h["title"] for h in headlines_with_sentiment]) if headlines_with_sentiment else ""
    sentiment_data = sentiment.get_sentiment(combined_text) if combined_text else {
        "text": "", "sentiment": "neutral", "confidence": 0.0, "model": "none"
    }

    response_data = {
        "ticker": ticker,
        "price": price_data.price,
        "time": price_data.time,
        "history": history_data.history,
        "sentiment": sentiment_data,
        "headlines": headlines_with_sentiment,
        "meta": {
            "model_used": sentiment_data.get("model", "textblob"),
            "updated_at": datetime.utcnow().isoformat()
        }
    }
    log(f"Returning combined data: {response_data}")
    return response_data
