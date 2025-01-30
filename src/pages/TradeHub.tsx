
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoadingCard from "@/components/LoadingCard";
import TradeAnalytics from "@/components/TradeAnalytics";
import TradeMetrics from "@/components/TradeMetrics";
import { OpenTrade, TradeHistory } from "@/types/trades";

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
    <div className="w-full bg-background" style={{ marginTop: "-400px" }}>
      <div className="h-full overflow-y-auto">
        <div className="space-y-3 p-4 md:p-6 mx-auto">
          {isLoading ? (
            <LoadingCard />
          ) : (
            <>
              <div className="space-y-3 w-full">
                <TradeAnalytics />
                <TradeMetrics 
                  accountId={selectedAccount?.id?.toString()}
                  openTrades={openTrades}
                  tradeHistory={tradeHistory}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeHub;
