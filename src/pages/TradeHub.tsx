<lov-code>
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import DailyDataWidget from "@/components/DailyDataWidget";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetricCard from "@/components/MetricCard";

interface OpenTrade {
  openTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  tp: number;
  sl: number;
  comment: string;
  profit: number;
  pips: number;
  swap: number;
  magic: number;
}

interface TradeHistory {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  closePrice: number;
  tp: number;
  sl: number;
  comment: string;
  pips: number;
  profit: number;
  interest: number;
  commission: number;
}

interface OpenTradesResponse {
  error: boolean;
  message: string;
  openTrades: OpenTrade[];
}

interface HistoryResponse {
  error: boolean;
  message: string;
  history: TradeHistory[];
}

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate metrics for the last 5 days
  const calculateRecentMetrics = (history: TradeHistory[], opens: OpenTrade[]) => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Filter trades from last 5 days
    const recentTrades = history.filter(trade => 
      new Date(trade.closeTime) >= fiveDaysAgo
    );

    // Calculate total profit/loss for recent trades
    const recentProfit = recentTrades.reduce((sum, trade) => 
      sum + trade.profit + trade.interest + trade.commission, 0
    );

    // Calculate percentage gain
    const totalProfit = recentProfit;
    const percentageGain = ((recentProfit / (selectedAccount?.balance || 1)) * 100);

    // Calculate floating P/L and count open orders
    const floatingPL = opens.reduce((sum, trade) => sum + trade.profit + trade.swap, 0);
    const openOrdersCount = opens.length;

    // Calculate maximum drawdown over the last 5 days
    let maxBalance = selectedAccount?.balance || 0;
    let maxDrawdown = 0;
    
    recentTrades.forEach(trade => {
      const tradeResult = trade.profit + trade.interest + trade.commission;
      maxBalance = Math.max(maxBalance, maxBalance + tradeResult);
      const drawdown = ((maxBalance - (maxBalance + tradeResult)) / maxBalance) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return {
      percentageGain,
      totalProfit,
      maxDrawdown,
      floatingPL,
      openOrdersCount
    };
  };

  // Calculate all-time trading metrics from history
  const calculateTradingMetrics = (history: TradeHistory[]) => {
    if (!history.length) return { 
      avgWin: 0, 
      avgLoss: 0, 
      winRate: 0,
      totalResults: 0,
      totalBalance: 0,
      profitFactor: 0,
      maxClosedDrawdown: 0,
      totalOrders: 0,
      lastTradeTake: 0
    };

    const winningTrades = history.filter(trade => 
      (trade.profit + trade.interest + trade.commission) > 0
    );
    const losingTrades = history.filter(trade => 
      (trade.profit + trade.interest + trade.commission) <= 0
    );

    const totalWinnings = winningTrades.reduce((sum, trade) => 
      sum + trade.profit + trade.interest + trade.commission, 0
    );

    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => 
      sum + trade.profit + trade.interest + trade.commission, 0
    ));

    const profitFactor = totalLosses === 0 ? totalWinnings : totalWinnings / totalLosses;

    const avgWin = winningTrades.length > 0
      ? totalWinnings / winningTrades.length
      : 0;

    const avgLoss = losingTrades.length > 0
      ? totalLosses / losingTrades.length
      : 0;

    const winRate = (winningTrades.length / history.length) * 100;

    // Calculate total results (sum of all trades)
    const totalResults = history.reduce((sum, trade) => 
      sum + trade.profit + trade.interest + trade.commission, 0
    );

    // Get the last trade's profit
    const lastTradeTake = history.length > 0 
      ? history[0].profit + history[0].interest + history[0].commission
      : 0;

    return {
      avgWin,
      avgLoss,
      winRate,
      totalResults,
      totalBalance: selectedAccount?.balance || 0,
      profitFactor,
      maxClosedDrawdown: metrics.maxDrawdown,
      totalOrders: history.length,
      lastTradeTake
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAccount?.id) return;

      const session = localStorage.getItem("myfxbook_session");
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active session found. Please login again.",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Fetch open trades
        console.log("Fetching trades for account:", selectedAccount.id);
        const openTradesResponse = await fetch(
          `https://www.myfxbook.com/api/get-open-trades.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(selectedAccount.id)}`
        );

        if (!openTradesResponse.ok) {
          throw new Error("Failed to fetch open trades");
        }

        const openTradesData: OpenTradesResponse = await openTradesResponse.json();
        console.log("Open Trades API Response:", openTradesData);

        // Fetch trade history
        console.log("Fetching trade history for account:", selectedAccount.id);
        const historyResponse = await fetch(
          `https://www.myfxbook.com/api/get-history.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(selectedAccount.id)}`
        );

        if (!historyResponse.ok) {
          throw new Error("Failed to fetch trade history");
        }

        const historyData: HistoryResponse = await historyResponse.json();
        console.log("History API Response:", historyData);

        if (!openTradesData.error && !historyData.error) {
          setOpenTrades(openTradesData.openTrades || []);
          setTradeHistory(historyData.history || []);
        } else {
          throw new Error(openTradesData.message || historyData.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAccount?.id, toast]);

  const metrics = calculateRecentMetrics(tradeHistory, openTrades);
  const tradingMetrics = calculateTradingMetrics(tradeHistory);

  return (
    <div className="flex-
