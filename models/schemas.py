from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PriceResponse(BaseModel):
    ticker: str
    price: Optional[float]
    time: datetime

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float
    model: str

class HeadlinesResponse(BaseModel):
    headlines: List[dict]


class StatusResponse(BaseModel):
    market: bool
    news: bool
    sentiment: bool
    ollama: bool

class HistoryResponse(BaseModel):
    ticker: str
    history: List[dict]
