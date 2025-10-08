import { useEffect, useState } from "react";
import { SentimentCard } from "./SentimentCard";
import { fetchSentiment } from "@/services/api";

export const SentimentSection = () => {
  const [sentimentData, setSentimentData] = useState<{
    sentiment: "positive" | "negative" | "neutral";
    confidence: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSentiment = async () => {
      try {
        setLoading(true);
        // You can change this text dynamically later, e.g. from latest news headlines.
        const res = await fetchSentiment("The market looks strong and investors are optimistic");
        setSentimentData({
          sentiment: res.sentiment,
          confidence: res.confidence,
        });
      } catch (err) {
        console.error("Sentiment fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSentiment();
  }, []);

  return (
    <div className="rounded-xl border p-5 shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Market Sentiment</h2>

      {loading && <div className="text-muted-foreground text-sm">Analyzing sentiment...</div>}

      {!loading && sentimentData && (
        <SentimentCard
          sentiment={sentimentData.sentiment}
          score={sentimentData.confidence}
        />
      )}

      {!loading && !sentimentData && (
        <div className="text-destructive text-sm">Failed to analyze sentiment.</div>
      )}
    </div>
  );
};
