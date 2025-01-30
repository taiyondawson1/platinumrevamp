
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 bg-[#0A0B0F] min-h-screen">
      {isLoading ? (
        <Card className="bg-[#141522]/40 border-[#2A2D3E] backdrop-blur-sm shadow-lg">
          <div className="py-4">
            <p className="text-center text-[#E2E8F0]">Loading data...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-[#1D1F33]">
                  <svg className="w-6 h-6 text-[#0EA5E9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#8E9196]">Result 5 days ago</p>
                  <p className="text-2xl font-semibold text-[#0EA5E9]">0.00%</p>
                  <p className="text-sm text-[#22C55E]">+$4</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-[#1D1F33]">
                  <svg className="w-6 h-6 text-[#D946EF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#8E9196]">Closed drawdown 5 days ago</p>
                  <p className="text-2xl font-semibold text-[#D946EF]">0.00%</p>
                  <p className="text-sm text-[#8E9196]">$0</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-[#1D1F33]">
                  <svg className="w-6 h-6 text-[#8B5CF6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#8E9196]">Float</p>
                  <p className="text-2xl font-semibold text-[#8B5CF6]">£0</p>
                  <p className="text-sm text-[#8E9196]">0 orders</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
                <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">Last 30 days</h3>
                <DailyGainChart accountId={selectedAccount?.id?.toString()} />
              </Card>
            </div>
            <div>
              <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
                <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">Trade History</h3>
                <div className="space-y-2">
                  <HistoryTable history={tradeHistory.slice(0, 10)} />
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E2E8F0]">Average Win</h3>
                <span className="text-2xl font-bold text-[#22C55E]">£20</span>
              </div>
            </Card>
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E2E8F0]">Average Loss</h3>
                <span className="text-2xl font-bold text-[#EF4444]">-£183</span>
              </div>
            </Card>
            <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E2E8F0]">Win Rate</h3>
                <span className="text-2xl font-bold text-[#22C55E]">76%</span>
              </div>
            </Card>
          </div>

          {/* Orders Tables */}
          <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4">
            <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">Open Orders</h3>
            <OpenOrdersTable orders={openTrades} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default TradeHub;
