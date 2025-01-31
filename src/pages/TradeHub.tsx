
import { useEffect, useState } from "react";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import DailyDataWidget from "@/components/DailyDataWidget";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
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
  const navigate = useNavigate();
  const selectedAccount = location.state?.selectedAccount;
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Changed to true for default dark mode
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
    // Update body class when dark mode changes
    document.body.classList.toggle('dark', isDarkMode);
    // Initialize dark mode on component mount
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, [isDarkMode]);

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
    <div className={`flex-1 space-y-6 p-8 min-h-screen max-w-[2160px] mx-auto ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#FFFFFF] text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-lg">Loading data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-3 gap-6 animate-fade-in">
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Last 5 Days Result</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {metrics.percentageGain.toFixed(2)}%
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Maximum Drawdown</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {metrics.maxDrawdown.toFixed(2)}%
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Floating P/L</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${metrics.floatingPL.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Chart and Daily Data Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className={`col-span-2 ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} p-6 rounded-lg shadow-lg border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <DailyGainChart accountId={selectedAccount?.id?.toString()} />
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} p-6 rounded-lg shadow-lg border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <ScrollArea className="h-[400px]">
                <DailyDataWidget accountId={selectedAccount?.id?.toString()} />
              </ScrollArea>
            </div>
          </div>

          {/* Trading Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 animate-fade-in">
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Average Win</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${Math.abs(tradingMetrics.avgWin).toFixed(2)}
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Average Loss</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${Math.abs(tradingMetrics.avgLoss).toFixed(2)}
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Win Rate</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {tradingMetrics.winRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Additional Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 animate-fade-in">
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Total Results</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${tradingMetrics.totalResults.toFixed(2)}
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Total Balance</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${tradingMetrics.totalBalance.toFixed(2)}
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Profit Factor</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {tradingMetrics.profitFactor.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Final Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 animate-fade-in">
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Max Closed DD</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {tradingMetrics.maxClosedDrawdown.toFixed(2)}%
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Total Orders</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {tradingMetrics.totalOrders}
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} hover:${isDarkMode ? 'bg-[#252525]' : 'bg-[#FFFFFF]'} transition-all duration-300 p-6 rounded-lg shadow-lg hover:shadow-xl border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white/70' : 'text-black'}`}>Last Trade</h3>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ${tradingMetrics.lastTradeTake.toFixed(2)}
              </p>
            </div>
          </div>

          {/* History Table */}
          <div className={`${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F6F6F7]'} p-6 rounded-lg shadow-lg border ${isDarkMode ? 'border-[#333333]' : 'border-[#E5E5E5]'}`}>
            <HistoryTable history={tradeHistory} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHub;
