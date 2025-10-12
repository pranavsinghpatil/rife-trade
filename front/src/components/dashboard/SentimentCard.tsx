interface SentimentCardProps {
  sentiment?: "positive" | "negative" | "neutral";
  score?: number;
  model?: string;
}

export const SentimentCard = ({ sentiment, score, model = "LLM" }: SentimentCardProps) => {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive":
        return "bg-success";
      case "negative":
        return "bg-destructive";
      case "neutral":
        return "bg-muted-foreground";
      default:
        return "bg-gray-500";
    }
  };

  const getSentimentText = () => {
    if (!sentiment) return "No sentiment data";
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full ${getSentimentColor()}`} />
        <span className="text-lg font-semibold text-foreground">
          {getSentimentText()}
        </span>
      </div>

      <div className="text-2xl font-bold text-foreground">
        Score:{" "}
        {typeof score === "number" && !isNaN(score)
          ? score.toFixed(2)
          : "N/A"}
      </div>

      <div className="text-xs text-muted-foreground">
        Derived from latest news via {model}
      </div>
    </div>
  );
};
