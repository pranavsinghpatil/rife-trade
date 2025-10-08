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

const BACKEND_URL = "http://localhost:8000";

// ========== MAIN COMPONENT ==========
const Index = () => {
  const { toast } = useToast();

  const [market, setMarket] = useState("indian");
  const [ticker, setTicker] = useState("RELIANCE");
  const [customTicker, setCustomTicker] = useState("");
  const [timeRange, setTimeRange] = useState("1M");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetched data states
  const [priceData, setPriceData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [priceChartData, setPriceChartData] = useState<PriceDataPoint[]>([]);
  const [sentimentDistribution, setSentimentDistribution] = useState<any[]>([]);
  const [priceTableData, setPriceTableData] = useState<any[]>([]);

  // ---------- Logger ----------
  const addLog = (type: LogEntry["type"], message: string) => {
    setLogs((prev) => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }), type, message },
    ].slice(-10));
  };

  // ---------- Fetch Data ----------
  const fetchAllData = useCallback(async () => {
    try {
      addLog("info", `Fetching data for ${ticker}...`);

      // Price
      const priceRes = await fetch(`${BACKEND_URL}/price?ticker=${ticker}`);
      const priceJson = await priceRes.json();
      if (priceJson?.price) {
        setPriceData(priceJson);
        addLog("success", "Price updated");
      }

      // Sentiment
      const sentimentRes = await fetch(`${BACKEND_URL}/sentiment?text=${encodeURIComponent(ticker)} news today`);
      const sentimentJson = await sentimentRes.json();
      if (sentimentJson?.sentiment) {
        setSentimentData(sentimentJson);
        addLog("success", "Sentiment updated");
      }

      // Headlines
      const headRes = await fetch(`${BACKEND_URL}/headlines?market=${market}`);
      const headJson = await headRes.json();
      if (headJson?.headlines) {
        setHeadlines(headJson.headlines);
        addLog("success", "Headlines updated");
      }

      // Price History
      const historyRes = await fetch(`${BACKEND_URL}/history?ticker=${ticker}&period=${timeRange}`);
      const historyJson = await historyRes.json();
      if (historyJson?.history) {
        const formatted = historyJson.history.map((item: any) => ({
          time: item.time,
          price: item.price,
        }));
        setPriceChartData(formatted);
        setPriceTableData(formatted.map((d: any) => ({
          date: d.time,
          price: d.price,
          change: 0,
          changePercent: 0,
        })));
        addLog("success", "Price history loaded");
      }

      // Sentiment distribution mock (until backend supports it)
      setSentimentDistribution([
        { sentiment: "Positive", count: Math.floor(Math.random() * 20) + 10 },
        { sentiment: "Negative", count: Math.floor(Math.random() * 10) + 5 },
        { sentiment: "Neutral", count: Math.floor(Math.random() * 15) + 5 },
      ]);

      setLastUpdate(new Date());
    } catch (error) {
      addLog("error", `Data fetch failed: ${(error as Error).message}`);
    }
  }, [ticker, market, timeRange]);

  // ---------- Auto Refresh ----------
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // ---------- Handlers ----------
  const handleManualRefresh = async () => {
    addLog("info", "Manual refresh triggered");
    await fetchAllData();
    toast({ title: "Data Refreshed", description: "Latest data loaded successfully." });
  };

  const handleCustomTickerSearch = () => {
    if (customTicker.trim()) {
      setTicker(customTicker.toUpperCase());
      setCustomTicker("");
      addLog("info", `Switched to ${customTicker.toUpperCase()}`);
    }
  };

  const handlePredict = (period: string) => {
    toast({
      title: "⚠️ Prediction Disclaimer",
      description: `Predicted value for the next ${period}. Based on historical + sentiment data. Verify before decisions.`,
      duration: 6000,
    });
  };

  // ---------- Render ----------
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
                <PriceCard {...(priceData || { price: 0, ticker })} />
              </InfoCard>

              <InfoCard title="Market Sentiment">
                <SentimentCard {...(sentimentData || { sentiment: "neutral", score: 0 })} />
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
