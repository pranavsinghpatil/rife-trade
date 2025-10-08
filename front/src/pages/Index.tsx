"use client";

import { useState, useEffect, useCallback } from "react";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PriceCard } from "@/components/dashboard/PriceCard";
import { SentimentCard } from "@/components/dashboard/SentimentCard";
import { HeadlinesCard } from "@/components/dashboard/HeadlinesCard";
import { StatusLogCard } from "@/components/dashboard/StatusLogCard";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { SentimentBarChart } from "@/components/dashboard/SentimentBarChart";
import { SentimentPieChart } from "@/components/dashboard/SentimentPieChart";
import { PriceTable } from "@/components/dashboard/PriceTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Search, LayoutDashboard, TrendingUp, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// ========== INTERFACES ==========
interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "error";
  message: string;
}

interface Headline {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
}

interface PriceDataPoint {
  time: string;
  price: number;
  sentiment?: "positive" | "negative" | "neutral";
  headline?: string;
  confidence?: number;
}

// ========== MAIN COMPONENT ==========
const Index = () => {
  const { toast } = useToast();

  const [market, setMarket] = useState("indian");
  const [ticker, setTicker] = useState("RELIANCE");
  const [customTicker, setCustomTicker] = useState("");
  const [timeRange, setTimeRange] = useState("1M");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());


  // Mock data
  const priceData = {
    ticker,
    price: 2450.75,
    change: 32.5,
    changePercent: 1.34,
  };

  const sentimentData = {
    sentiment: "positive" as const,
    score: 0.72,
  };

  const headlines: Headline[] = [
    {
      title: "Reliance Industries announces major expansion in renewable energy sector",
      sentiment: "positive",
      confidence: 0.89,
    },
    {
      title: "Market experts predict strong Q4 results for major conglomerates",
      sentiment: "positive",
      confidence: 0.76,
    },
    {
      title: "Concerns raised over global supply chain disruptions affecting exports",
      sentiment: "negative",
      confidence: 0.68,
    },
  ];

  const priceChartData: PriceDataPoint[] = [
    { time: "09:15", price: 2418.25 },
    { time: "09:30", price: 2422.5 },
    { time: "09:45", price: 2428.75, sentiment: "positive", headline: headlines[0].title, confidence: 0.89 },
    { time: "10:00", price: 2435.0 },
    { time: "10:15", price: 2440.25, sentiment: "positive", headline: headlines[1].title, confidence: 0.76 },
    { time: "10:30", price: 2438.5 },
    { time: "10:45", price: 2442.0, sentiment: "negative", headline: headlines[2].title, confidence: 0.68 },
    { time: "11:00", price: 2445.75 },
    { time: "11:15", price: 2450.75 },
  ];

  const sentimentDistribution = [
    { sentiment: "Positive", count: 15 },
    { sentiment: "Negative", count: 5 },
    { sentiment: "Neutral", count: 8 },
  ];

  const indianTickers = ["RELIANCE", "TCS", "INFY", "HDFC", "WIPRO"];
  const globalTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

  const priceTableData = [
    { date: "2025-10-01", price: 2418.25, change: -8.5, changePercent: -0.35 },
    { date: "2025-10-02", price: 2435.0, change: 16.75, changePercent: 0.69 },
    { date: "2025-10-03", price: 2442.0, change: 7.0, changePercent: 0.29 },
    { date: "2025-10-04", price: 2450.75, change: 8.75, changePercent: 0.36 },
    { date: "2025-10-05", price: 2465.25, change: 14.5, changePercent: 0.59 },
    { date: "2025-10-06", price: 2458.0, change: -7.25, changePercent: -0.29 },
  ];

  // ========== AUTO REFRESH ==========
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;

      const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });
      const log = (type: LogEntry['type'], message: string) => {
        if (!isMounted) return;
        setLogs(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }), type, message }
        ].slice(-10));
      };

      try {
        await log('info', `Fetching latest data for ${ticker}...`);

        // Simulate API call
        // const response = await fetch(`/api/data/${ticker}`);
        // const data = await response.json();

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!isMounted) return;

        await log('success', 'Price data updated');
        await log('success', 'Sentiment analysis complete');
        setLastUpdate(new Date());

      } catch (error) {
        if (isMounted) {
          await log('error', `Failed to fetch data for ${ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval
    const interval = setInterval(fetchData, 60000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [ticker]);

  // ========== HANDLERS ==========
  const handleManualRefresh = useCallback(async () => {
    const now = new Date();
    const log = (type: LogEntry['type'], message: string) => {
      setLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          type,
          message
        }
      ].slice(-10));
    };

    try {
      await log('info', 'Manual refresh triggered');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      await log('success', 'Data refreshed successfully');
      setLastUpdate(new Date());
    } catch (error) {
      await log('error', `Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);


  const handleCustomTickerSearch = () => {
    if (customTicker.trim()) {
      setTicker(customTicker.toUpperCase());
      setCustomTicker("");
    }
  };

  const handlePredict = (period: string) => {
    toast({
      title: "⚠️ Prediction Disclaimer",
      description: `Predicted value for the next ${period}. Based on historical + sentiment data. Please verify before decisions.`,
      duration: 600,
    });
  };

  // ========== RETURN JSX ==========
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        {/* ===== HEADER ===== */}
        <header className="mb-8 relative">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 7H21V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Rife-Trade</h1>
                <p className="text-muted-foreground text-xs md:text-sm font-medium">
                  Real-time market intelligence platform
                </p>
              </div>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
        </header>

        {/* ===== MARKET & TICKER ===== */}
        <div className="mb-6 bg-card border border-border/50 p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* MARKET */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Market:</label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* TICKER */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Ticker:</label>
              <Select value={ticker} onValueChange={setTicker}>
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue placeholder="Select Ticker" />
                </SelectTrigger>
                <SelectContent>
                  {(market === "indian" ? indianTickers : globalTickers).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-1">
              <Input
                placeholder="Search ticker..."
                value={customTicker}
                onChange={(e) => setCustomTicker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomTickerSearch()}
                className="w-[140px] h-8 text-xs"
              />
              <Button onClick={handleCustomTickerSearch} variant="outline" size="sm" className="h-8 px-2">
                <Search className="w-3 h-3" />
              </Button>
            </div>

            <Button onClick={handleManualRefresh} className="bg-primary hover:bg-primary/90" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" /> Refresh
            </Button>

            <div className="ml-auto text-xs text-muted-foreground bg-muted px-3 py-1 rounded">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          {/* RANGE + PREDICT */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <div className="flex items-center gap-1">
              {["1W", "1M", "1Y", "5Y", "10Y"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="h-7 px-3 text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>

            <div className="h-4 w-px bg-border mx-1" />

            <div className="flex items-center gap-1">
              {["week", "month", "year"].map((period) => (
                <Button
                  key={period}
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => handlePredict(period)}
                >
                  Predict {period[0].toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Reports
            </TabsTrigger>
          </TabsList>

          {/* ===== OVERVIEW ===== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <InfoCard title="Current Price">
                <PriceCard {...priceData} />
              </InfoCard>

              <InfoCard title="Market Sentiment">
                <SentimentCard {...sentimentData} />
              </InfoCard>

              <InfoCard title="System Status">
                <StatusLogCard logs={logs} />
              </InfoCard>
            </div>

            <InfoCard title="Latest Market Headlines">
              <HeadlinesCard headlines={headlines} />
            </InfoCard>
          </TabsContent>

          {/* ===== ANALYSIS ===== */}
          <TabsContent value="analysis" className="space-y-6">
            <InfoCard title={`Price & Sentiment Timeline (${timeRange})`}>
              <div className="h-[400px] w-full">
                <PriceChart data={priceChartData} />
              </div>
            </InfoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoCard title="Sentiment Distribution Analysis">
                <div className="h-[350px] w-full">
                  <SentimentBarChart data={sentimentDistribution} />
                </div>
              </InfoCard>

              <InfoCard title="Sentiment Overview">
                <div className="h-[350px] w-full">
                  <SentimentPieChart data={sentimentDistribution} />
                </div>
              </InfoCard>
            </div>
          </TabsContent>

          {/* ===== REPORTS ===== */}
          <TabsContent value="reports" className="space-y-6">
            <InfoCard title="Historical Price Data & Reports">
              <PriceTable data={priceTableData} ticker={ticker} />
            </InfoCard>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
