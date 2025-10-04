# Rife-Trade 

LLM + embeddings powered market insights dashboard — ingest news & price data, surface succinct trading-relevant insights and explainable signals.

---

## Project outcome (what is in this repo skeleton)

* `notebooks/RifeTrade_notebook.ipynb` — end-to-end notebook (data → embeddings → index → retrieval → results + mini backtest). *Skeleton included below.*
* `app/streamlit_app.py` — small Streamlit dashboard to demo: enter ticker → fetch price → retrieve top news → summarise → show signals.
* `data/sample_news.csv` — a tiny example dataset so the app works out-of-box.
* `requirements.txt` — pip install list.
* `README.md` — polished project description (this doc), demo script, and interview bullets.

---

## Architecture (high level)

1. **Data ingestion** — price via `yfinance`, news via NewsAPI / web-scraper or uploaded CSV.
2. **Preprocessing** — simple text cleaning & timestamp alignment.
3. **Embeddings & index** — `sentence-transformers` (all-MiniLM) → FAISS index.
4. **Retrieval** — nearest-neighbours + filter by ticker/date.
5. **LLM summarization / Q&A** — HF `pipeline('summarization')` or small instruction model.
6. **Frontend** — Streamlit app that calls the retrieval + summarizer pipeline.
7. **(Optional)** lightweight backtest of a simple sentiment rule on historical price data.

---

## Notebook skeleton (`notebooks/RifeTrade_notebook.ipynb`)

* Cells:

  1. Title & imports
  2. Load sample data (or Kaggle dataset if you have it)
  3. EDA & quick charts
  4. Build embeddings (sentence-transformers)
  5. Build FAISS index & retrieval examples
  6. Summarization / LLM prompt examples
  7. Simple backtest: turn a summarizer-sentiment into a long/flat rule and compute cumulative returns
  8. Conclusions & next steps

