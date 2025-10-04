from news import fetch_news
from gemma_api import get_sentiment
from market import fetch_index_data
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

# --- Config
markets = {
    "Indian Market": {"Nifty 50": "^NSEI", "Sensex": "^BSESN"},
    "Global Market": {"Dow Jones": "^DJI", "Nasdaq": "^IXIC", "S&P 500": "^GSPC"}
}
num_headlines = 10

# --- Fetch news & sentiment per market
all_sentiments = {}
all_headlines = {}

for market_name, indices in markets.items():
    region = "india" if "Indian" in market_name else "global"
    headlines = fetch_news(region=region, num_headlines=num_headlines)
    sentiments = get_sentiment(headlines)
    all_sentiments[market_name] = sentiments
    all_headlines[market_name] = headlines

# --- Print console summary
for market, sentiments in all_sentiments.items():
    print(f"\n=== {market} Headlines & Sentiment ===")
    for h, s, c in sentiments:
        print(f"{h} → {s} ({round(c,2)})")

# --- Multi-index price fetch
all_prices = {}
for market, indices in markets.items():
    for index_name, ticker in indices.items():
        data = fetch_index_data(ticker, period="60d")
        all_prices[index_name] = data

# --- Plot multi-index comparison
fig = go.Figure()
for index_name, data in all_prices.items():
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Close'], mode='lines', name=index_name))
fig.update_layout(title="📊 Multi-Index Price Comparison (Last 60 Days)",
                  xaxis_title="Date", yaxis_title="Price")
fig.write_html("multi_index_comparison.html")
print("Multi-index comparison chart saved as multi_index_comparison.html")

# --- Plot ticker-level sentiment overlay
for market, sentiments in all_sentiments.items():
    for index_name in markets[market].keys():
        data = all_prices[index_name]
        # For simplicity, overlay sentiment as points on last 10 days
        sentiment_dates = data['Date'].tail(len(sentiments))
        sentiment_labels = [s for _, s, _ in sentiments]
        sentiment_colors = {"Positive Outlook":"green", "Negative Outlook":"red", "Stable":"gray"}
        colors = [sentiment_colors.get(s, "gray") for s in sentiment_labels]

        fig2 = go.Figure()
        fig2.add_trace(go.Scatter(x=data['Date'], y=data['Close'], mode='lines+markers', name=index_name))
        fig2.add_trace(go.Scatter(
            x=sentiment_dates,
            y=data['Close'].tail(len(sentiments)),
            mode='markers',
            marker=dict(size=12, color=colors),
            name="Sentiment Overlay",
            text=[f"{h}<br>{s}" for h, s, _ in sentiments],
            hoverinfo="text"
        ))
        fig2.update_layout(title=f"📈 {index_name} Price with Sentiment Overlay",
                           xaxis_title="Date", yaxis_title="Price")
        filename = f"price_sentiment_{index_name.replace(' ','_')}.html"
        fig2.write_html(filename)
        print(f"Price + sentiment overlay saved as {filename}")

# --- Sentiment distribution per market
for market, sentiments in all_sentiments.items():
    sentiment_counts = pd.DataFrame(sentiments, columns=["headline","sentiment","confidence"])
    sentiment_counts = sentiment_counts.groupby("sentiment").size().reindex(["Positive Outlook","Negative Outlook","Stable"], fill_value=0)
    fig3 = go.Figure([go.Bar(x=sentiment_counts.index, y=sentiment_counts.values, marker_color=["green","red","gray"])])
    fig3.update_layout(title=f"Sentiment Distribution - {market}", xaxis_title="Sentiment", yaxis_title="Number of Headlines")
    filename = f"sentiment_trend_{market.replace(' ','_')}.html"
    fig3.write_html(filename)
    print(f"Sentiment trend chart saved as {filename}")
