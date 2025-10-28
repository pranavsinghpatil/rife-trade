import yfinance as yf
from models.schemas import PriceResponse, HistoryResponse
from datetime import datetime

def get_price(ticker: str) -> PriceResponse:
    data = yf.Ticker(ticker)
    last = data.history(period="1d")
    if last.empty:
        return PriceResponse(ticker=ticker, price=None, time=datetime.now())
    return PriceResponse(
        ticker=ticker,
        price=round(last["Close"].iloc[-1], 2),
        time=last.index[-1]
    )

def get_history(ticker: str, period: str) -> HistoryResponse:
    period = period.lower()
    if period == '1w':
        period = '5d'
    elif period == '1m':
        period = '1mo'
    data = yf.Ticker(ticker).history(period=period)
    prices = [{"date": str(idx.date()), "price": round(row["Close"], 2)} for idx, row in data.iterrows()]
    return HistoryResponse(ticker=ticker, history=prices)
