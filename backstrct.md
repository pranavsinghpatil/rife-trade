rife-trade-backend/
│── app.py              # FastAPI entrypoint
│── services/
│     ├── news.py       # fetch headlines
│     ├── market.py     # fetch stock/index prices
│     ├── sentiment.py  # sentiment analysis (Ollama local)
│     └── status.py     # service health checks
│── models/
│     └── schemas.py    # Pydantic models for clean API response
│── utils/
│     └── logger.py     # pretty logging with Rich
│── .env                # contains NEWS_API_KEY
│── requirements.txt
