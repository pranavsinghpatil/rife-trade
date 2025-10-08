# routes/data.py
from fastapi import APIRouter, Query
from services import market, news, sentiment
from datetime import datetime

router = APIRouter()

@router.get("/data")
def get_combined_data(ticker: str = Query(...), period: str = "1mo", market_code: str = "IN"):
    """Fetch combined stock, sentiment, and news data."""
    price_data = market.get_price(ticker)
    history_data = market.get_history(ticker, period)
    headlines_data = news.get_headlines(market_code)

    # Combine headlines’ text for sentiment analysis
    combined_text = " ".join([h.title for h in headlines_data.headlines[:5]]) if headlines_data.headlines else ""
    sentiment_data = sentiment.get_sentiment(combined_text) if combined_text else {
        "text": "", "sentiment": "neutral", "confidence": 0.0, "model": "none"
    }

    return {
        "ticker": ticker,
        "price": price_data.price,
        "time": price_data.time,
        "history": history_data.history,
        "sentiment": sentiment_data,
        "headlines": [
            {"title": h.title, "source": h.source, "url": h.url, "published": h.published}
            for h in headlines_data.headlines
        ],
        "meta": {
            "model_used": sentiment_data.get("model", "textblob"),
            "updated_at": datetime.utcnow().isoformat()
        }
    }
