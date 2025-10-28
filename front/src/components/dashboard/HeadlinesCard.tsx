import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react"; // Import icon

interface Headline {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  published?: string; // Add published field
}

interface HeadlinesCardProps {
  initialHeadlines?: Headline[];
  ticker: string;
  onExpandClick: (ticker: string) => void; // Callback to open overlay
}

export const HeadlinesCard = ({ initialHeadlines = [], ticker, onExpandClick }: HeadlinesCardProps) => {
  const [currentHeadlines, setCurrentHeadlines] = useState<Headline[]>(initialHeadlines);

  useEffect(() => {
    setCurrentHeadlines(initialHeadlines);
  }, [initialHeadlines]);

  const getSentimentVariant = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const displayedHeadlines = currentHeadlines.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}${year}`;
  };


  if (!currentHeadlines.length) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        No headlines available
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 relative">
        {displayedHeadlines.map((headline, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="flex items-start gap-2 cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-colors">
                <Badge
                  variant={getSentimentVariant(headline.sentiment)}
                  className="mt-0.5 shrink-0"
                >
                  {headline.sentiment}
                </Badge>
                <p className="text-sm text-foreground line-clamp-2 flex-1">
                  {headline.title}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p className="text-sm">{headline.title}</p>
              {headline.published && (
                <p className="text-xs text-muted-foreground mt-1">
                  Published: {formatDate(headline.published)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Confidence: {(headline.confidence * 100).toFixed(1)}%
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
        {currentHeadlines.length > 5 && (
          <div className="absolute bottom-0 right-0 p-2">
            <Button variant="ghost" size="sm" onClick={() => onExpandClick(ticker)}>
              <ChevronRight className="h-4 w-4 mr-1" /> Expand All
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
