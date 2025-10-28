import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchHeadlinesChunk } from "../../services/api";
import { X } from "lucide-react";

interface Headline {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  published?: string;
}

interface HeadlinesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  initialHeadlines: Headline[];
}

const PAGE_SIZE = 10;

export const HeadlinesOverlay = ({ isOpen, onClose, ticker, initialHeadlines }: HeadlinesOverlayProps) => {
  const [currentHeadlines, setCurrentHeadlines] = useState<Headline[]>(initialHeadlines);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentHeadlines(initialHeadlines);
      setCurrentPage(1);
      setHasMore(initialHeadlines.length === PAGE_SIZE); // Assume has more if initial load fills a page
    }
  }, [isOpen, initialHeadlines]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}${year}`;
  };

  const loadMoreHeadlines = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchHeadlinesChunk(ticker, "IN", nextPage, PAGE_SIZE);
      if (response.headlines && response.headlines.length > 0) {
        setCurrentHeadlines((prevHeadlines) => [...prevHeadlines, ...response.headlines]);
        setCurrentPage(nextPage);
        setHasMore(response.headlines.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more headlines:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All Headlines for {ticker}</DialogTitle>
          <DialogDescription>
            Comprehensive news coverage and sentiment analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4"> {/* Custom scrollbar */}
          <TooltipProvider>
            <div className="space-y-3">
              {currentHeadlines.map((headline, index) => (
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
            </div>
          </TooltipProvider>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button onClick={loadMoreHeadlines} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};