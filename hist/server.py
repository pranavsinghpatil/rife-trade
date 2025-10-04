from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn
from rich import print as rprint
from news import fetch_news
from market import fetch_price_full
from sentiment import analyze_headlines
from config import PORT

app = FastAPI(title="Rife-Trade Backend (No Gemma)")

def log_info(msg):
    rprint(f"[cyan][{datetime.now().strftime('%H:%M:%S')}][INFO][/cyan] {msg}")

def log_ok(msg):
    rprint(f"[green][{datetime.now().strftime('%H:%M:%S')}][OK][/green] {msg}")

def log_err(msg):
    rprint(f"[red][{datetime.now().strftime('%H:%M:%S')}][ERR][/red] {msg}")

@app.get("/api/status")
def status():
    return {"status": "ok", "time": datetime.now().isoformat()}

@app.get("/api/data")
def get_data(market: str = Query("Indian Market"), ticker: str = Query(None), n: int = Query(10)):
    log_info(f"Request: market={market} ticker={ticker} n={n}")
    try:
        # default ticker
        if ticker is None:
            ticker = "Nifty 50" if market == "Indian Market" else "Dow Jones"

        # 1) Price
        log_info(f"Fetching price for {ticker}")
        price_payload = fetch_price_full(ticker)
        if price_payload.get("status") == "OK":
            log_ok(f"Price OK: {price_payload['price']} ({price_payload['change_pct']}%)")
        else:
            log_err(f"Price fallback used: {price_payload.get('status')}")

        # 2) News
        region = "india" if ticker in ["Nifty 50", "Sensex", "Reliance", "TCS"] else "global"
        log_info(f"Fetching news for region={region}")
        headlines = fetch_news(region=region, n=n)
        if len(headlines):
            log_ok(f"Headlines fetched: {len(headlines)}")
        else:
            log_err("Headlines empty, used fallback")

        # 3) Sentiment
        log_info("Analyzing sentiment (ollama -> local -> heuristic)")
        text_list = [h["title"] for h in headlines]
        sentiments = analyze_headlines(text_list, prefer="ollama")
        log_ok("Sentiment analysis complete")

        # aggregates
        pos = sum(1 for s in sentiments if s["label"] == "Positive Outlook")
        neg = sum(1 for s in sentiments if s["label"] == "Negative Outlook")
        neu = sum(1 for s in sentiments if s["label"] == "Stable")
        score = pos - neg
        sentiment_score_norm = score / max(1, (pos + neg + neu))

        # derive sentiment signal
        sentiment_signal = "Stable"
        if sentiment_score_norm >= 0.2:
            sentiment_signal = "Positive Outlook"
        elif sentiment_score_norm <= -0.2:
            sentiment_signal = "Negative Outlook"

        # combine signals
        sma_signal = price_payload.get("sma_signal", "Neutral")
        combined = "Neutral"
        if sma_signal == "Bullish" and sentiment_signal == "Positive Outlook":
            combined = "Strong Bullish"
        elif sma_signal == "Bearish" and sentiment_signal == "Negative Outlook":
            combined = "Strong Bearish"
        elif sma_signal == "Bullish" or sentiment_signal == "Positive Outlook":
            combined = "Bullish"
        elif sma_signal == "Bearish" or sentiment_signal == "Negative Outlook":
            combined = "Bearish"

        payload = {
            "market": market,
            "ticker": ticker,
            "price": price_payload,
            "headlines": sentiments,
            "aggregates": {"positive": pos, "negative": neg, "neutral": neu, "raw_score": score, "norm_score": round(sentiment_score_norm,4)},
            "signals": {"sma": sma_signal, "sentiment": sentiment_signal, "combined": combined},
            "last_update": datetime.now().isoformat()
        }

        return JSONResponse(content=payload)

    except Exception as e:
        log_err(f"Unhandled error: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    rprint("[yellow]Starting Rife-Trade backend (no Gemma) on port {PORT}[/yellow]")
    uvicorn.run("server:app", host="0.0.0.0", port=PORT, reload=False)
