import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
from news import fetch_news
from gemma_api import get_sentiment

st.set_page_config(page_title="Rife-Trade", layout="wide")
st.title("📈 Rife-Trade: Real-Time Market Dashboard")

# --- Sidebar: Market selection
market_choice = st.sidebar.radio("🌍 Choose Market:", ["Indian Market", "Global Market"])
region = "india" if market_choice == "Indian Market" else "global"

# --- Sidebar: Index mapping
indices = {
    "Indian Market": {"Nifty 50": "^NSEI", "Sensex": "^BSESN"},
    "Global Market": {"Dow Jones": "^DJI", "Nasdaq": "^IXIC", "S&P 500": "^GSPC"}
}
index_map = indices[market_choice]
selected_index_name = st.sidebar.selectbox("Select Index", list(index_map.keys()))
selected_index_ticker = index_map[selected_index_name]

# --- Sidebar: News options
num_headlines = st.sidebar.slider("Number of headlines", 5, 20, 10)

# --- Fetch news
st.write(f"Fetching **{market_choice}** news...")
headlines = fetch_news(region=region, num_headlines=num_headlines)

# --- GEMMA sentiment
st.write("Analyzing sentiment with GEMMA-3N...")
sentiment_results = get_sentiment(headlines)

# --- Display headlines + sentiment
st.subheader("📰 Latest Headlines with Sentiment")
for h, sentiment, conf in sentiment_results:
    st.write(f"**{h}** → {sentiment} ({round(conf,2)})")

# --- Live index prices
st.subheader(f"📈 {selected_index_name} Price Trend (Last 60 Days)")
data = yf.download(selected_index_ticker, period="60d", progress=False)
data.reset_index(inplace=True)

fig = go.Figure()
fig.add_trace(go.Scatter(x=data['Date'], y=data['Close'], mode='lines+markers', name=selected_index_name))
fig.update_layout(title=f"{selected_index_name} Closing Price Trend", xaxis_title="Date", yaxis_title="Price")
st.plotly_chart(fig, use_container_width=True)

# --- Sentiment trend chart
st.subheader(f"📊 {selected_index_name} Sentiment Trend (Recent Headlines)")
if sentiment_results:
    sentiment_counts = pd.DataFrame(sentiment_results, columns=["headline","sentiment","confidence"])
    sentiment_counts = sentiment_counts.groupby("sentiment").size().reindex(["Positive Outlook","Negative Outlook","Stable"], fill_value=0)
    fig2 = go.Figure([go.Bar(x=sentiment_counts.index, y=sentiment_counts.values, marker_color=["green","red","gray"])])
    fig2.update_layout(title="Sentiment Distribution", xaxis_title="Sentiment", yaxis_title="Number of Headlines")
    st.plotly_chart(fig2, use_container_width=True)
