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

class Headline(BaseModel):
    title: str
    source: Optional[str] = None
    sentiment: Optional[str] = "neutral"
    confidence: Optional[float] = 0.0
    url: Optional[str] = None
    published: Optional[str] = None

class HeadlinesResponse(BaseModel):
    headlines: List[Headline]

class StatusResponse(BaseModel):
    market: bool
    news: bool
    sentiment: bool
    ollama: bool

class HistoryResponse(BaseModel):
    ticker: str
    history: List[dict]
